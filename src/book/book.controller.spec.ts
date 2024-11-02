import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  const mockBookService = {
    create: jest.fn(dto => ({ id: Date.now(), ...dto })),
    findAll: jest.fn(() => [
      { id: 1, title: 'Book 1', author: 'Author 1', publishedYear: 2000 },
      { id: 2, title: 'Book 2', author: 'Author 2', publishedYear: 2010 },
    ]),
    findOne: jest.fn(id => ({ id, title: 'Book 1', author: 'Author 1', publishedYear: 2000 })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(id => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const dto: CreateBookDto = {
        title: 'New Book',
        author: 'Author',
        publishedYear: 2022,
        genre: 'Fiction',
      };
      const result = await controller.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.title).toBe(dto.title);
    });
  });

  describe('findAll', () => {
    it('should return a list of all books', async () => {
      const result = await controller.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Book 1');
    });
  });

  describe('findOne', () => {
    it('should return a book by ID', async () => {
      const result = await controller.findOne('1');
      expect(result).toHaveProperty('id', 1);
      expect(result.title).toBe('Book 1');
    });
  });

  describe('update', () => {
    it('should update a book by ID', async () => {
      const dto: UpdateBookDto = { title: 'Updated Book' };
      const result = await controller.update('1', dto);
      expect(result).toHaveProperty('title', dto.title);
    });
  });

  describe('remove', () => {
    it('should delete a book by ID', async () => {
      const result = await controller.remove('1');
      expect(result).toHaveProperty('id', 1);
    });
  });
});
