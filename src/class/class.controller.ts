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

    const createdClass = await this.classService.createClass(name, subject, teacher, classLeader);

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
  const foundClass = await this.classService.findClassById(input.id);
  if (!foundClass) {
    throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
  }
  return foundClass;
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
}