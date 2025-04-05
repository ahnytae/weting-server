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

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date | null;

  @Column({
    type: 'enum',
    enum: Object.values(GENDER),
    default: GENDER.MALE,
  })
  gender: GENDER;

  @Column({ type: 'date' })
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

  @Column()
  isValidate: boolean;

  @Column()
  mailValidateCode: number | null;
}
