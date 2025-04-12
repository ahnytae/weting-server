import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../../user/entities/user.entity';

@Entity()
export default class Auth {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  refreshToken: string;

  // @Column()
  // lastLogin: Date;

  @OneToOne(() => User, (user) => user.auth)
  @JoinColumn()
  user: User;
}
