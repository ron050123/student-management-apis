import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClassService } from './class.service';
import { Class } from './class.entity';
import { User } from '../user/user.entity';
import { CreateClassDto } from '../dto/create-class.dto';
import { UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Role } from '../user/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Resolver(() => Class)
export class ClassResolver {
  constructor(private classService: ClassService) {}

  @Mutation(() => Class)
  @UsePipes(new ValidationPipe())
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  async createClass(
    @Args('createClassDto') createClassDto: CreateClassDto,
  ): Promise<Class> {
    const { name, subject, teacherId } = createClassDto;
    const teacher = new User();
    teacher.id = teacherId;
    return this.classService.createClass(name, subject, teacher);
  }

  @Query(() => [Class])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
  async classes(): Promise<Class[]> {
    return this.classService.findAllClasses();
  }

  @Query(() => Class)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
  async class(@Args('id') id: number): Promise<Class> {
    return this.classService.findClassById(id);
  }

  @Mutation(() => Class)
  @UsePipes(new ValidationPipe())
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  async updateClass(
    @Args('id') id: number,
    @Args('name') name: string,
    @Args('subject') subject: string,
  ): Promise<Class> {
    return this.classService.updateClass(id, name, subject);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  async deleteClass(@Args('id') id: number): Promise<boolean> {
    await this.classService.deleteClass(id);
    return true;
  }
}