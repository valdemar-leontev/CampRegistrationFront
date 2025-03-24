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
  otherChurchName: z.string().optional(),
  otherChurchAddress: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.church === 0) {
    if (!data.otherChurchName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Название церкви обязательно",
        path: ["otherChurchName"],
      });
    }
    if (!data.otherChurchAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Адрес церкви обязателен",
        path: ["otherChurchAddress"],
      });
    }
  }
});