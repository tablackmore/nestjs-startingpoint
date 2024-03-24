import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsISO8601 } from 'class-validator';

export class CourseDto {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    example: 'Introduction to the admin panel',
    description: 'Title of the course',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'An introductory course on the admin panel. Providing you with the basic skills required to setup account, users and alarms',
    description: 'Course description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Creation date',
  })
  @IsOptional()
  @IsISO8601()
  createdAt?: Date;
}
