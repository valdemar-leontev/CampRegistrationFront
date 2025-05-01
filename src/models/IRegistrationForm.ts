export interface IRegistrationForm {
  firstName: string;

  lastName: string;

  dateOfBirth: Date;

  phone?: string;

  city: string;

  church: number;

  isMedicalWorker: boolean;

  isOrganizer: boolean;
}