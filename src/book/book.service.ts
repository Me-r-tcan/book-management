import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookRepository } from './book.repository';

@Injectable()
export class BookService {
  constructor(
    private BookRepository: BookRepository,
  ) {}

  create(createBookDto: CreateBookDto): Promise<Book> {
    return this.BookRepository.createBook(createBookDto);
  }

  findAll(): Promise<Book[]> {
    return this.BookRepository.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.BookRepository.findByBookId(id);
  
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    
    return book;
  }
  
  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    await this.BookRepository.updateBook(id, updateBookDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    this.BookRepository.remove(book);
  }
}
