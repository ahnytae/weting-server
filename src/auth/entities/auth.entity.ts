import User from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Auth {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  refreshToken: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  lastLogin: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateLastLogin() {
    this.lastLogin = new Date();
  }

  @OneToOne(() => User, (user) => user.auth)
  @Column()
  user: User;
}
