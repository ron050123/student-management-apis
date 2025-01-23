import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassService } from './class.service';
import { Class } from './class.entity';
import { User } from '../user/user.entity';
import { CreateClassDto } from '../dto/create-class.dto';
import { UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Role } from '../user/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('classes')
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  async createClass(@Body('input') body: { createClassDto: CreateClassDto }): Promise<Class> {
    const { createClassDto } = body;

    if (!createClassDto) {
      throw new BadRequestException('Invalid input');
    }

    const { name, subject, teacherId, classLeaderId } = createClassDto;

    console.log('Received createClassDto:', createClassDto);

    if (!name) {
      throw new BadRequestException('Class name is required');
    }

    const teacher = new User();
    teacher.id = teacherId;

    let classLeader: User | null = null;
    if (classLeaderId) {
      classLeader = new User();
      classLeader.id = classLeaderId;
    }

    const createdAt = new Date();
    const createdClass = await this.classService.createClass(name, subject, teacher, classLeader, createdAt);

    return {
      ...createdClass,
      enrollments: createdClass.enrollments || [],
    };
  }

  @Get()
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
  async findAllClasses(): Promise<Class[]> {
    return this.classService.findAllClasses();
  }

  @Post(':id')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
  async findClassById(@Body('input') input: { id: number }): Promise<Class> {
    return this.classService.findClassById(input.id);
}

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  async updateClass(
    @Body('input')
    body: {
    id: string;
    name: string;
    subject: string;
    classLeaderId: number;
    teacherId: number;
    },
  ): Promise<Class> {
    const classLeader = await this.userRepository.findOne({ where: { id: body.classLeaderId } });
    const teacher = await this.userRepository.findOne({ where: { id: body.teacherId } });
    if (!classLeader) {
      throw new HttpException('Class Leader not found', HttpStatus.NOT_FOUND);
    }
    if (!teacher) {
      throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
    }
    const updatedClass = await this.classService.updateClass(Number(body.id), body.name, body.subject, classLeader);
    return {
      ...updatedClass,
      enrollments: updatedClass.enrollments || [],
      teacher: updatedClass.teacher || teacher,
    };
  }

  @Delete(':id')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  async deleteClass(@Body('input') input: { id: number }): Promise<boolean> {
    try {
      await this.classService.deleteClass(input.id);
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('search')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.STUDENT)
  async searchClasses(
  @Body('input') input: { name?: string; teacherName?: string; classLeaderName?: string }
  ): Promise<Class[]> {
    const { name, teacherName, classLeaderName } = input;
    const classes = await this.classService.searchClasses(name, teacherName, classLeaderName);
    return classes.map(classEntity => ({
      ...classEntity,
      enrollments: classEntity.enrollments || [],
    }));
  }

  @Post('events/checkAndDeleteClasses')
  async checkAndDeleteClasses(@Body() payload: any): Promise<void> {
    console.log('Received payload:', payload);
    try {
      const scheduledTime = payload.scheduled_time || payload.payload.scheduled_time;
      if (!scheduledTime) {
        throw new HttpException('Invalid payload: Missing scheduled_time', HttpStatus.BAD_REQUEST);
      }
      console.log(`Scheduled time: ${scheduledTime}`);
      await this.classService.checkAndDeleteClasses();
      console.log('Successfully handled event to check and delete classes');
    } catch (error) {
      console.error('Error checking and deleting classes:', error);
      throw new HttpException('Failed to check and delete classes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('events/checkAndSetInProgress')
  async checkAndSetInProgress(@Body() payload: any): Promise<void> {
    console.log('Received payload:', payload);
    try {
      const { event } = payload;
      const classId = event.data.new.classId;
      const classEntity = await this.classService.findClassById(classId);
      if (!classEntity) {
        throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
      }
      if (classEntity.currentStudentsCount >= 10) {
        classEntity.inProgress = true;
        await this.classService.updateClassStatus(classEntity);
        console.log(`Class ${classId} set to in progress`);
      }
    } catch (error) {
      console.error('Error checking and setting class in progress:', error);
      throw new HttpException('Failed to check and set class in progress', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}