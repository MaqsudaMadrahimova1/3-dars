import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';

@Entity('articles')
export class Article {
  @PrimaryColumn({ type: 'int', generated: 'increment' })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @ManyToOne(() => Auth, (auth) => auth.articles)
  @JoinColumn({ name: 'userId' })
  auth: Auth;
}