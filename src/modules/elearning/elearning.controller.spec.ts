import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

describe('ElearningController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => new BadRequestException(errors),
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/GET courses should retrieve an empty array initially', async () => {
    // GIVEN

    // WHEN
    const response = await request(app.getHttpServer()).get('/courses');

    // THEN
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('/POST courses should create a new course and return it', async () => {
    // GIVEN
    const newCourse = {
      title: 'Introduction to Testing',
      description: 'A course about testing practices',
    };

    // WHEN
    const createdResponse = await request(app.getHttpServer())
      .post('/courses')
      .send(newCourse);

    // THEN
    expect(createdResponse.status).toBe(201);
    expect(createdResponse.body.title).toEqual(newCourse.title);
    expect(createdResponse.body.description).toEqual(newCourse.description);
    expect(createdResponse.body).toHaveProperty('id');
    expect(createdResponse.body).toHaveProperty('createdAt');
  });

  it('/POST courses should reject creation with incomplete data', async () => {
    // GIVEN incomplete course data (missing required 'description')
    const incompleteCourse = {
      title: 'Incomplete Course',
    };

    // WHEN posting incomplete course data
    const response = await request(app.getHttpServer())
      .post('/courses')
      .send(incompleteCourse);

    // THEN expect a 400 Bad Request response
    expect(response.status).toBe(400);
    const errorMessages = response.body.message.flatMap((msg) =>
      Object.values(msg.constraints),
    );
    expect(errorMessages).toContain('description should not be empty');
  });

  it('/POST courses should reject creation with invalid data types', async () => {
    // GIVEN course data with invalid types (e.g., 'title' as a number)
    const invalidCourse = {
      title: 123,
      description: 'A course with an invalid title type',
    };

    // WHEN posting data with invalid types
    const response = await request(app.getHttpServer())
      .post('/courses')
      .send(invalidCourse);

    // THEN expect a 400 Bad Request response
    expect(response.status).toBe(400);
    // Optionally check for specific error message
    const errorMessages = response.body.message.flatMap((msg) =>
      Object.values(msg.constraints),
    );
    expect(errorMessages).toContain('title must be a string');
  });

  it('/GET courses should retrieve a list with the created course', async () => {
    // GIVEN
    await request(app.getHttpServer()).post('/courses').send({
      title: 'Initial Title',
      description: 'Initial Description',
    });

    // WHEN
    const response = await request(app.getHttpServer()).get('/courses');

    // THEN
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('title');
    expect(response.body[0]).toHaveProperty('description');
  });

  it('/GET courses/:id should return 404 for non-existing course', async () => {
    // GIVEN
    const nonExistingId = 'non-existing-id';

    // WHEN
    const response = await request(app.getHttpServer()).get(
      `/courses/${nonExistingId}`,
    );

    // THEN
    expect(response.status).toBe(404);
  });

  it('/PUT courses/:id should update the course', async () => {
    // GIVEN
    const updatedCourse = {
      title: 'Updated Title',
      description: 'Updated Description',
    };
    const createResponse = await request(app.getHttpServer())
      .post('/courses')
      .send({
        title: 'Initial Title',
        description: 'Initial Description',
      });
    const createdCourseId = createResponse.body.id;

    // WHEN
    const updateResponse = await request(app.getHttpServer())
      .put(`/courses/${createdCourseId}`)
      .send(updatedCourse);

    // THEN
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toEqual(updatedCourse.title);
    expect(updateResponse.body.description).toEqual(updatedCourse.description);
  });

  it('/PUT courses/:id should reject update with invalid data types', async () => {
    // GIVEN a created course and invalid update data
    const { body: createdCourse } = await request(app.getHttpServer())
      .post('/courses')
      .send({ title: 'Valid Title', description: 'Valid Description' });
    const invalidUpdateData = { title: false };

    // WHEN attempting to update the course with invalid data types
    const updateResponse = await request(app.getHttpServer())
      .put(`/courses/${createdCourse.id}`)
      .send(invalidUpdateData);

    // THEN expect a 400 Bad Request response
    expect(updateResponse.status).toBe(400);
    const errorMessages = updateResponse.body.message.flatMap((msg) =>
      Object.values(msg.constraints),
    );
    expect(errorMessages).toContain('title must be a string');
  });

  it('/DELETE courses/:id should remove the course', async () => {
    // GIVEN
    const createResponse = await request(app.getHttpServer())
      .post('/courses')
      .send({
        title: 'Course to Delete',
        description: 'Will be deleted',
      });
    const createdCourseId = createResponse.body.id;

    // WHEN
    const deleteResponse = await request(app.getHttpServer()).delete(
      `/courses/${createdCourseId}`,
    );

    // THEN
    expect(deleteResponse.status).toBe(200);

    // VERIFY deletion
    const verifyResponse = await request(app.getHttpServer()).get(
      `/courses/${createdCourseId}`,
    );
    expect(verifyResponse.status).toBe(404);
  });

  it('/PATCH courses/:id should partially update the course title', async () => {
    // GIVEN: Create a new course
    const initialCourseData = {
      title: 'Original Title',
      description: 'Original Description',
    };
    const createResponse = await request(app.getHttpServer())
      .post('/courses')
      .send(initialCourseData);
    const createdCourseId = createResponse.body.id;

    // New data for partial update
    const partialUpdateData = {
      title: 'Updated Title',
    };

    // WHEN: Partially update the course title
    const patchResponse = await request(app.getHttpServer())
      .patch(`/courses/${createdCourseId}`)
      .send(partialUpdateData);

    // THEN: Expect the course to be partially updated
    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.id).toEqual(createdCourseId);
    expect(patchResponse.body.title).toEqual(partialUpdateData.title);
    expect(patchResponse.body.description).toEqual(
      initialCourseData.description,
    ); // Verify unchanged fields remain as is

    // VERIFY: Retrieve the updated course to ensure persistence of partial update
    const verifyResponse = await request(app.getHttpServer()).get(
      `/courses/${createdCourseId}`,
    );
    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body.title).toEqual(partialUpdateData.title);
    expect(verifyResponse.body.description).toEqual(
      initialCourseData.description,
    ); // Ensure unchanged data persists
  });
});
