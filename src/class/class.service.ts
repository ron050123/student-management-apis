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
  ): Promise<Class> {
    const classEntity = this.classRepository.create({
      name,
      subject,
      teacher,
      classLeader,
      currentStudentsCount: 0,
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
}