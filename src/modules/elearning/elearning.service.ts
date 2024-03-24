import { Injectable } from '@nestjs/common';
import { CourseDto } from './dtos/course.dto';

@Injectable()
export class ElearningService {
  private readonly courses: CourseDto[] = [];

  findAll(): CourseDto[] {
    return this.courses;
  }

  create(courseDto: CourseDto): CourseDto {
    this.courses.push(courseDto);
    return courseDto;
  }

  findOne(id: string): CourseDto {
    return this.courses.find((course) => course.id === id);
  }

  update(id: string, courseDto: CourseDto): CourseDto {
    const index = this.courses.findIndex((course) => course.id === id);
    if (index !== -1) {
      this.courses[index] = courseDto;
      return courseDto;
    }
    return null; // Consider how you want to handle not found cases
  }

  patch(id: string, courseUpdate: Partial<CourseDto>): CourseDto {
    const course = this.findOne(id);
    if (course) {
      Object.assign(course, courseUpdate);
      return course;
    }
    return null; // Consider how you want to handle not found cases
  }

  delete(id: string): void {
    const index = this.courses.findIndex((course) => course.id === id);
    if (index !== -1) {
      this.courses.splice(index, 1);
    }
  }
}
