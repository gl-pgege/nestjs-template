import { Injectable } from '@nestjs/common';
import { User } from '@prisma/primary-client';
import { PrimaryDatabaseService } from '@/database/primary-database.service';
import { BaseRepository } from '@/common/base-repository';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserRepository extends BaseRepository<User, CreateUserDto, UpdateUserDto> {
  constructor(private readonly prisma: PrimaryDatabaseService) {
    super();
  }

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findMany(params?: {
    skip?: number;
    take?: number;
    where?: any;
  }): Promise<User[]> {
    return this.prisma.user.findMany(params);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
