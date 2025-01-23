import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt, IsOptional, IsDate } from 'class-validator';

@InputType()
export class CreateClassDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @Field()
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  teacherId: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  classLeaderId?: number;
}