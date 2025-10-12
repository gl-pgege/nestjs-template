import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'User with email already exists' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [UserResponseDto] })
  async getUsers(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<UserResponseDto[]> {
    return this.userService.getUsers({ skip, take });
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'User with email already exists' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.deleteUser(id);
  }
}
