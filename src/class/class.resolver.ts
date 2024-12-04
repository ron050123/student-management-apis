import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClassService } from './class.service';
import { Class } from './class.entity';
import { User } from '../user/user.entity';
import { CreateClassDto } from '../dto/create-class.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Resolver(() => Class)
export class ClassResolver {
  constructor(private classService: ClassService) {}

  @Mutation(() => Class)
  @UsePipes(new ValidationPipe())
  async createClass(
    @Args('createClassDto') createClassDto: CreateClassDto,
  ): Promise<Class> {
    const { name, subject, teacherId } = createClassDto;
    const teacher = new User();
    teacher.id = teacherId;
    return this.classService.createClass(name, subject, teacher);
  }

  @Query(() => [Class])
  async classes(): Promise<Class[]> {
    return this.classService.findAllClasses();
  }

  @Query(() => Class)
  async class(@Args('id') id: number): Promise<Class> {
    return this.classService.findClassById(id);
  }

  @Mutation(() => Class)
  @UsePipes(new ValidationPipe())
  async updateClass(
    @Args('id') id: number,
    @Args('name') name: string,
    @Args('subject') subject: string,
  ): Promise<Class> {
    return this.classService.updateClass(id, name, subject);
  }

  @Mutation(() => Boolean)
  async deleteClass(@Args('id') id: number): Promise<boolean> {
    await this.classService.deleteClass(id);
    return true;
  }
}