import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty({
    example: 'Introduction to the admin panel',
    description: 'Title of the course',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({
    example:
      'An introductory course on the admin panel. Providing you with the basic skills required to setup account, users and alarms',
    description: 'Course description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
