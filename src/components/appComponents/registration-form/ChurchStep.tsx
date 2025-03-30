import { ChurchEnum } from '@/models/enums/ChurchEnum';
import { IChurch } from '@/models/IChurch';
import { IRegistrationForm } from '@/models/IRegistrationForm';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import dayjs from 'dayjs';
import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface ChurchStepProps {
  form: UseFormReturn<IRegistrationForm>;
  churchesList: IChurch[];
  setSelectedChurch: (value: number | null) => void;
}

export const ChurchStep: FC<ChurchStepProps> = ({ form, churchesList, setSelectedChurch }) => {
  const { watch, setValue, formState, trigger } = form;

  return (
    <>
      <FormControl fullWidth error={!!formState.errors.church}>
        <InputLabel>Церковь</InputLabel>
        <Select
          label="Церковь"
          value={watch("church")}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedChurch(Number(value));
            setValue("church", Number(value));
            trigger("church");
          }}
          className='text-left'
        >
          {churchesList.map((church) => (
            <MenuItem
              key={church.id}
              value={church.id}
              disabled={
                church.id === ChurchEnum.Другая &&
                !dayjs().isAfter(dayjs('2025-06-01'))
              }
            >
              <div className="flex flex-col">
                <span>{church.name}</span>
                {church.id === ChurchEnum.Другая && !dayjs().isAfter(dayjs('2025-06-01')) && (
                  <p className="text-xs text-red-500 mt-1">
                    Регистрация откроется 1 июня
                  </p>
                )}
              </div>
            </MenuItem>
          ))}
        </Select >
        {
          formState.errors.church && (
            <FormHelperText error>
              {formState.errors.church.message}
            </FormHelperText>
          )
        }
      </FormControl >
    </>
  );
};