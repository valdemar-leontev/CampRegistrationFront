export interface IRegistrationForm {
  firstName: string;

  lastName: string;

  dateOfBirth: Date;

  phone?: string | undefined;

  city: string;

  church: number;

  otherChurchName?: string | undefined;

  otherChurchAddress?: string | undefined;
}