import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
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
}
