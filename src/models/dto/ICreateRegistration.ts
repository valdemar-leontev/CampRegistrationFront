export interface ICreateRegistration {
    name: string,
    lastName: string,
    birthdate: Date,
    city: string,
    registrationDate: Date,
    priceIds: number[]
    userId: number,
    churchId: number,
    phone: string;
}