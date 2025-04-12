import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GENDER } from '../types/userType';
import Email from '../../email/entities/email.entity';
import Auth from 'src/auth/entities/auth.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  memberId: string;

  @Column()
  nickname: string;

  @OneToOne(() => Email, (email) => email.user, { nullable: true })
  @JoinColumn()
  email: Email | null;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ default: null, nullable: true })
  deletedAt: Date | null;

  @Column({
    type: 'enum',
    enum: Object.values(GENDER),
    default: GENDER.MALE,
  })
  gender: GENDER;

  @Column()
  birth: Date;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;

  // Todo: need to connect S3
  // @Column({ type: 'varchar', length: 255 })
  // mainProfileImage: string;
  //
  // @Column({ type: 'varchar', length: 255 })
  // subProfileImage: string;
  //
  // @Column({ type: 'varchar', length: 255 })
  // businessCard: string;
}
