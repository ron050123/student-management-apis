import { Controller, Get, Post, Delete, Body, UnauthorizedException, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Enrollment } from './enrollment.entity';
import { EnrollmentService } from './enrollment.service';
import { Class } from '../class/class.entity';
import { Role } from '../user/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

interface CreateEnrollmentInput {
  studentId: number;
  classId: number;
}

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
  async (@Body('input') 
  createEnrollmentInput: CreateEnrollmentInput,
  @CurrentUser() user: User,
  ): Promise<Enrollment> {
    const { studentId, classId } = createEnrollmentInput;
    if (user.id !== studentId) {
          throw new UnauthorizedException('You can only enroll yourself.');
        }
        const student = new User();
        student.id = studentId;
    
        const classEntity = new Class();
        classEntity.id = classId;
    
        return this.enrollmentService.enrollStudent(student, classEntity);
  }

  @Get('findEnrollmentsByStudent')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
  async findEnrollmentsByStuden(@Body('input') studentId: number): Promise<Enrollment[]> {
      const student = new User();
      student.id = studentId;
      return this.enrollmentService.findEnrollmentsByStudent(student);
  }

  @Get('findEnrollmentsByClass')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
    async findEnrollmentsByClass(@Body('input') classId: number): Promise<Enrollment[]> {
        const classEntity = new Class();
        classEntity.id = classId;
        return this.enrollmentService.findEnrollmentsByClass(classEntity);
    }

  @Delete()
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
  async remove(@Body('input') input: { id: number }): Promise<boolean> {
    const { id } = input;
    await this.enrollmentService.removeEnrollment(id);
    return true;
  }

  @Post('events/checkAndRemoveEnrollment')
  async checkAndRemoveEnrollment(@Body() payload: any): Promise<void> {
    console.log('Received payload:', payload);
    try {
      const { event } = payload;
      const enrollmentId = event.data.old.id;

      await this.enrollmentService.removeEnrollment(enrollmentId);
      console.log(`Enrollment ${enrollmentId} removed successfully`);
    } catch (error) {
      console.error('Error removing enrollment:', error);
      throw new HttpException('Failed to remove enrollment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}