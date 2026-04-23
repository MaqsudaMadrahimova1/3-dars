import {
    Entity,
    PrimaryColumn,
    Column,
    OneToMany,
    BeforeInsert,
  } from 'typeorm';
//   import * as bcrypt from 'bcrypt';
//   import { Article } from './article.entity';
  
  @Entity('auth')
  export class Auth {
    static findOne(arg0: { where: { email: string; }; raw: boolean; }) {
      throw new Error('Method not implemented.');
    }
    @PrimaryColumn({ type: 'int', generated: 'increment' })
    id: number;
  
    @Column({ type: 'varchar', nullable: false })
    username: string;
  
    @Column({ type: 'varchar', nullable: false, unique: true })
    email: string;
  
    @Column({ type: 'varchar', nullable: false })
    password: string;
  
    @Column({ type: 'varchar', nullable: false })
    otp: string;
  
    // @OneToMany(() => Article, (article) => article.auth)
    // articles?: Article[];
  
    // @BeforeInsert()
    // async hashPassword() {
    //   this.password = await bcrypt.hash(this.password, 10);
    // }
  }