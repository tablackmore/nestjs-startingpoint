import { Injectable } from '@nestjs/common';
import { CourseDto } from './dtos/course.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ElearningService {
  private readonly courses: CourseDto[] = [];

  findAll(): CourseDto[] {
    return this.courses;
  }

  create(courseDto: CourseDto): CourseDto {
    // Generate a unique ID if one isn't provided
    if (!courseDto.id) {
      courseDto.id = uuidv4();
    }

    // Assume title, description, and createdAt are mandatory, and handle accordingly
    // For example, set createdAt to the current timestamp if not provided
    if (!courseDto.createdAt) {
      courseDto.createdAt = new Date();
    }

    this.courses.push(courseDto);
    return courseDto;
  }

  findOne(id: string): CourseDto {
    return this.courses.find((course) => course.id === id);
  }

  update(id: string, courseDto: CourseDto): CourseDto {
    const index = this.courses.findIndex((course) => course.id === id);
    if (index !== -1) {
      // Keep the original ID and createdAt date of the course being updated
      courseDto.id = this.courses[index].id;
      courseDto.createdAt = this.courses[index].createdAt;

      this.courses[index] = courseDto;
      return courseDto;
    }
    return null;
  }

  patch(id: string, courseUpdate: Partial<CourseDto>): CourseDto {
    const course = this.findOne(id);
    if (course) {
      Object.assign(course, courseUpdate);
      return course;
    }
    return null;
  }

  delete(id: string): void {
    const index = this.courses.findIndex((course) => course.id === id);
    if (index !== -1) {
      this.courses.splice(index, 1);
    }
  }
}
