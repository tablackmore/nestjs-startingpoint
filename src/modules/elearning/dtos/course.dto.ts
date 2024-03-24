import { ApiProperty } from '@nestjs/swagger';

export class CourseDto {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  id: string;

  @ApiProperty({
    example: 'Introduction to the admin panel',
    description: 'Title of the course',
  })
  title: string;

  @ApiProperty({
    example:
      'An introductory course on the admin panel. Providing you with the basic skills required to setup account, users and alarms',
    description: 'Course description',
  })
  description: string;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Creation date',
  })
  createdAt: Date;
}
