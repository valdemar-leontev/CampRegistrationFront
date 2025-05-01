import { IRegistrationForm } from '@/models/IRegistrationForm';
import { TextField } from "@mui/material";
import { LocalizationProvider, DateField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
// @ts-ignore
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaUserMd, FaUsersCog } from 'react-icons/fa';

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
        <DateField
          label="Дата рождения"
          value={watch("dateOfBirth") ? dayjs(watch("dateOfBirth")) : null}
          onChange={(date) => {
            if (date) {
              setValue("dateOfBirth", date.toDate());
            } else {
              setValue("dateOfBirth", new Date());
            }
          }}
          format="DD.MM.YYYY"
          maxDate={dayjs()}
          minDate={dayjs().subtract(100, 'year')}
          slotProps={{
            textField: {
              error: !!formState.errors.dateOfBirth,
              helperText: formState.errors.dateOfBirth?.message,
              onKeyDown: (e) => e.stopPropagation(),
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
              setError('phone', { type: "custom", message: "Неверный формат телефона" });
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

      {/* Стильные анимированные чекбоксы */}
      <div className="flex flex-col gap-4 mt-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all
            ${watch("isMedicalWorker")
              ? "bg-blue-50 border-2 border-blue-200"
              : "bg-gray-50 border-2 border-gray-200"}`}
          onClick={() => setValue("isMedicalWorker", !watch("isMedicalWorker"))}
        >
          <div className={`w-6 h-6 rounded-md flex items-center justify-center mr-3 transition-all
            ${watch("isMedicalWorker")
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-transparent"}`}
          >
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              animate={watch("isMedicalWorker") ? "checked" : "unchecked"}
              variants={{
                checked: { pathLength: 1 },
                unchecked: { pathLength: 0 }
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.path d="M5 13l4 4L19 7" />
            </motion.svg>
          </div>
          <FaUserMd className="text-blue-500 mr-2" size={20} />
          <span className={`font-medium ${watch("isMedicalWorker") ? "text-blue-800" : "text-gray-700"}`}>
            Мед. навыки
          </span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all
            ${watch("isOrganizer")
              ? "bg-purple-50 border-2 border-purple-200"
              : "bg-gray-50 border-2 border-gray-200"}`}
          onClick={() => setValue("isOrganizer", !watch("isOrganizer"))}
        >
          <div className={`w-6 h-6 rounded-md flex items-center justify-center mr-3 transition-all
            ${watch("isOrganizer")
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-transparent"}`}
          >
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              animate={watch("isOrganizer") ? "checked" : "unchecked"}
              variants={{
                checked: { pathLength: 1 },
                unchecked: { pathLength: 0 }
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.path d="M5 13l4 4L19 7" />
            </motion.svg>
          </div>
          <FaUsersCog className="text-purple-500 mr-2" size={20} />
          <span className={`font-medium ${watch("isOrganizer") ? "text-purple-800" : "text-gray-700"}`}>
            Я из команды организаторов
          </span>
        </motion.div>
      </div>
    </>
  );
};