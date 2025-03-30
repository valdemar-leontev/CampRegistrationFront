import { IChurch } from './IChurch';

export interface IAdmin {
  id: number,

  bankCardNumber: string,

  bankCardOwner: string,

  bankName: string;

  phoneNumber: string,

  userId: number,

  churchId: number;

  church: IChurch

  user: {
    firstName: string,
    
    lastName: string
  }
}
