import { IRegistrationForm } from '@/models/IRegistrationForm';
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
// @ts-ignore
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';

dayjs.locale('ru');

interface IPersonalInfoStepProps {
  form: UseFormReturn<IRegistrationForm>;
}

export const PersonalInfoStep: FC<IPersonalInfoStepProps> = ({ form }) => {
  const { register, watch, setValue, formState, clearErrors, setError } = form;

  return (
    <>
      <TextField
        label="Имя"
        {...register("firstName")}
        error={!!formState.errors.firstName}
        helperText={formState.errors.firstName?.message}
      />
      <TextField
        label="Фамилия"
        {...register("lastName")}
        error={!!formState.errors.lastName}
        helperText={formState.errors.lastName?.message}
      />
      <TextField
        label="Город"
        {...register("city")}
        error={!!formState.errors.city}
        helperText={formState.errors.city?.message}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <DatePicker
          maxDate={dayjs()}
          minDate={dayjs().subtract(100, 'year')}
          label="Дата рождения"
          value={watch("dateOfBirth") ? dayjs(watch("dateOfBirth")) : null}
          onChange={(date) => {
            if (date) {
              setValue("dateOfBirth", date.toDate());
            } else {
              setValue("dateOfBirth", new Date());
            }
          }}
          format="DD MMMM YYYY"
          slotProps={{
            textField: {
              error: !!formState.errors.dateOfBirth,
              helperText: formState.errors.dateOfBirth?.message,
            },
          }}
        />
      </LocalizationProvider>
      <div className='flex flex-col'>
        <MuiTelInput
          forceCallingCode
          onlyCountries={['RU']}
          defaultCountry="RU"
          value={watch('phone')}
          error={!!formState.errors.phone}
          onChange={(value: string) => {
            const isValid = matchIsValidTel(value, {
              onlyCountries: ['RU']
            });

            if (!isValid) {
              setError('phone', { type: "custom", message: "Неверный формат" });
            } else {
              clearErrors('phone');
            }
            setValue('phone', value);
          }}
        />
        <div className='!text-[0.75rem] text-left ml-4 text-[#d3302f]'>
          {formState.errors.phone ? formState.errors.phone!.message : ''}
        </div>
      </div>
    </>
  );
};