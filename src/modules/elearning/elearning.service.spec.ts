import { ElearningService } from './elearning.service';
import { Course } from './interfaces/course.interface';

describe('ElearningService', () => {
  let service: ElearningService;

  beforeEach(() => {
    service = new ElearningService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create and find operations', () => {
    it('should create a course and find it by id', () => {
      const now = new Date();
      const course: Course = {
        id: '1',
        title: 'Test Course',
        description: 'This is a test course',
        createdAt: now,
      };
      service.create(course);
      expect(service.findOne('1')).toEqual(course);
    });

    it('should return all courses', () => {
      const now = new Date();
      const course1: Course = {
        id: '1',
        title: 'Test Course 1',
        description: 'This is a test course',
        createdAt: now,
      };
      const course2: Course = {
        id: '2',
        title: 'Test Course 2',
        description: 'This is another test course',
        createdAt: now,
      };
      service.create(course1);
      service.create(course2);
      expect(service.findAll()).toEqual(
        expect.arrayContaining([course1, course2]),
      );
    });
  });

  describe('update and patch operations', () => {
    it('should update a course', () => {
      const now = new Date();
      const course: Course = {
        id: '1',
        title: 'Original Test Course',
        description: 'This is a test course',
        createdAt: now,
      };
      service.create(course);
      const updatedCourse: Course = {
        ...course,
        title: 'Updated Test Course',
      };
      service.update('1', updatedCourse);
      expect(service.findOne('1')).toEqual(updatedCourse);
    });

    it('should patch a course', () => {
      const now = new Date();
      const course: Course = {
        id: '1',
        title: 'Original Test Course',
        description: 'This is a test course',
        createdAt: now,
      };
      service.create(course);
      const patch = { title: 'Patched Test Course' };
      service.patch('1', patch);
      expect(service.findOne('1').title).toEqual(patch.title);
    });
  });

  describe('delete operation', () => {
    it('should delete a course', () => {
      const course: Course = {
        id: '1',
        title: 'Test Course to Delete',
        description: 'This course will be deleted',
        createdAt: new Date(),
      };
      service.create(course);
      service.delete('1');
      expect(service.findOne('1')).toBeUndefined();
    });
  });
});
