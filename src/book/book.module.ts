import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './book.entity';
import { BookRepository } from './book.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  providers: [BookService, BookRepository],
  controllers: [BookController]
})
export class BookModule {}
