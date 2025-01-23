import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Enrollment } from '../enrollment/enrollment.entity';

@ObjectType()
@Entity()
export class Class {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  subject: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  teacher: User;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true })
  classLeader: User;

  @Field(() => Int)
  @Column({ default: 0 })
  currentStudentsCount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  createdAt: Date;

  @Field(() => Boolean)
  @Column({ default: false })
  inProgress: boolean;

  @Field(() => [Enrollment])
  @OneToMany(() => Enrollment, (enrollment) => enrollment.class)
  enrollments: Enrollment[];
}