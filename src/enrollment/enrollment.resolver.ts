import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './enrollment.entity';
import { User } from '../user/user.entity';
import { Class } from '../class/class.entity';

@Resolver(() => Enrollment)
export class EnrollmentResolver {
  constructor(private enrollmentService: EnrollmentService) {}

  @Mutation(() => Enrollment)
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
  async enrollmentsByStudent(@Args('studentId') studentId: number): Promise<Enrollment[]> {
    const student = new User();
    student.id = studentId;
    return this.enrollmentService.findEnrollmentsByStudent(student);
  }

  @Query(() => [Enrollment])
  async enrollmentsByClass(@Args('classId') classId: number): Promise<Enrollment[]> {
    const classEntity = new Class();
    classEntity.id = classId;
    return this.enrollmentService.findEnrollmentsByClass(classEntity);
  }

  @Mutation(() => Boolean)
  async removeEnrollment(@Args('id') id: number): Promise<boolean> {
    await this.enrollmentService.removeEnrollment(id);
    return true;
  }
}