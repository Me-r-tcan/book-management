import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BookService (e2e)', () => {
  let app: INestApplication;
  let bookRepository: Repository<Book>;
  let dataSource: DataSource;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forFeature([Book]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    bookRepository = moduleFixture.get<Repository<Book>>(getRepositoryToken(Book));
    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Register a user and login to get the access token
    await registerAndLoginUser();
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE "book" RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  const registerAndLoginUser = async () => {
    // Register a new user
    await request(app.getHttpServer())
      .post(`/auth/register`)
      .send({ username: 'testuser', password: 'password', age: 25});

    // Login the user to get the access token
    const loginResponse = await request(app.getHttpServer())
      .post(`/auth/login`)
      .send({ username: 'testuser', password: 'password' });

    accessToken = loginResponse.body.access_token;
  };

  const createBook = async (title: string, author: string, publishedYear: number, genre: string): Promise<Book> => {
    const createBookDto: CreateBookDto = { title, author, publishedYear, genre };
    const response = await request(app.getHttpServer())
      .post('/books')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createBookDto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    return response.body;
  };

  describe('CRUD operations', () => {
    it('should create a new book', async () => {
      const book = await createBook('Test Book', 'Author Name', 2023, 'Fiction');
      expect(book.title).toBe('Test Book');
      expect(book.author).toBe('Author Name');
      expect(book.publishedYear).toBe(2023);
      expect(book.genre).toBe('Fiction');
    });

    it('should return all books', async () => {
      await createBook('Book 1', 'Author 1', 2023, 'Fiction');
      await createBook('Book 2', 'Author 2', 2022, 'Non-Fiction');

      const response = await request(app.getHttpServer())
        .get('/books')
        .set('Authorization', `Bearer ${accessToken}`) 
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should return a book by ID', async () => {
      const book = await createBook('Book by ID', 'Author', 2023, 'Fiction');

      const response = await request(app.getHttpServer())
        .get(`/books/${book.id}`)
        .set('Authorization', `Bearer ${accessToken}`) 
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        id: book.id,
        title: 'Book by ID',
        author: 'Author',
        publishedYear: 2023,
        genre: 'Fiction',
      }));
    });

    it('should throw a NotFoundException if book is not found', async () => {
      await request(app.getHttpServer())
        .get('/books/999') // Assuming 999 does not exist
        .set('Authorization', `Bearer ${accessToken}`) 
        .expect(404);
    });

    it('should update a book', async () => {
      const book = await createBook('Old Book', 'Old Author', 2020, 'Old Genre');
      const updateBookDto: UpdateBookDto = { title: 'Updated Book', author: 'Updated Author', publishedYear: 2021, genre: 'Updated Genre' };

      const response = await request(app.getHttpServer())
        .patch(`/books/${book.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateBookDto)
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        id: book.id,
        title: 'Updated Book',
        author: 'Updated Author',
        publishedYear: 2021,
        genre: 'Updated Genre',
      }));
    });

    it('should delete a book', async () => {
      const book = await createBook('Book to Delete', 'Author', 2023, 'Fiction');

      await request(app.getHttpServer())
        .delete(`/books/${book.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const response = await request(app.getHttpServer())
        .get(`/books/${book.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body.message).toBe(`Book with ID ${book.id} not found`);
    });
  });
});
