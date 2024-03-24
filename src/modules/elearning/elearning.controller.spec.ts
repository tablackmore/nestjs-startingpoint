import { Test, TestingModule } from '@nestjs/testing';
import { ElearningController } from './elearning.controller';
import { ElearningService } from './elearning.service';
import { Course } from './interfaces/course.interface';

describe('ElearningController', () => {
  let controller: ElearningController;
  let service: ElearningService;

  beforeEach(async () => {
    // Mock ElearningService
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElearningController],
      providers: [
        {
          provide: ElearningService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ElearningController>(ElearningController);
    service = module.get<ElearningService>(ElearningService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const result: Course[] = [];
      jest.spyOn(service, 'findAll').mockImplementation(() => result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a course', async () => {
      const course: Course = {
        id: '1',
        title: 'Test Course',
        description: 'This is a test course',
        createdAt: new Date(),
      };
      jest.spyOn(service, 'create').mockImplementation(() => course);

      expect(await controller.create(course)).toBe(course);
    });
  });

  describe('findOne', () => {
    it('should return a single course', async () => {
      const course: Course = {
        id: '1',
        title: 'Test Course',
        description: 'This is a test course',
        createdAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockImplementation(() => course);

      expect(await controller.findOne('1')).toBe(course);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const course: Course = {
        id: '1',
        title: 'Updated Course',
        description: 'This is an updated test course',
        createdAt: new Date(),
      };
      jest.spyOn(service, 'update').mockImplementation(() => course);

      expect(await controller.update('1', course)).toBe(course);
    });
  });

  describe('patch', () => {
    it('should patch a course', async () => {
      const course: Course = {
        id: '1',
        title: 'Patched Course',
        description: 'This is a patched test course',
        createdAt: new Date(),
      };
      jest.spyOn(service, 'patch').mockImplementation(() => course);

      expect(await controller.patch('1', { title: 'Patched Course' })).toBe(
        course,
      );
    });
  });

  describe('delete', () => {
    it('should delete a course', async () => {
      const spy = jest.spyOn(service, 'delete').mockImplementation(() => {});
      await controller.delete('1');
      expect(spy).toHaveBeenCalledWith('1');
    });
  });
});
