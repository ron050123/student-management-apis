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
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async enrollStudent(student: User, classEntity: Class): Promise<Enrollment> {
    if (isNaN(classEntity.currentStudentsCount)) {
      classEntity.currentStudentsCount = 0; 
    }
    const enrollment = this.enrollmentRepository.create({ student, class: classEntity });
    classEntity.currentStudentsCount++;
    await this.classRepository.save(classEntity);

    const selfEnrollment = await this.enrollmentRepository.save(enrollment);
    console.log("A: ", selfEnrollment)

    const recheckEnrollment = this.enrollmentRepository.findOne({ where: { id: selfEnrollment.id }, relations: ['class', 'student'] });
    return recheckEnrollment;
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
      if (isNaN(enrollment.class.currentStudentsCount)) {
        enrollment.class.currentStudentsCount = 0; 
      }

      if (enrollment.class.currentStudentsCount > 0) {
        enrollment.class.currentStudentsCount--;
        await this.classRepository.save(enrollment.class);
      }
    await this.enrollmentRepository.delete(id);
    }
  }
}