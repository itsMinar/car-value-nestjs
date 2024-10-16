import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const newUser = this.repo.create({ email, password });

    return this.repo.save(newUser);
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    return this.repo.findOneBy({ id });
  }

  findAll(email: string) {
    return this.repo.findBy({ email });
  }

  async update(id: number, updatedInfo: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updatedInfo);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.repo.remove(user);
  }
}
