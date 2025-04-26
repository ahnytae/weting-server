import Email from '../../email/entities/email.entity';

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export type PartialEmailType = {
  email: string;
  createdAt: Date;
  randomCode: number;
} & Email;
