import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseDto } from './dtos/course.dto';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ElearningService {
  private readonly courses: CourseDto[] = [];

  findAll(): CourseDto[] {
    return [...this.courses];
  }

  create(createCourseDto: CreateCourseDto): CourseDto {
    const course: CourseDto = {
      ...createCourseDto,
      id: uuidv4(),
      createdAt: new Date(),
    };

    this.courses.push(course);
    return course;
  }

  findOne(id: string): CourseDto {
    const course = this.courses.find((c) => c.id === id);
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    return course;
  }

  update(id: string, createCourseDto: CreateCourseDto): CourseDto {
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    const updated: CourseDto = {
      ...createCourseDto,
      id: this.courses[index].id,
      createdAt: this.courses[index].createdAt,
    };

    this.courses[index] = updated;
    return updated;
  }

  patch(id: string, updateCourseDto: UpdateCourseDto): CourseDto {
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    const patched: CourseDto = { ...this.courses[index], ...updateCourseDto };
    this.courses[index] = patched;
    return patched;
  }

  delete(id: string): void {
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    this.courses.splice(index, 1);
  }
}
