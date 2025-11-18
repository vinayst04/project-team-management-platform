import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignUserDto } from './dto/assign-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('api/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() { name, description }: CreateProjectDto, @Request() req) {
    const { role: userRole, clientId, sub: userId } = req.user;
    if (!clientId) throw new BadRequestException('User must be associated with a client');
    
    const canCreate = await this.projectsService.canCreateProject(userId, userRole, clientId);
    if (!canCreate) throw new ForbiddenException('Only global admins or users with project owner role can create projects');

    const project = await this.projectsService.create(name, description, clientId);
    return { success: true, data: project, message: 'Project created successfully' };
  }

  @Get()
  async findAll(@Request() req) {
    const { clientId, sub: userId, role: userRole } = req.user;
    if (!clientId) throw new BadRequestException('User must be associated with a client');
    
    const projects = await this.projectsService.findAll(clientId, userId, userRole);
    return { success: true, data: projects };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(id);
    if (!project) throw new NotFoundException('Project not found');
    return { success: true, data: project };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() { name, description }: UpdateProjectDto, @Request() req) {
    const { sub: userId, role: userRole } = req.user;
    const isAuthorized = await this.projectsService.isProjectOwnerOrAdmin(id, userId, userRole);
    if (!isAuthorized) throw new ForbiddenException('Only project owner or admin can update this project');

    const project = await this.projectsService.update(id, name, description);
    return { success: true, data: project, message: 'Project updated successfully' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const { sub: userId, role: userRole } = req.user;
    const isAuthorized = await this.projectsService.isProjectOwnerOrAdmin(id, userId, userRole);
    if (!isAuthorized) throw new ForbiddenException('Only project owner or admin can delete this project');

    const result = await this.projectsService.delete(id);
    return { success: true, data: result, message: 'Project deleted successfully' };
  }

  @Post(':id/users')
  @HttpCode(HttpStatus.CREATED)
  async assignUser(@Param('id') id: string, @Body() { user_id, role }: AssignUserDto, @Request() req) {
    const { sub: userId, role: userRole } = req.user;
    const isAuthorized = await this.projectsService.isProjectOwnerOrAdmin(id, userId, userRole);
    if (!isAuthorized) throw new ForbiddenException('Only project owner or admin can assign users');

    const assignment = await this.projectsService.assignUserByIdOrEmail(id, user_id, role);
    return { success: true, data: assignment, message: 'User assigned successfully' };
  }

  @Put(':id/users/:userId')
  async updateUserRole(@Param('id') id: string, @Param('userId') userId: string, @Body() { role }: UpdateUserRoleDto, @Request() req) {
    const { sub: currentUserId, role: userRole } = req.user;
    const isAuthorized = await this.projectsService.isProjectOwnerOrAdmin(id, currentUserId, userRole);
    if (!isAuthorized) throw new ForbiddenException('Only project owner or admin can update user roles');

    const assignment = await this.projectsService.updateUserRole(id, userId, role);
    return { success: true, data: assignment, message: 'User role updated successfully' };
  }

  @Delete(':id/users/:userId')
  async removeUser(@Param('id') id: string, @Param('userId') userId: string, @Request() req) {
    const { sub: currentUserId, role: userRole } = req.user;
    const isAuthorized = await this.projectsService.isProjectOwnerOrAdmin(id, currentUserId, userRole);
    if (!isAuthorized) throw new ForbiddenException('Only project owner or admin can remove users');

    const result = await this.projectsService.removeUser(id, userId);
    return { success: true, data: result, message: 'User removed successfully' };
  }

  @Get(':id/users')
  async getProjectUsers(@Param('id') id: string) {
    const users = await this.projectsService.getProjectUsers(id);
    return { success: true, data: users };
  }
}

