import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { GiPriceTag } from 'react-icons/gi';

export const CampInfoPage: FC = () => {
  const camps = [
    {
      name: "Детский",
      code: "D",
      startDate: "30 Июнь (ПН)",
      endDate: "05 Июнь (СБ)",
      prices: { April: 500, May: 800, June: 1000, July: 1200 },
    },
    {
      name: "Подростковый",
      code: "P",
      startDate: "07 Июль (ПН)",
      endDate: "12 Июль (СБ)",
      prices: { April: 500, May: 800, June: 1000, July: 1200 },
    },
    {
      name: "Мужской",
      code: "M",
      startDate: "14 Июль (ПН)",
      endDate: "15 Июль (ВТ)",
      prices: { April: 1000, May: 1500, June: 2000, July: 1200 },
    },
    {
      name: "Общецерковный",
      code: "O",
      startDate: "17 Июль (ЧТ)",
      endDate: "20 Июль (ВС)",
      prices: { April: 500, May: 800, June: 1000, July: 1200 },
    },
    {
      name: "Молодежный",
      code: "Y",
      startDate: "21 Июль (ПН)",
      endDate: "26 Июль (СБ)",
      prices: { April: 500, May: 800, June: 1000, July: 1200 },
    },
  ];

  const cardColors = [
    'rgba(101, 78, 163)',
    'rgba(106, 17, 203)',
    'rgba(204, 43, 94)',
    'rgba(69, 104, 220)',
  ];

  return (
    <div className="flex flex-col items-center min-w-full bg-gray-50">
      <h1 className="text-3xl font-bold text-center my-6 text-gray-800 min-w-full">
        Основная информация
      </h1>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 w-full max-w-md mx-auto"
      >
        <div className="flex items-center justify-center bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-200">
          <GiPriceTag className="text-indigo-600 text-xl mr-3" />
          <span className="text-sm font-medium text-gray-700">
            <span className="font-bold text-indigo-600">Цены указаны за 1 день</span> проживания
          </span>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-2"
          >
            <FaInfoCircle className="text-indigo-400" />
          </motion.div>
        </div>
      </motion.div>

      <div className='w-full min-w-full h-[65vh] relative flex pb-10 justify-center items-end'>
        <div className="fixed top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
          <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]}>
            {camps.map((camp, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="hover:shadow-lg transition-shadow duration-300 p-8 flex flex-col items-center rounded-2xl shadow-md backdrop-blur-sm"
                  style={{
                    backgroundColor: cardColors[index % cardColors.length],
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                  whileHover={{ scale: 1.02 }}
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
                  <h3 className="text-lg font-semibold mt-4">Цены:</h3>
                  <ul className="list-disc list-inside">
                    <li>Апрель: <span className="font-bold">{camp.prices.April} руб.</span></li>
                    <li>Май: <span className="font-bold">{camp.prices.May} руб.</span></li>
                    <li>Июнь: <span className="font-bold">{camp.prices.June} руб.</span></li>
                    <li>Июль: <span className="font-bold">{camp.prices.July} руб.</span></li>
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