import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { User } from '../user/user.entity';
import { Class } from '../class/class.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async enrollStudent(student: User, classEntity: Class): Promise<Enrollment> {
    const enrollment = this.enrollmentRepository.create({ student, class: classEntity });
    return this.enrollmentRepository.save(enrollment);
  }

  async findEnrollmentsByStudent(student: User): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({ where: { student }, relations: ['class'] });
  }

  async findEnrollmentsByClass(classEntity: Class): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({ where: { class: classEntity }, relations: ['student'] });
  }

  async removeEnrollment(id: number): Promise<void> {
    await this.enrollmentRepository.delete(id);
  }

  async searchEnrollmentsByStudent(studentId: number, className: string, teacherName: string): Promise<Enrollment[]> {
    const query = this.enrollmentRepository.createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.class', 'class')
      .leftJoinAndSelect('class.teacher', 'teacher')
      .where('enrollment.studentId = :studentId', { studentId });

    if (className) {
      query.andWhere('class.name ILIKE :className', { className: `%${className}%` });
    }

    if (teacherName) {
      query.andWhere('teacher.username ILIKE :teacherName', { teacherName: `%${teacherName}%` });
    }

    return query.getMany();
  }
}