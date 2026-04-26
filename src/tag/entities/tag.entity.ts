import { Article } from 'src/module/article/entities/article.entity';
import { Auth } from 'src/module/auth/entities/auth.entity';
import { Entity, PrimaryColumn, Column, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryColumn({ type: 'int', generated: 'increment' })
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @ManyToOne(() => Auth, (user) => user.tags)
  @JoinColumn({ name: 'user_id' })
  createdBy?: Auth;

  @ManyToMany(() => Article, (article) => article.tags)
  articles?: Article[];
}
