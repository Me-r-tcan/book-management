import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  publishedYear: number;

  @Column()
  genre: string;

  @Column({ default: 0 })
  popularity: number;

  @Column({ nullable: true })
  rating: number;
}
