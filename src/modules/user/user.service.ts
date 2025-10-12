import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userRepository.create(createUserDto);
    return user;
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUsers(params?: {
    skip?: number;
    take?: number;
  }): Promise<UserResponseDto[]> {
    return this.userRepository.findMany(params);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(updateUserDto.email);
      if (userWithEmail) {
        throw new ConflictException('User with this email already exists');
      }
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async deleteUser(id: string): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.delete(id);
  }
}
