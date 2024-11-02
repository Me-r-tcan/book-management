import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './book.entity';

describe('BookService', () => {
  let service: BookService;
  let repository: BookRepository;

  const mockBookRepository = {
    createBook: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findByBookId: jest.fn(),
    updateBook: jest.fn(),
    remove: jest.fn(),
  };

  const mockBook: Book = {
    id: 1,
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    publishedYear: 1866,
    genre: 'Classic Literature',
    popularity: 5,
    rating: 4.8,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: BookRepository,
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    repository = module.get<BookRepository>(BookRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2022,
        genre: 'Test Genre',
        popularity: 3,
        rating: 4.5,
      };
      mockBookRepository.createBook.mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);

      expect(mockBookRepository.createBook).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      mockBookRepository.find.mockResolvedValue([mockBook]);

      const result = await service.findAll();

      expect(mockBookRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('should return a book by ID', async () => {
      mockBookRepository.findByBookId.mockResolvedValue(mockBook);

      const result = await service.findOne(1);

      expect(mockBookRepository.findByBookId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBook);
    });

    it('should throw a NotFoundException if book is not found', async () => {
      mockBookRepository.findByBookId.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        author: 'Updated Author',
      };
      mockBookRepository.updateBook.mockResolvedValue(undefined);
      mockBookRepository.findByBookId.mockResolvedValue({ ...mockBook, ...updateBookDto });

      const result = await service.update(1, updateBookDto);

      expect(mockBookRepository.updateBook).toHaveBeenCalledWith(1, updateBookDto);
      expect(result.title).toEqual('Updated Book');
      expect(result.author).toEqual('Updated Author');
    });

    it('should throw a NotFoundException if book is not found during update', async () => {
      mockBookRepository.updateBook.mockResolvedValue(undefined);
      mockBookRepository.findByBookId.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a book by ID', async () => {
      mockBookRepository.findByBookId.mockResolvedValue(mockBook);

      await service.remove(1);

      expect(mockBookRepository.findByBookId).toHaveBeenCalledWith(1);
      expect(mockBookRepository.remove).toHaveBeenCalledWith(mockBook);
    });

    it('should throw a NotFoundException if book is not found during removal', async () => {
      mockBookRepository.findByBookId.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
