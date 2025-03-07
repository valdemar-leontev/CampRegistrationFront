import { ICamp } from '@/models/ICamp';
import { IPrice } from '@/models/IPrice';
import { Typography } from "@mui/material";
import dayjs from "dayjs";

interface CampSelectionStepProps {
  campList: ICamp[];
  selectedCamps: ICamp[];
  toggleCamp: (camp: ICamp) => void;
  getCurrentPrice: (prices: IPrice[]) => number;
}

export const CampSelectionStep = ({ campList, selectedCamps, toggleCamp, getCurrentPrice }: CampSelectionStepProps) => {
  return (
    <div className="space-y-4 overflow-auto max-h-[65vh]">
      {campList.map((camp) => {
        const isSelected = selectedCamps.includes(camp);

        return (
          <div
            key={camp.name}
            onClick={() => toggleCamp(camp)}
            className={`px-5 py-3 text-left rounded-2xl border transition cursor-pointer flex items-center gap-4
              ${isSelected
                ? "bg-blue-100 border-blue-500 shadow-md"
                : "bg-white border-gray-200 shadow-lg hover:shadow-xl"
              }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <div className="flex-1">
              <Typography variant="h6" className="text-lg font-semibold text-gray-900">{camp.name}</Typography>
              <Typography variant="body2" className="text-sm text-gray-600 mt-1">
                📅 Дата: {dayjs(camp.startDate).format('D MMMM')} - {dayjs(camp.endDate).format('D MMMM')}
              </Typography>
              <Typography variant="body2" className="text-sm text-gray-600 mt-1">
                💰 Цена: {getCurrentPrice(camp.prices)}₽
              </Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
};