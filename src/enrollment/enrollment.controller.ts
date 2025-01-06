import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Enrollment } from './enrollment.entity';
import { EnrollmentService } from './enrollment.service';
import { Class } from '../class/class.entity';

interface CreateEnrollmentInput {
  studentId: number;
  classId: number;
}

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  async (@Body('input') createEnrollmentInput: CreateEnrollmentInput): Promise<Enrollment> {
    const { studentId, classId } = createEnrollmentInput;
        const student = new User();
        student.id = studentId;
    
        const classEntity = new Class();
        classEntity.id = classId;
    
        return this.enrollmentService.enrollStudent(student, classEntity);
  }

  @Get('findEnrollmentsByStudent')
  async findEnrollmentsByStuden(@Body('input') studentId: number): Promise<Enrollment[]> {
      const student = new User();
      student.id = studentId;
      return this.enrollmentService.findEnrollmentsByStudent(student);
  }

  @Get('findEnrollmentsByClass')
    async findEnrollmentsByClass(@Body('input') classId: number): Promise<Enrollment[]> {
        const classEntity = new Class();
        classEntity.id = classId;
        return this.enrollmentService.findEnrollmentsByClass(classEntity);
    }

  @Delete()
  async remove(@Body('input') input: { id: number }): Promise<boolean> {
    const { id } = input;
    await this.enrollmentService.removeEnrollment(id);
    return true;
  }
}