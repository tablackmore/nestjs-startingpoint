import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ElearningService } from './elearning.service';
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
  @ApiBody({ type: CourseDto })
  @ApiResponse({
    status: 201,
    description: 'The course has been successfully created.',
    type: CourseDto,
  })
  create(@Body() courseDto: CourseDto): CourseDto {
    return this.elearningService.create(courseDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by id' })
  @ApiParam({ name: 'id', description: 'The course ID' })
  @ApiResponse({ status: 200, description: 'Found course', type: CourseDto })
  @ApiResponse({ status: 404, description: 'Course not found' }) // Documenting the possible 404 response
  findOne(@Param('id') id: string): CourseDto {
    const course = this.elearningService.findOne(id);
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    return course;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a course' })
  @ApiParam({ name: 'id', description: 'The course ID' })
  @ApiBody({ type: CourseDto })
  @ApiResponse({
    status: 200,
    description: 'The course has been successfully updated.',
    type: CourseDto,
  })
  update(@Param('id') id: string, @Body() courseDto: CourseDto): CourseDto {
    return this.elearningService.update(id, courseDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a course' })
  @ApiParam({ name: 'id', description: 'The course ID' })
  @ApiBody({ type: CourseDto })
  @ApiResponse({
    status: 200,
    description: 'The course has been successfully updated.',
    type: CourseDto,
  })
  patch(
    @Param('id') id: string,
    @Body() courseDto: Partial<CourseDto>,
  ): CourseDto {
    return this.elearningService.patch(id, courseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiParam({ name: 'id', description: 'The course ID' })
  @ApiResponse({
    status: 200,
    description: 'The course has been successfully deleted.',
  })
  delete(@Param('id') id: string): void {
    this.elearningService.delete(id);
  }
}
