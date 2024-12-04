import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './class.entity';
import { ClassService } from './class.service';
import { ClassResolver } from './class.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  providers: [ClassService, ClassResolver],
})
export class ClassModule {}