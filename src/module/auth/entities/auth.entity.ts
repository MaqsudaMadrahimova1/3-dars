import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Article } from '../../article/entities/article.entity';
import { RolesUser } from 'src/shared/enums/roles.enum';
import { Tag } from 'src/tag/entities/tag.entity';

@Entity('auth')
export class Auth {
  @PrimaryColumn({ type: 'int', generated: 'increment' })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  otp: string;

  @Column({ type: 'bigint', nullable: true, default: 0 })
  otpTime: number; 

  @Column({ type: 'enum', enum: RolesUser, default: RolesUser.USER })
  role: RolesUser; 

  @OneToMany(() => Article, (article) => article.author)
  articles?: Article[];

  @OneToMany(() => Tag, (tag) => tag.createdBy)
  tags?: Tag[];
}