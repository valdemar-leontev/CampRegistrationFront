import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { DrawerRegistration } from '@/components/appComponents/drawer-registration';
import { FaCalendarAlt } from 'react-icons/fa';

export const CampInfoPage: FC = () => {
  const camps = [
    {
      name: "Детский",
      code: "D",
      startDate: "30 Июнь",
      endDate: "05 Июнь",
      prices: {
        April: 500,
        May: 800,
        June: 1000,
        July: 1200,
      },
    },
    {
      name: "Подростковый",
      code: "P",
      startDate: "07 Июль",
      endDate: "12 Июль",
      prices: {
        April: 500,
        May: 800,
        June: 1000,
        July: 1200,
      },
    },
    {
      name: "Мужской",
      code: "M",
      startDate: "14 Июль",
      endDate: "15 Июль",
      prices: {
        April: 1000,
        May: 1500,
        June: 2000,
        July: 1200,
      },
    },
    {
      name: "Общецерковный",
      code: "O",
      startDate: "17 Июль",
      endDate: "20 Июль",
      prices: {
        April: 500,
        May: 800,
        June: 1000,
        July: 1200,
      },
    },
    {
      name: "Молодежный",
      code: "Y",
      startDate: "21 Июль",
      endDate: "26 Июль",
      prices: {
        April: 500,
        May: 800,
        June: 1000,
        July: 1200,
      },
    },
  ];

  const pastelColors = [
    '#f5f1ee',
    '#edeef7',
    '#e0f7fa',
    '#fff3e0',
    '#e8f5e9',
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#1e1e1e]">Информация о лагерях</h1>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
      >
        {camps.map((camp, index) => (
          <SwiperSlide key={index}>
            <div 
              className="hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center rounded-2xl"
              style={{ backgroundColor: pastelColors[index % pastelColors.length], background: `linear-gradient(135deg, ${pastelColors[index % pastelColors.length]} 0%, rgba(255, 255, 255) 100%)` }}
            >
              <h2 className="text-2xl font-semibold mb-2 text-black">{camp.name}</h2>
              <div className="flex items-center mb-2 text-black">
                <FaCalendarAlt className="mr-2" />
                <p><strong>Дата начала:</strong> {camp.startDate}</p>
              </div>
              <div className="flex items-center mb-4 text-black">
                <FaCalendarAlt className="mr-2" />
                <p><strong>Дата конца:</strong> {camp.endDate}</p>
              </div>
              <h3 className="text-lg font-semibold mt-4 text-gray-800">Цены:</h3>
              <ul className="list-disc list-inside text-black">
                <li>Апрель: <span className="font-bold">{camp.prices.April} руб.</span></li>
                <li>Май: <span className="font-bold">{camp.prices.May} руб.</span></li>
                <li>Июнь: <span className="font-bold">{camp.prices.June} руб.</span></li>
                <li>Июль: <span className="font-bold">{camp.prices.July} руб.</span></li>
              </ul>
            </div>
          </SwiperSlide>
        ))}

        <div className='mt-6'>
          <DrawerRegistration />
        </div>
      </Swiper>
    </div>
  );
};
