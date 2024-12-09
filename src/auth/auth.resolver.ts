import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { Role } from '../user/role.enum';

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

  @Mutation(() => Boolean)
  async register(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('role') role: Role,
  ): Promise<boolean> {
    await this.authService.register(username, password, role);
    return true;
  }
}