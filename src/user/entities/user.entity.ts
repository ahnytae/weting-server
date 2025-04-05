import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GENDER } from '../types/userType';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true, nullable: true })
  memberId: string;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  nickname: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @DeleteDateColumn({ default: null, nullable: true })
  deletedAt: Date | null;

  @Column({
    type: 'enum',
    enum: Object.values(GENDER),
    default: GENDER.MALE,
    nullable: true,
  })
  gender: GENDER;

  @Column({ type: 'date', nullable: true })
  birth: Date;

  // Todo: need to connect S3
  // @Column({ type: 'varchar', length: 255 })
  // mainProfileImage: string;
  //
  // @Column({ type: 'varchar', length: 255 })
  // subProfileImage: string;
  //
  // @Column({ type: 'varchar', length: 255 })
  // businessCard: string;

  @Column({ nullable: true })
  isValidate: boolean;

  @Column({ nullable: true })
  mailValidateCode: number | null;
}
