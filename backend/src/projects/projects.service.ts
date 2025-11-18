import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectUser } from './entities/project-user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<any>,
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<any>,
    private readonly usersService: UsersService,
  ) {}

  async create(name: string, description: string, clientId: string) {
    const project = this.projectRepository.create({ name, description, client: { id: clientId } });
    return this.projectRepository.save(project);
  }

  async findAll(clientId: string, userId: string, userRole: string) {
    // Admins can see all projects in their company
    if (userRole === 'admin') {
      return this.projectRepository.find({
        where: { client: { id: clientId } },
        relations: ['client', 'projectUsers', 'projectUsers.user'],
      });
    }

    // Members can only see projects they are assigned to
    const assignedProjectUsers = await this.projectUserRepository.find({
      where: { user: { id: userId } },
      relations: ['project', 'project.client', 'project.projectUsers', 'project.projectUsers.user'],
    });

    return assignedProjectUsers.map(pu => pu.project);
  }

  async findOne(id: string) {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'projectUsers', 'projectUsers.user'],
    });
  }

  async update(id: string, name: string, description: string) {
    const project = await this.findOne(id);
    if (!project) throw new NotFoundException('Project not found');
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    return this.projectRepository.save(project);
  }

  async delete(id: string) {
    const project = await this.findOne(id);
    if (!project) throw new NotFoundException('Project not found');
    await this.projectRepository.remove(project);
    return { message: 'Project deleted successfully' };
  }

  async assignUserByIdOrEmail(projectId: string, userIdOrEmail: string, role: string) {
    const project = await this.findOne(projectId);
    if (!project) throw new NotFoundException('Project not found');

    const user = await this.findUserByIdOrEmail(userIdOrEmail);
    if (!user) throw new NotFoundException('User not found');

    // Validate that user belongs to the same company as the project
    if (user.client?.id !== project.client?.id) {
      throw new ConflictException('User must belong to the same company as the project');
    }

    const existingAssignment = await this.projectUserRepository.findOne({
      where: { project: { id: projectId }, user: { id: user.id } },
    });
    if (existingAssignment) throw new ConflictException('User is already assigned to this project');

    const projectUser = this.projectUserRepository.create({ project: { id: projectId }, user: { id: user.id }, role });
    return this.projectUserRepository.save(projectUser);
  }

  async findUserByIdOrEmail(userIdOrEmail: string) {
    return this.isValidEmail(userIdOrEmail) 
      ? this.usersService.findByEmail(userIdOrEmail)
      : this.usersService.findOne(userIdOrEmail);
  }

  private isValidEmail(email: string): boolean {
    return email.includes('@');
  }

  async updateUserRole(projectId: string, userId: string, role: string) {
    const projectUser = await this.projectUserRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId } },
    });
    if (!projectUser) throw new NotFoundException('User assignment not found');
    projectUser.role = role;
    return this.projectUserRepository.save(projectUser);
  }

  async removeUser(projectId: string, userId: string) {
    const projectUser = await this.projectUserRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId } },
    });
    if (!projectUser) throw new NotFoundException('User assignment not found');
    await this.projectUserRepository.remove(projectUser);
    return { message: 'User removed from project successfully' };
  }

  async getProjectUsers(projectId: string) {
    const projectUsers = await this.projectUserRepository.find({
      where: { project: { id: projectId } },
      relations: ['user', 'user.client'],
    });

    return projectUsers.map(pu => ({
      id: pu.id,
      role: pu.role,
      user: { id: pu.user.id, email: pu.user.email, role: pu.user.role },
    }));
  }

  async isProjectOwnerOrAdmin(projectId: string, userId: string, userRole: string) {
    if (userRole === 'admin') return true;
    const projectUser = await this.projectUserRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId } },
    });
    return projectUser && projectUser.role === 'owner';
  }

  async canCreateProject(userId: string, userRole: string, clientId: string): Promise<boolean> {
    if (userRole === 'admin') return true;
    const projectUser = await this.projectUserRepository.findOne({
      where: { user: { id: userId }, role: 'owner', project: { client: { id: clientId } } },
      relations: ['project', 'project.client'],
    });
    return !!projectUser;
  }
}

