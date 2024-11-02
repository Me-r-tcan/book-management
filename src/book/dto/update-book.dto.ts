import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiProperty({ description: 'The title of the book', example: 'The Great Gatsby', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'The author of the book', example: 'F. Scott Fitzgerald', required: false })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ description: 'The publication year of the book', example: 1925, required: false })
  @IsInt()
  @IsOptional()
  publishedYear?: number;

  @ApiProperty({ description: 'The genre of the book', example: 'Classic Literature', required: false })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty({ description: 'The popularity of the book', example: 5, required: false })
  @IsInt()
  @IsOptional()
  popularity?: number;

  @ApiProperty({ description: 'The rating of the book', example: 4, required: false })
  @IsInt()
  @IsOptional()
  rating?: number;
}
