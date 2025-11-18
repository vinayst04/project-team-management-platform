import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<any>,
  ) {}

  async findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['client'],
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['client'],
    });
  }

  async findByClient(clientId: string) {
    return this.userRepository.find({
      where: { client: { id: clientId } },
      relations: ['client'],
    });
  }

  async create(userData: any) {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: string, userData: any) {
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async delete(id: string) {
    const user = await this.findOne(id);
    if (user) await this.userRepository.remove(user);
    return user;
  }
}


