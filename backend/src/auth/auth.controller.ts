import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards, 
  Request, 
  HttpCode, 
  HttpStatus,
  NotFoundException 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() { email, password, role, client_id }: RegisterDto) {
    const user = await this.authService.register(email, password, role, client_id);
    return { success: true, data: user, message: 'User registered successfully' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: LoginDto) {
    const result = await this.authService.login(email, password);
    return { success: true, data: result, message: 'Login successful' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    const user = await this.usersService.findOne(req.user.sub);
    if (!user) throw new NotFoundException('User not found');
    
    const { password_hash, ...userWithoutPassword } = user;
    return { success: true, data: userWithoutPassword };
  }
}

