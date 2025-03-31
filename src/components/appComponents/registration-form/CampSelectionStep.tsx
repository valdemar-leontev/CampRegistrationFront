import apiClient from '@/axios';
import { getDiscountedPrice } from '@/helpers/getDiscountedPrice';
import { ICamp } from '@/models/ICamp';
import { IPrice } from '@/models/IPrice';
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';

dayjs.extend(utc);

interface CampSelectionStepProps {
  campList: ICamp[];
  selectedCamps: ICamp[];
  toggleCamp: (camp: ICamp) => void;
  getCurrentPrice: (prices: IPrice[]) => IPrice | null;
  birthDate: Date;
  existedRegistrationData: number[];
}

export const CampSelectionStep = ({
  campList,
  selectedCamps,
  toggleCamp,
  getCurrentPrice,
  birthDate,
  existedRegistrationData
}: CampSelectionStepProps) => {
  const [disabledCamps, setDisabledCamps] = useState<number[]>([]);

  const isCampDisabled = (campId: number) =>
    disabledCamps.includes(campId) || existedRegistrationData.includes(campId);

  useEffect(() => {
    (async () => {
      try {
        const response = await apiClient.get(`/camps/unavailable`);
        setDisabledCamps(response.data);
      } catch (error) {
        console.error('Error fetching unavailable camps:', error);
      }
    })();
  }, []);

  const getAgeAtCampStart = (campStartDate: Date) => {
    const birth = dayjs(birthDate);
    const campStart = dayjs(campStartDate);
    return campStart.diff(birth, 'year');
  };

  return (
    <div className="space-y-4 overflow-auto max-h-[65vh]">
      {campList.map((camp) => {
        const isSelected = selectedCamps.some(c => c.id === camp.id) ||
          existedRegistrationData.includes(camp.id);
        const isDisabled = isCampDisabled(camp.id);
        const isAlreadyRegistered = existedRegistrationData.includes(camp.id);
        const campStartDate = new Date(camp.startDate);
        const ageAtCampStart = getAgeAtCampStart(campStartDate);

        return (
          <div
            key={camp.id}
            onClick={() => !isDisabled && !isAlreadyRegistered && toggleCamp(camp)}
            className={`px-5 py-3 text-left rounded-2xl border transition flex items-center gap-4
              ${isSelected
                ? isAlreadyRegistered
                  ? "bg-green-50 border-green-300 shadow-md"
                  : "bg-blue-100 border-blue-500 shadow-md"
                : isDisabled
                  ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                  : "bg-white border-gray-200 shadow-lg hover:shadow-xl cursor-pointer"
              }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              disabled={isDisabled || isAlreadyRegistered}
              className={`w-6 h-6 border-gray-300 rounded focus:ring-blue-500 
                ${(isDisabled || isAlreadyRegistered) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onChange={() => { }}
            />
            <div className="flex-1">
              <Typography
                variant="h6"
                className={`!text-[16px] font-semibold flex items-start flex-col ${isDisabled ? 'text-gray-500' : 'text-gray-900'}`}
              >
                {camp.name}
          
                {isDisabled && !isAlreadyRegistered && (
                  <p className="text-sm text-red-500 !text-[14px]">(Места закончились)</p>
                )}
                {isAlreadyRegistered && (
                  <p className="text-sm text-green-600 !text-[14px]">(Зарегистрирован)</p>
                )}
              </Typography>
              <Typography
                variant="body2"
                className={`text-sm ${isDisabled ? 'text-gray-500' : 'text-gray-600'} mt-1`}
              >
                📅 Дата: {dayjs(camp.startDate).utc().format('D MMMM')} - {dayjs(camp.endDate).utc().format('D MMMM')}
              </Typography>
              <Typography variant="body2" className={`text-sm ${isDisabled ? 'text-gray-500' : 'text-gray-600'} mt-1`}>
                💰 Цена: {' '}
                {ageAtCampStart < 2 ? (
                  <span className="text-green-600 font-semibold">Бесплатно</span>
                ) : ageAtCampStart <= 6 ? (
                  <>
                    <span className="line-through text-gray-400 mr-1">{getCurrentPrice(camp.prices)?.totalValue}₽</span>
                    <span className="text-green-600 font-semibold">
                      {getDiscountedPrice(ageAtCampStart, getCurrentPrice(camp.prices)?.totalValue || 0)} ₽ (скидка 50%)
                    </span>
                  </>
                ) : (
                  <span>{getCurrentPrice(camp.prices)?.totalValue}₽</span>
                )}
              </Typography>
              <Typography variant="body2" className="text-xs text-gray-500 mt-1">
                Возраст на начало лагеря: {ageAtCampStart} лет
              </Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
};