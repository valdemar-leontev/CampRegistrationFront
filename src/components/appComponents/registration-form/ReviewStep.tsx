import { ICamp } from '@/models/ICamp';
import { IPrice } from '@/models/IPrice';
import { IRegistrationForm } from '@/models/IRegistrationForm';
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { UseFormReturn } from 'react-hook-form';

interface ReviewStepProps {
  form: UseFormReturn<IRegistrationForm>;
  selectedChurch: number | null;
  selectedCamps: ICamp[];
  getCurrentPrice: (prices: IPrice[]) => number;
}

export const ReviewStep = ({ form, selectedChurch, selectedCamps, getCurrentPrice }: ReviewStepProps) => {
  const { watch } = form;

  return (
    <div className="text-left bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <Typography variant="h5" className="text-xl font-semibold text-gray-900 mb-3">Личная информация</Typography>
      <div className="space-y-1 text-gray-700">
        <Typography variant="body1"><strong>Имя:</strong> {watch("firstName")}</Typography>
        <Typography variant="body1"><strong>Фамилия:</strong> {watch("lastName")}</Typography>
        <Typography variant="body1"><strong>Дата рождения:</strong> {dayjs(watch("dateOfBirth")).format("DD.MM.YYYY")}</Typography>
        <Typography variant="body1"><strong>Телефон:</strong> {watch("phone")}</Typography>
      </div>

      <Typography variant="h5" className="text-xl font-semibold text-gray-900 mt-6 mb-3">Церковь</Typography>
      <div className="space-y-1 text-gray-700">
        <Typography variant="body1"><strong>Церковь:</strong> {watch("church")}</Typography>
        {selectedChurch === 0 && (
          <>
            <Typography variant="body1"><strong>Название:</strong> {watch("otherChurchName")}</Typography>
            <Typography variant="body1"><strong>Адрес:</strong> {watch("otherChurchAddress")}</Typography>
          </>
        )}
      </div>

      <Typography variant="h5" className="text-xl font-semibold text-gray-900 mt-6 mb-3">Выбранные лагеря</Typography>
      <div className="space-y-1 text-gray-700">
        {selectedCamps.map((camp) => (
          <Typography variant="body1" key={camp.name}>
            <strong>{camp.name}</strong>
            <br />
            {dayjs(camp.startDate).format('D MMMM')} - {dayjs(camp.endDate).format('D MMMM')} – {getCurrentPrice(camp.prices)}₽
          </Typography>
        ))}
      </div>

      <Typography variant="h5" className="text-xl font-semibold text-gray-900 mt-6">
        ИТОГО: <span className="text-blue-600">{selectedCamps.reduce((acc, camp) => acc + getCurrentPrice(camp.prices), 0)}₽</span>
      </Typography>
    </div>
  );
};