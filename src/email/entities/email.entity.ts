import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../../user/entities/user.entity';

@Entity()
export default class Email {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => User, (user) => user.email)
  @Column({ unique: true })
  email: string;

  @Column()
  isValidate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  randomCode: number;
}
