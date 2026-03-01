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
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { CourseDto } from './dtos/course.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('courses')
@Controller('courses')
export class ElearningController {
  constructor(private readonly elearningService: ElearningService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all courses' })
  @ApiResponse({
    status: 200,
    type: [CourseDto],
    description: 'Return all courses',
  })
  findAll(): CourseDto[] {
    return this.elearningService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({
    status: 201,
    description: 'The course has been successfully created.',
    type: CourseDto,
  })
  create(@Body() createCourseDto: CreateCourseDto): CourseDto {
    return this.elearningService.create(createCourseDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by id' })
  @ApiParam({ name: 'id', description: 'The course ID' })
  @ApiResponse({ status: 200, description: 'Found course', type: CourseDto })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id') id: string): CourseDto {
    return this.elearningService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a course' })
  @ApiParam({ name: 'id', description: 'The course ID' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({
    status: 200,
    description: 'The course has been successfully updated.',
    type: CourseDto,
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  update(
    @Param('id') id: string,
    @Body() createCourseDto: CreateCourseDto,
  ): CourseDto {
    return this.elearningService.update(id, createCourseDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a course' })
  @ApiParam({ name: 'id', description: 'The course ID' })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({
    status: 200,
    description: 'The course has been successfully updated.',
    type: CourseDto,
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  patch(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): CourseDto {
    return this.elearningService.patch(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiParam({ name: 'id', description: 'The course ID' })
  @ApiResponse({
    status: 200,
    description: 'The course has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  delete(@Param('id') id: string): void {
    this.elearningService.delete(id);
  }
}
