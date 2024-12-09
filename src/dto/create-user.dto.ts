import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { Role } from '../user/role.enum';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Field()
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}