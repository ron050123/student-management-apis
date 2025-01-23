import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async enrollStudent(student: User, classEntity: Class): Promise<Enrollment> {
    const classToUpdate = await this.classRepository.findOne({ where: { id: classEntity.id } });
    if (!classToUpdate) {
      throw new Error('Class not found');
    }
    if (isNaN(classToUpdate.currentStudentsCount)) {
      classToUpdate.currentStudentsCount = 0;
    }
    classToUpdate.currentStudentsCount++;
    await this.classRepository.save(classToUpdate);
    const enrollment = this.enrollmentRepository.create({ student, class: classToUpdate });
    const savedEnrollment = await this.enrollmentRepository.save(enrollment);
    return this.enrollmentRepository.findOne({ where: { id: savedEnrollment.id }, relations: ['class', 'student'] });
  }

  async findEnrollmentsByStudent(student: User): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({ where: { student }, relations: ['class'] });
  }

  async findEnrollmentsByClass(classEntity: Class): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({ where: { class: classEntity }, relations: ['student'] });
  }

  async removeEnrollment(id: number): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOne({ where: { id }, relations: ['class'] });
    if (enrollment && enrollment.class) {
      if (enrollment.class.inProgress) {
        throw new HttpException('Cannot remove enrollment from a class that is in progress', HttpStatus.FORBIDDEN);
      }
      if (isNaN(enrollment.class.currentStudentsCount)) {
        enrollment.class.currentStudentsCount = 0;
      }
      if (enrollment.class.currentStudentsCount > 0) {
        enrollment.class.currentStudentsCount--;
        await this.classRepository.save(enrollment.class);
      }
      await this.enrollmentRepository.delete(id);
    } else {
      throw new HttpException('Enrollment not found', HttpStatus.NOT_FOUND);
    }
  }
}