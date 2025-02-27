import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { DrawerRegistration } from '@/components/appComponents/drawer-registration';

export const CampInfoPage = () => {
  const camps = [
    {
      name: "Детский",
      code: "D",
      startDate: "30.06",
      endDate: "05.06",
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
      startDate: "07.07",
      endDate: "12.07",
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
      startDate: "14.07",
      endDate: "15.07",
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
      startDate: "17.07",
      endDate: "20.07",
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
      startDate: "21.07",
      endDate: "26.07",
      prices: {
        April: 500,
        May: 800,
        June: 1000,
        July: 1200,
      },
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Информация о лагерях</h1>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
      >
        {camps.map((camp, index) => (
          <SwiperSlide key={index}>
            <div className="bg-accent hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center rounded-2xl">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">{camp.name}</h2>
              <p className="text-gray-600"><strong>Код лагеря:</strong> {camp.code}</p>
              <p className="text-gray-600"><strong>Дата начала:</strong> {camp.startDate}</p>
              <p className="text-gray-600"><strong>Дата конца:</strong> {camp.endDate}</p>
              <h3 className="text-lg font-semibold mt-4 text-gray-800">Цены:</h3>
              <ul className="list-disc list-inside text-gray-600">
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
}
