export interface IRegistrationForm {
  firstName: string;

  lastName: string;

  dateOfBirth: Date;

  phone?: string;

  city: string;

  church: number;

  otherChurchName?: string | undefined;

  otherChurchAddress?: string | undefined;
}