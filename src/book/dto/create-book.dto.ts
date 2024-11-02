import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ description: 'The title of the book', example: 'The Great Gatsby' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The author of the book', example: 'F. Scott Fitzgerald' })
  @IsString()
  author: string;

  @ApiProperty({ description: 'The publication year of the book', example: 1925 })
  @IsInt()
  publishedYear: number;

  @ApiProperty({ description: 'The genre of the book', example: 'Classic Literature' })
  @IsString()
  genre: string;

  @ApiProperty({ description: 'The popularity of the book', example: 5, required: false })
  @IsInt()
  @IsOptional()
  popularity?: number;

  @ApiProperty({ description: 'The rating of the book', example: 4, required: false })
  @IsInt()
  @IsOptional()
  rating?: number;
}
