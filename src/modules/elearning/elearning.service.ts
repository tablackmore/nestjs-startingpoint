// src/modules/elearning/elearning.service.ts

import { Injectable } from '@nestjs/common';
import { Course } from './interfaces/course.interface';

@Injectable()
export class ElearningService {
  private readonly courses: Course[] = [];

  findAll(): Course[] {
    return this.courses;
  }

  create(course: Course): Course {
    this.courses.push(course);
    return course;
  }

  findOne(id: string): Course {
    return this.courses.find((course) => course.id === id);
  }

  update(id: string, course: Course): Course {
    const index = this.courses.findIndex((c) => c.id === id);
    this.courses[index] = course;
    return course;
  }

  patch(id: string, course: Partial<Course>): Course {
    const index = this.courses.findIndex((c) => c.id === id);
    this.courses[index] = { ...this.courses[index], ...course };
    return this.courses[index];
  }

  delete(id: string): void {
    const index = this.courses.findIndex((c) => c.id === id);
    this.courses.splice(index, 1);
  }
}
