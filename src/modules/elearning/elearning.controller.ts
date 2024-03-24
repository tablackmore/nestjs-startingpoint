// src/modules/elearning/elearning.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ElearningService } from './elearning.service';
import { Course } from './interfaces/course.interface';

@Controller('courses')
export class ElearningController {
  constructor(private readonly elearningService: ElearningService) {}

  @Get()
  findAll(): Course[] {
    return this.elearningService.findAll();
  }

  @Post()
  create(@Body() course: Course): Course {
    return this.elearningService.create(course);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Course {
    return this.elearningService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() course: Course): Course {
    return this.elearningService.update(id, course);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() course: Partial<Course>): Course {
    return this.elearningService.patch(id, course);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    this.elearningService.delete(id);
  }
}
