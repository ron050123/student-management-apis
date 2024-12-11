import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './class.entity';
import { ClassService } from './class.service';
import { ClassResolver } from './class.resolver';
import { User } from '../user/user.entity';
import { Enrollment } from '../enrollment/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Enrollment, User])],
  providers: [ClassService, ClassResolver],
})
export class ClassModule {}