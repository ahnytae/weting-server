import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../../user/entities/user.entity';

@Entity()
export default class Email {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => User, (user) => user.email)
  user: User;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isValidate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  randomCode: number;
}
