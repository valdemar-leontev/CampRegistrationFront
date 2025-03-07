export interface IRegistrationForm {
  firstName: string;

  lastName: string;

  dateOfBirth: Date;

  phone?: string | undefined;

  church: number;

  otherChurchName?: string | undefined;

  otherChurchAddress?: string | undefined;
}