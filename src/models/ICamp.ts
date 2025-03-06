import { IPrice } from './IPrice';

export interface ICamp {
  id: number;

  name: string;

  startDate: Date;

  endDate: Date;

  prices: IPrice[]
}