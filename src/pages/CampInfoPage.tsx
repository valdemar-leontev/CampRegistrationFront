import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { BiCool } from "react-icons/bi";
import { FaChild } from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md";
import { AiFillCustomerService } from "react-icons/ai";
import { GiMuscleUp } from "react-icons/gi";



export const CampInfoPage: FC = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

  const camps = [
    {
      name: "Детский",
      code: "D",
      startDate: "30 Июнь (ПН)",
      endDate: "05 Июль (СБ)",
      dayText: '6 дней',
      days: 6,
      prices: { April: 500, May: 800, June: 1000, July: 1200 },
      ageRange: "7-12 лет (6 лет с сопровождением)",
      icon: <FaChild className="inline mr-1" size={32} />
    },
    {
      name: "Подростковый",
      code: "P",
      startDate: "07 Июль (ПН)",
      endDate: "12 Июль (СБ)",
      dayText: '6 дней',
      days: 6,
      prices: { April: 500, May: 800, June: 1000, July: 1200 },
      ageRange: "12-16 лет",
      icon: <BiCool className="inline mr-1" size={32} />
    },
    {
      name: "Мужской",
      code: "M",
      startDate: "14 Июль (ПН)",
      endDate: "15 Июль (ВТ)",
      dayText: '2 дня',
      days: 2,
      prices: { April: 1000, May: 1500, June: 2000, July: 2500 },
      ageRange: "для всех возрастов",
      icon: <GiMuscleUp className="inline mr-1" size={32} />
    },
    {
      name: "Общецерковный",
      code: "O",
      startDate: "17 Июль (ЧТ)",
      endDate: "20 Июль (ВС)",
      dayText: '4 дня',
      days: 4,
      prices: { April: 500, May: 800, June: 1000, July: 1200 },
      ageRange: "для всех возрастов",
      icon: <MdFamilyRestroom className="inline mr-1" size={32} />
    },
    {
      name: "Молодежный",
      code: "Y",
      startDate: "21 Июль (ПН)",
      endDate: "26 Июль (СБ)",
      dayText: '6 дней',
      days: 6,
      prices: { April: 500, May: 800, June: 1000, July: 1200 },
      ageRange: "от 16 лет (15 лет только с регистрацией в подростковый)",
      icon: <AiFillCustomerService className="inline mr-1" size={32} />
    },
  ];

  const cardColors = [
    'rgba(101, 78, 163)',
    'rgba(106, 17, 203)',
    'rgba(204, 43, 94)',
    'rgba(69, 104, 220)',
  ];

  const getAvailableMonths = () => {
    const months = ['April', 'May', 'June', 'July'];
    const currentMonthIndex = months.findIndex(m =>
      m.toLowerCase() === currentMonth.toLowerCase()
    );
    return months.slice(Math.max(0, currentMonthIndex - 1));
  };

  const calculateTotalPrice = (camp: typeof camps[0], month: keyof typeof camp.prices) => {
    return camp.prices[month] * camp.days;
  };

  const monthNames = {
    April: "Апрель",
    May: "Май",
    June: "Июнь",
    July: "Июль"
  };

  return (
    <div className="flex flex-col items-center min-w-full px-4">
      <h1 className="text-2xl font-bold text-center my-4 text-gray-800">
        Основная информация об отдыхе
      </h1>

      <div className='w-full h-[40%] !mt- max-w-md mx-auto'>
        <Swiper
          effect={'cards'}
          grabCursor={true}
          modules={[EffectCards]}
          className="h-full"
        >
          {camps.map((camp, index) => (
            <SwiperSlide key={index} className='rounded-2xl'>
              <motion.div
                className="h-full p-4 flex flex-col rounded-2xl shadow-lg"
                style={{
                  backgroundColor: cardColors[index % cardColors.length],
                  color: 'white',
                }}
              >
                <div className="flex items-center mb-2">
                  {camp.icon}
                  <h2 className="text-xl font-bold">{camp.name}</h2>
                </div>

                <div className="text-sm mb-3 text-left">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span>{camp.startDate} - {camp.endDate}</span>
                  </div>
                  <div className="ml-6">({camp.dayText})</div>
                </div>

                <div className="text-sm bg-white/20 p-2 rounded-xl mb-3">
                  <strong>Возраст:</strong> {camp.ageRange}
                </div>

                <h3 className="text-sm font-semibold mb-2">Стоимость:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {getAvailableMonths().map((month) => (
                    <div
                      key={month}
                      className="bg-white/20 p-2 rounded-xl flex flex-col"
                    >
                      <div className="font-medium">{monthNames[month as keyof typeof monthNames]}:</div>
                      <div className="font-bold">
                        {calculateTotalPrice(camp, month as keyof typeof camp.prices)}₽
                      </div>
                      <div className="text-xs opacity-80">
                        ({camp.prices[month as keyof typeof camp.prices]}₽/день)
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};