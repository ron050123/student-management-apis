import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string, role: Role): Promise<User> {
    const user = this.userRepository.create({ username, password, role });
    return this.userRepository.save(user);
  }

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async updateUser(id: number, username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    user.username = username;
    user.password = password;
    return this.userRepository.save(user);
  }
}