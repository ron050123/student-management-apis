import { Controller, Post, Body, Put, Param, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '../user/role.enum';
import { User } from '../user/user.entity';
import { Request } from 'express';

interface RegisterInput {
  username: string;
  password: string;
  role: Role;
}

interface LoginInput {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('input') input: RegisterInput,
    @Req() request: Request
  ): Promise<User> {
    console.log(Object.keys(request.body));
    return this.authService.register(input.username, input.password, input.role);
  }

  @Post('login')
  async login(
    @Body('input') input: LoginInput): Promise<{ access_token: string }> {
      const user = await this.authService.validateUser(input.username, input.password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      const loginResult = await this.authService.login(user);
      return {access_token: loginResult.access_token}
    }
  
  @Put('update/:id')
  async updateUser(
    @Body('input') input: { id: string, username: string, password: string },
  ): Promise<User> {
    const { id } = input;
    console.log('Received ID:', id); 
  if (id === ':id' || !id) {
    throw new BadRequestException('Invalid ID format');
  }

  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    throw new BadRequestException(`Invalid ID format: ${id}`);
  }
    return this.authService.updateUser(userId, input.username, input.password);
  }
}