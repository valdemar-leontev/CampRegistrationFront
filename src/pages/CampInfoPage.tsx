import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const CampInfoPage: FC = () => {
  const camps = [
    {
      name: "Детский",
      code: "D",
      startDate: "30 Июнь (ПН)",
      endDate: "05 Июль (СБ)",
      days: 6,
      prices: { April: 500, May: 800, June: 1000, July: 1200 },
    },
    {
      name: "Подростковый",
      code: "P",
      startDate: "07 Июль (ПН)",
      endDate: "12 Июль (СБ)",
      days: 6,
      prices: { April: 500, May: 800, June: 1000, July: 1200 },
    },
    {
      name: "Мужской",
      code: "M",
      startDate: "14 Июль (ПН)",
      endDate: "15 Июль (ВТ)",
      days: 2,
      prices: { April: 1000, May: 1500, June: 2000, July: 2500 },
    },
    {
      name: "Общецерковный",
      code: "O",
      startDate: "17 Июль (ЧТ)",
      endDate: "20 Июль (ВС)",
      days: 4,
      prices: { April: 500, May: 800, June: 1000, July: 1200 },
    },
    {
      name: "Молодежный",
      code: "Y",
      startDate: "21 Июль (ПН)",
      endDate: "26 Июль (СБ)",
      days: 6,
      prices: { April: 500, May: 800, June: 1000, July: 1200 },
    },
  ];

  const cardColors = [
    'rgba(101, 78, 163)',
    'rgba(106, 17, 203)',
    'rgba(204, 43, 94)',
    'rgba(69, 104, 220)',
  ];

  // Функция для расчета общей стоимости в зависимости от месяца регистрации
  const calculateTotalPrice = (camp: typeof camps[0], month: keyof typeof camp.prices) => {
    return camp.prices[month] * camp.days;
  };

  // Названия месяцев для отображения
  const monthNames = {
    April: "Апрель",
    May: "Май",
    June: "Июнь",
    July: "Июль"
  };

  return (
    <div className="flex flex-col items-center min-w-full">
      <h1 className="text-3xl font-bold text-center my-6 text-gray-800 min-w-full">
        Основная информация
      </h1>

      <div className='w-full min-w-full h-[65vh] relative flex pb-10 justify-center items-end'>
        <div className="fixed top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
          <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]}>
            {camps.map((camp, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="transition-shadow duration-300 p-8 flex flex-col items-center rounded-2xl shadow-md backdrop-blur-sm"
                  style={{
                    backgroundColor: cardColors[index % cardColors.length],
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h2 className="text-2xl font-semibold mb-2">{camp.name}</h2>
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="mr-2" />
                    <p>
                      <strong>Дата начала:</strong> {camp.startDate}
                    </p>
                  </div>
                  <div className="flex items-center mb-4">
                    <FaCalendarAlt className="mr-2" />
                    <p>
                      <strong>Дата конца:</strong> {camp.endDate}
                    </p>
                  </div>
                  <p className="mb-2"><strong>Длительность:</strong> {camp.days} дней</p>
                  
                  <h3 className="text-lg font-semibold mt-4 mb-2">Стоимость при регистрации:</h3>
                  <ul className="grid grid-cols-2 gap-2 w-full">
                    {(Object.keys(camp.prices) as Array<keyof typeof camp.prices>).map((month) => (
                      <li key={month} className="bg-white/20 p-2 rounded-2xl">
                        <div className="font-medium">{monthNames[month]}:</div>
                        <div className="font-bold text-lg">
                          {calculateTotalPrice(camp, month)} руб.
                        </div>
                        <div className="text-sm opacity-80">({camp.prices[month]} руб./день)</div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};