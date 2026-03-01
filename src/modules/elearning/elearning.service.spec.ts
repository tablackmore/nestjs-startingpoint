import { NotFoundException } from '@nestjs/common';
import { ElearningService } from './elearning.service';

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
      // GIVEN
      const input = {
        title: 'Test Course',
        description: 'This is a test course',
      };

      // WHEN
      const created = service.create(input);

      // THEN
      expect(created.id).toBeDefined();
      expect(created.createdAt).toBeDefined();
      expect(service.findOne(created.id)).toEqual(created);
    });

    it('should return all courses', () => {
      // GIVEN
      const course1 = service.create({
        title: 'Test Course 1',
        description: 'This is a test course',
      });
      const course2 = service.create({
        title: 'Test Course 2',
        description: 'This is another test course',
      });

      // WHEN
      const all = service.findAll();

      // THEN
      expect(all).toEqual(expect.arrayContaining([course1, course2]));
    });

    it('should return a copy of the courses array', () => {
      // GIVEN
      service.create({
        title: 'Test Course',
        description: 'This is a test course',
      });

      // WHEN
      const result = service.findAll();
      result.push({
        id: 'injected',
        title: 'Injected',
        description: 'Should not appear',
        createdAt: new Date(),
      });

      // THEN
      expect(service.findAll()).toHaveLength(1);
    });

    it('should throw NotFoundException for non-existing course', () => {
      // GIVEN / WHEN / THEN
      expect(() => service.findOne('non-existing-id')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('update and patch operations', () => {
    it('should update a course', () => {
      // GIVEN
      const created = service.create({
        title: 'Original Test Course',
        description: 'This is a test course',
      });

      // WHEN
      const updated = service.update(created.id, {
        title: 'Updated Test Course',
        description: 'Updated description',
      });

      // THEN
      expect(updated.title).toEqual('Updated Test Course');
      expect(updated.id).toEqual(created.id);
      expect(updated.createdAt).toEqual(created.createdAt);
    });

    it('should throw NotFoundException when updating non-existing course', () => {
      // GIVEN / WHEN / THEN
      expect(() =>
        service.update('non-existing-id', {
          title: 'Title',
          description: 'Description',
        }),
      ).toThrow(NotFoundException);
    });

    it('should patch a course', () => {
      // GIVEN
      const created = service.create({
        title: 'Original Test Course',
        description: 'This is a test course',
      });
      const patch = { title: 'Patched Test Course' };

      // WHEN
      service.patch(created.id, patch);

      // THEN
      expect(service.findOne(created.id).title).toEqual(patch.title);
      expect(service.findOne(created.id).description).toEqual(
        'This is a test course',
      );
    });

    it('should throw NotFoundException when patching non-existing course', () => {
      // GIVEN / WHEN / THEN
      expect(() =>
        service.patch('non-existing-id', { title: 'Title' }),
      ).toThrow(NotFoundException);
    });
  });

  describe('delete operation', () => {
    it('should delete a course', () => {
      // GIVEN
      const created = service.create({
        title: 'Test Course to Delete',
        description: 'This course will be deleted',
      });

      // WHEN
      service.delete(created.id);

      // THEN
      expect(() => service.findOne(created.id)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when deleting non-existing course', () => {
      // GIVEN / WHEN / THEN
      expect(() => service.delete('non-existing-id')).toThrow(
        NotFoundException,
      );
    });
  });
});
