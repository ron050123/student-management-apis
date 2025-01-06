import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './enrollment.entity';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentResolver } from './enrollment.resolver';
import { EnrollmentController } from './enrollment.controller';
import { Class } from '../class/class.entity';
import { User } from '../user/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Class, User])],
  providers: [EnrollmentService, EnrollmentResolver],
  controllers: [EnrollmentController],
})
export class EnrollmentModule {}