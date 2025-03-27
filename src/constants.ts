import { z } from 'zod';
import { Invoice } from './types';
// @ts-ignore
import { matchIsValidTel } from 'mui-tel-input';

export const invoices: Invoice[] = [
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Оплатил' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Оплатил' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
];


export const registrationSchema = z.object({
  firstName: z.string().min(1, "Имя обязательно"),
  lastName: z.string().min(1, "Фамилия обязательна"),
  dateOfBirth: z.date({
    required_error: "Дата рождения обязательна",
  }),
  phone: z.string()
    .min(1, "Обязательное поле")
    .refine(
      (value) => matchIsValidTel(value, { onlyCountries: ['RU'] }),
      "Неверный формат телефона"
    ),
  city: z.string().min(1, "Город обязателен"),
  church: z.number().min(1, "Церковь обязательна"),
});