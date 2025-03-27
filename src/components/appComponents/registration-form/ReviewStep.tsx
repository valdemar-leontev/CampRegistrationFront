import { getDiscountedPrice } from '@/helpers/getDiscountedPrice';
import { ChurchEnum } from '@/models/enums/ChurchEnum';
import { ICamp } from '@/models/ICamp';
import { IPrice } from '@/models/IPrice';
import { IRegistrationForm } from '@/models/IRegistrationForm';
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { UseFormReturn } from 'react-hook-form';

interface ReviewStepProps {
  form: UseFormReturn<IRegistrationForm>;
  selectedCamps: ICamp[];
  getCurrentPrice: (prices: IPrice[]) => IPrice | null;
  age: number;
}

export const ReviewStep = ({ form, selectedCamps, getCurrentPrice, age }: ReviewStepProps) => {
  const { watch } = form;
  const dateOfBirth = watch("dateOfBirth");

  const totalPrice = selectedCamps.reduce((acc, camp) => {
    const basePrice = getCurrentPrice(camp.prices)?.totalValue || 0;
    return acc + getDiscountedPrice(age, basePrice);
  }, 0);

  return (
    <div className="text-left bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <Typography variant="h5" className="text-xl font-semibold text-gray-900 mb-3">Личная информация</Typography>
      <div className="space-y-1 text-gray-700">
        <Typography variant="body1"><strong>Имя:</strong> {watch("firstName")}</Typography>
        <Typography variant="body1"><strong>Фамилия:</strong> {watch("lastName")}</Typography>
        <Typography variant="body1">
          <strong>Дата рождения:</strong> {dayjs(dateOfBirth).format("DD.MM.YYYY")} 
          <span className="ml-2 text-sm text-gray-500">({age} лет)</span>
        </Typography>
        <Typography variant="body1"><strong>Телефон:</strong> {watch("phone")}</Typography>
      </div>

      <Typography variant="h5" className="text-xl font-semibold text-gray-900 !mt-6 !mb-1">Церковь</Typography>
      <div className="space-y-1 text-gray-700">
        <Typography variant="body1"><strong>Церковь:</strong> {ChurchEnum[watch("church")]}</Typography>
      </div>

      <Typography variant="h5" className="text-xl font-semibold text-gray-900 !mt-6 !mb-1">Выбранные отдыхи</Typography>
      <div className="space-y-1 text-gray-700">
        {selectedCamps.map((camp) => {
          const basePrice = getCurrentPrice(camp.prices)?.totalValue || 0;
          const discountedPrice = getDiscountedPrice(age, basePrice);
          const hasDiscount = discountedPrice !== basePrice;

          return (
            <div key={camp.name} className="mb-2">
              <Typography variant="body1" className='text-gray-600'>
                <strong>{camp.name}</strong>
                <br />
                📅 {dayjs(camp.startDate).format('D MMMM')} - {dayjs(camp.endDate).format('D MMMM')}
                <br />
                💰 {hasDiscount ? (
                  <>
                    <span className="line-through text-gray-400 mr-1">{basePrice}₽</span>
                    <span className="text-green-600 font-semibold">
                      {discountedPrice}₽ {age < 2 ? '(бесплатно)' : `(-${Math.round((1 - discountedPrice/basePrice) * 100)}%)`}
                    </span>
                  </>
                ) : (
                  <span>{basePrice}₽</span>
                )}
              </Typography>
              {hasDiscount && (
                <Typography variant="body2" className="text-xs text-gray-500 mt-1">
                  {age < 2 
                    ? "Для детей до 2 лет участие бесплатное" 
                    : "Для детей 2-6 лет действует скидка 50%"}
                </Typography>
              )}
            </div>
          );
        })}
      </div>

      <Typography variant="h5" className="text-xl font-semibold text-gray-900 !mt-6">
        ИТОГО: <span className="text-blue-600">{totalPrice}₽</span>
      </Typography>
    </div>
  );
};