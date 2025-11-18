import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly clientsService: ClientsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, role: string = null, clientId: string = null) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new ConflictException('A user with this email already exists');

    const client = await this.getOrCreateClient(clientId);
    const password_hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, password_hash, role, client });
    
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    return {
      access_token: this.generateToken(user),
      user: { id: user.id, email: user.email, role: user.role, client: user.client },
    };
  }

  generateToken(user: any) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      clientId: user.client?.id,
    });
  }

  async getOrCreateClient(clientId: string) {
    if (clientId) {
      const client = await this.clientsService.findOne(clientId);
      if (!client) throw new NotFoundException(`Client with ID "${clientId}" not found`);
      return client;
    }

    // Create a unique client for each new registration
    const timestamp = Date.now();
    return this.clientsService.create(`Company-${timestamp}`);
  }

  async validateUser(payload: any) {
    return this.usersService.findOne(payload.sub);
  }
}

