import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  @UsePipes(new ValidationPipe())
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    const { username, password, role } = createUserDto;
    return this.userService.createUser(username, password, role);
  }

  @Query(() => User)
  async user(@Args('id') id: number): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Mutation(() => User)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Args('id') id: number,
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<User> {
    return this.userService.updateUser(id, username, password);
  }
}