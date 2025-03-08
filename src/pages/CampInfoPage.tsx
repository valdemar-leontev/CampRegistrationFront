import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { RegistrationForm } from '@/components/appComponents/registration-form/registration-form';
import { FaCalendarAlt } from 'react-icons/fa';

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

  const cardGradients = [
    'linear-gradient(135deg, #654ea3, #eaafc8)',
    'linear-gradient(135deg, #6a11cb, #2575fc)',
    'linear-gradient(135deg, #cc2b5e, #753a88)',
    'linear-gradient(135deg, #4568dc, #b06ab3)',
  ];

  return (
    <div className="flex flex-col items-center min-w-full">
      <h1 className="text-3xl font-bold text-center my-6 text-[#1e1e1e] min-w-full ml-[3%]">
        Информация о лагерях
      </h1>

      <div className='w-full min-w-full h-[65vh] relative flex pb-10 justify-center items-end'>
        <div className="fixed top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
          <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]}>
            {camps.map((camp, index) => (
              <SwiperSlide key={index}>
                <div
                  className="hover:shadow-lg transition-shadow duration-300 p-8 flex flex-col items-center rounded-2xl shadow-md"
                  style={{
                    background: cardGradients[index % cardGradients.length],
                    color: 'white',
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
                  <h3 className="text-lg font-semibold mt-4">Цены:</h3>
                  <ul className="list-disc list-inside">
                    <li>Апрель: <span className="font-bold">{camp.prices.April} руб.</span></li>
                    <li>Май: <span className="font-bold">{camp.prices.May} руб.</span></li>
                    <li>Июнь: <span className="font-bold">{camp.prices.June} руб.</span></li>
                    <li>Июль: <span className="font-bold">{camp.prices.July} руб.</span></li>
                  </ul>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <RegistrationForm />
      </div>
    </div>
  );
};