import { Entity, PrimaryColumn, Column, ManyToOne, ManyToMany, JoinColumn, JoinTable, OneToMany } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { ArticleImage } from './article_image.entity';


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

  @ManyToOne(() => Auth, (user) => user.tags, {nullable: false, cascade:true})
  @JoinColumn({ name: 'userId' })
  // createdBy: Auth;
  author: Auth;

  @ManyToMany(() => Tag, (tag) => tag.articles,{nullable:false})
  @JoinTable({name: "tag_id"})
  tags?: Tag[];
  backgroundImage: string;
  @OneToMany(() => ArticleImage,(article_image) => article_image.article)
  images: ArticleImage[];
 
}