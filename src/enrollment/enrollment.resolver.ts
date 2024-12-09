import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './enrollment.entity';
import { User } from '../user/user.entity';
import { Class } from '../class/class.entity';
import { Role } from '../user/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Enrollment)
export class EnrollmentResolver {
  constructor(private enrollmentService: EnrollmentService) {}

  @Mutation(() => Enrollment)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
  async enrollStudent(
    @Args('studentId') studentId: number,
    @Args('classId') classId: number,
  ): Promise<Enrollment> {
    const student = new User();
    student.id = studentId;

    const classEntity = new Class();
    classEntity.id = classId;

    return this.enrollmentService.enrollStudent(student, classEntity);
  }

  @Query(() => [Enrollment])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
  async enrollmentsByStudent(@Args('studentId') studentId: number): Promise<Enrollment[]> {
    const student = new User();
    student.id = studentId;
    return this.enrollmentService.findEnrollmentsByStudent(student);
  }

  @Query(() => [Enrollment])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
  async enrollmentsByClass(@Args('classId') classId: number): Promise<Enrollment[]> {
    const classEntity = new Class();
    classEntity.id = classId;
    return this.enrollmentService.findEnrollmentsByClass(classEntity);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
  async removeEnrollment(@Args('id') id: number): Promise<boolean> {
    await this.enrollmentService.removeEnrollment(id);
    return true;
  }
}