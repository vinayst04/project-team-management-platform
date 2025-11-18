import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<any>,
  ) {}

  async findOne(id: string) {
    return this.clientRepository.findOne({
      where: { id },
      relations: ['users', 'projects'],
    });
  }

  async findAll() {
    return this.clientRepository.find({
      relations: ['users', 'projects'],
    });
  }

  async create(name: string) {
    const client = this.clientRepository.create({ name });
    return this.clientRepository.save(client);
  }

  async update(id: string, name: string) {
    await this.clientRepository.update(id, { name });
    return this.findOne(id);
  }

  async delete(id: string) {
    const client = await this.findOne(id);
    if (client) await this.clientRepository.remove(client);
    return client;
  }
}


