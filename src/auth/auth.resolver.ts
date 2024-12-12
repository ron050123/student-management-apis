import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { Role } from '../user/role.enum';
import { User } from '../user/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  checkAuth(): string {
    return 'You are logged in!';
}

  @Mutation(() => String)
  async login(
  @Args('username') username: string,
  @Args('password') password: string,
): Promise<string> {
  const user = await this.authService.validateUser(username, password);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const loginResult = await this.authService.login(user);
  return loginResult.access_token;
}

  @Mutation(() => User)
  async register(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('role') role: Role,
  ): Promise<User> {
    return this.authService.register(username, password, role);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<User> {
    const numericId = parseInt(id, 10); // Convert id to number
    return this.authService.updateUser(numericId, username, password);
  }
}