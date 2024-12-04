import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Class } from '../class/class.entity';

@ObjectType()
@Entity()
export class Enrollment {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.enrollments)
  student: User;

  @Field(() => Class)
  @ManyToOne(() => Class, (classEntity) => classEntity.enrollments)
  class: Class;
}