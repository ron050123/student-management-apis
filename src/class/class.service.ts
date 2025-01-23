import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async createClass(
    name: string,
    subject: string,
    teacher: User,
    classLeader: User,
    createdAt: Date,
  ): Promise<Class> {
    const classEntity = this.classRepository.create({
      name,
      subject,
      teacher,
      classLeader,
      currentStudentsCount: 0,
      createdAt: new Date(),
    });
    return this.classRepository.save(classEntity);
  }

  async findAllClasses(): Promise<Class[]> {
    return this.classRepository.find({
      relations: ['teacher', 'enrollments', 'classLeader'],
    });
  }

  async findClassById(id: number): Promise<Class> {
    return this.classRepository.findOne({
      where: { id },
      relations: ['teacher', 'enrollments', 'classLeader'],
    });
  }

  async updateClass(
    id: number,
    name: string,
    subject: string,
    classLeader: User,
  ): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
    });
    if (!classEntity) {
      throw new Error('Class not found');
    }

    classEntity.name = name;
    classEntity.subject = subject;
    classEntity.classLeader = classLeader;

    return this.classRepository.save(classEntity);
  }

  async deleteClass(id: number): Promise<void> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['enrollments'],
    });

    if (!classEntity) {
      throw new Error('Class not found');
    }

    if (classEntity.enrollments.length < 5) {
      await this.classRepository.delete(id);
    } else {
      throw new Error('Cannot delete class with 5 or more students');
    }
  }

  async searchClasses(
    name?: string,
    teacherName?: string,
    classLeaderName?: string,
  ): Promise<Class[]> {
    const query = this.classRepository.createQueryBuilder('class')
      .leftJoinAndSelect('class.teacher', 'teacher')
      .leftJoinAndSelect('class.classLeader', 'classLeader');

    if (name) {
      query.andWhere('class.name ILIKE :name', { name: `%${name}%` });
    }

    if (teacherName) {
      query.andWhere('teacher.username ILIKE :teacherName', { teacherName: `%${teacherName}%` });
    }

    if (classLeaderName) {
      query.andWhere('classLeader.username ILIKE :classLeaderName', { classLeaderName: `%${classLeaderName}%` });
    }

    return query.getMany();
  }

  async checkAndDeleteClasses(): Promise<void> {
    try {
      const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
      const classesToDelete = await this.classRepository
        .createQueryBuilder('class')
        .leftJoinAndSelect('class.enrollments', 'enrollments')
        .where('class.createdAt <= :date', { date: fifteenDaysAgo })
        .groupBy('class.id')
        .addGroupBy('class.name')
        .addGroupBy('class.subject')
        .addGroupBy('class.currentStudentsCount')
        .addGroupBy('class.createdAt')
        .addGroupBy('class.teacherId')
        .addGroupBy('class.classLeaderId')
        .addGroupBy('enrollments.id')
        .addGroupBy('enrollments.studentId')
        .addGroupBy('enrollments.classId')
        .having('COUNT(enrollments.id) < 5')
        .getMany();

      for (const classToDelete of classesToDelete) {
        await this.classRepository.remove(classToDelete);
      }
    } catch (error) {
      console.error('Error checking and deleting classes:', error);
      throw new Error('Failed to check and delete classes');
    }
  }

  async updateClassStatus(classEntity: Class): Promise<Class> {
    return this.classRepository.save(classEntity);
  }
}