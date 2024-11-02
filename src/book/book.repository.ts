import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Book } from './book.entity';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookRepository extends Repository<Book> {
  constructor(private dataSource: DataSource) {
    super(Book, dataSource.createEntityManager());
  }

  async createBook(bookData: CreateBookDto): Promise<Book> {
    const book = this.create(bookData);
    return this.save(book);
  }

  async findByBookId(id: number): Promise<Book | null> {
    return this.findOne({
        where: { id },
      });
  }

  async updateBook(id: number, updateData: UpdateBookDto): Promise<Book> {
    await this.update(id, updateData);
    return this.findByBookId(id);
  }
}
