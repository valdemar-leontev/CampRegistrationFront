import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useRef, useState } from 'react';
import apiClient from '@/axios';
import { useUserStore } from '@/stores/UserStore';
import dayjs from 'dayjs';
import { Tooltip, Typography } from '@mui/material';
import { RegistrationStatusEnum } from '@/models/enums/RegistrationStatusEnum';
import { CiCreditCard1 } from "react-icons/ci";
import { IoChevronBack, IoInformationOutline } from "react-icons/io5";
import { IoCheckmarkSharp } from "react-icons/io5";
import { CiCircleQuestion } from "react-icons/ci";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { IAdmin } from '@/models/IAdmin';
import { PaymentTypeEnum } from '@/models/enums/PaymentTypeEnum';
import { TfiFaceSad } from "react-icons/tfi";


interface IRegistration {
  id: number;
  name: string;
  lastName: string;
  birthdate: string;
  city: string;
  registrationDate: string;
  userId: number;
  registrationStatusId: number;
  paymentTypeId: number;
  adminId: number;
  registrationLinkPrice: {
    price: {
      campId: number;
      camp: {
        name: string;
      };
      value: number;
    };
  }[];
  paymentType: {
    name: string;
  };
  registrationStatus: {
    name: string;
  };
  paymentCheck: {
    data: { [key: string]: number };
  };
}

const getStatusIcon = (status: number) => {
  switch (status) {
    case RegistrationStatusEnum["Ожидает оплаты"]:
      return (
        <div className="flex justify-center bg-yellow-500 opacity-80 w-8 h-8 items-center rounded-full">
          <CiCreditCard1 size={22} className="text-white" />
        </div>
      );
    case RegistrationStatusEnum["На проверке"]:
      return (
        <div className="flex justify-center bg-purple-500 opacity-80 w-8 h-8 items-center rounded-full">
          <IoInformationOutline size={22} className="text-white" />
        </div>
      );
    case RegistrationStatusEnum.Оплачено:
      return (
        <div className="flex justify-center bg-green-500 opacity-80 w-8 h-8 items-center rounded-full">
          <IoCheckmarkSharp size={22} className="text-white" />
        </div>
      );
    case RegistrationStatusEnum.Отклонено:
      return (
        <div className="flex justify-center bg-red-500 opacity-80 w-8 h-8 items-center rounded-full">
          <TfiFaceSad size={22} className="text-white" />
        </div>
      );
    default:
      return (
        <div className="flex justify-center bg-gray-500 opacity-80 w-8 h-8 items-center rounded-full">
          <CiCircleQuestion size={22} className="text-white" />
        </div>
      );
  }
};

const renderPaymentCheck = (paymentCheck: { data: { [key: string]: number } }) => {
  if (!paymentCheck?.data) return null;

  const byteArray = Object.values(paymentCheck.data);
  const uint8Array = new Uint8Array(byteArray);

  const blob = new Blob([uint8Array], { type: 'image/*' });
  const imageUrl = URL.createObjectURL(blob);

  return (
    <PhotoView src={imageUrl}>
      <img
        src={imageUrl}
        alt="Payment Check"
        className="w-full h-[250px] object-contain cursor-pointer"
      />
    </PhotoView>
  );
};

export const MyRegistrationPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedRegistration, setSelectedRegistration] = useState<IRegistration | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: number]: boolean }>({});
  const tooltipRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const [admin, setAdmin] = useState<IAdmin>();

  useEffect(() => {
    (async () => {
      const response = await apiClient.get<IAdmin>(`/admins/${selectedRegistration!.adminId}`);
      setAdmin(response.data);
    })();
  }, [selectedRegistration]);

  const [currentStep, setCurrentStep] = useState<"info" | "payment">("info");

  const [paymentMethod, setPaymentMethod] = useState<PaymentTypeEnum | null>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { user } = useUserStore();
  const [registrationList, setRegistrationList] = useState<IRegistration[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await apiClient.get<IRegistration[]>(`users/${user!.id}/registrations`);
        setRegistrationList(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    })();
  }, [user]);

  const handleRowClick = (registration: IRegistration) => {
    setSelectedRegistration(registration);
    setIsDrawerOpen(true);
    setCurrentStep("info");
  };

  const handleTooltipOpen = (id: number) => {
    setTooltipOpen((prev) => ({ ...prev, [id]: true }));
  };

  const handleTooltipClose = (id: number) => {
    setTooltipOpen((prev) => ({ ...prev, [id]: false }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(tooltipOpen).forEach((key) => {
        const id = Number(key);
        const tooltipElement = tooltipRefs.current[id];
        if (tooltipElement && !tooltipElement.contains(event.target as Node)) {
          handleTooltipClose(id);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltipOpen]);

  const totalAmount = selectedRegistration
    ? selectedRegistration.registrationLinkPrice.reduce((sum, link) => sum + link.price.value, 0)
    : 0;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);

    } else {
      alert('Пожалуйста, загрузите изображение.');
    }
  };

  const changeRequestStatus = useCallback(async () => {

    const formData = new FormData();
    formData.append('fileUpload', uploadedFile!);

    const response = await apiClient.post(`/payment-check/${selectedRegistration!.id}/${paymentMethod}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 200) {
      setRegistrationList((prevList) =>
        prevList.map((reg) =>
          reg.id === selectedRegistration!.id
            ? { ...reg, registrationStatusId: RegistrationStatusEnum["На проверке"] }
            : reg
        )
      );
    }
  }, [uploadedFile]);

  return (
    <div className="py-6">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <Table className="bg-white border shadow-md border-transparent">
          <TableHeader>
            <TableRow className="bg-blue-100 !border-none">
              <TableHead className="py-3 px-4 font-bold text-center text-[16px] rounded-s-[40px]">Статус</TableHead>
              <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Лагеря</TableHead>
              <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Фамилия</TableHead>
              <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Имя</TableHead>
              <TableHead className="py-3 px-4 font-bold text-center text-[16px] text-nowrap">Дата регистрации</TableHead>
              <TableHead className="py-3 px-4 font-bold text-center text-[16px] text-nowrap rounded-e-[40px]">Сумма</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrationList.map((registration) => (
              <TableRow
                key={registration.id}
                className="border-b hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => handleRowClick(registration)}
              >
                <TableCell className="text-center flex justify-center">
                  <Tooltip
                    open={tooltipOpen[registration.id] || false}
                    onClose={() => handleTooltipClose(registration.id)}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={registration.registrationStatus.name}
                    arrow
                  >
                    <div
                      ref={(el: HTMLDivElement | null) => (tooltipRefs.current[registration.id] = el)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTooltipOpen(registration.id);
                      }}
                    >
                      {getStatusIcon(registration.registrationStatusId)}
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell className="py-2 px-4 text-nowrap text-left">
                  {registration.registrationLinkPrice.map((link, index) => (
                    <div key={index}>{++index}. {link.price.camp.name}</div>
                  ))}
                </TableCell>
                <TableCell className="py-2 px-4 text-nowrap">{registration.lastName}</TableCell>
                <TableCell className="py-2 px-4 text-nowrap">{registration.name}</TableCell>
                <TableCell className="py-2 px-4 text-nowrap">
                  {dayjs(registration.registrationDate).format('D MMMM YYYY')}
                </TableCell>
                <TableCell className="py-2 px-4 text-nowrap">
                  {registration.registrationLinkPrice.reduce((sum, link) => sum + link.price.value, 0)}₽
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AnimatePresence>
          {isDrawerOpen && (
            <>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="h-[100vh] overflow-y-auto fixed top-0 right-0 w-full bg-white shadow-lg z-50 p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <Button onClick={() => setIsDrawerOpen(false)} variant={'outline'} className="!h-12 !min-w-0 rounded-full !bg-black">
                    <IoChevronBack />
                  </Button>
                  <h2 className="text-xl font-bold">Информация о заявке</h2>
                </div>

                {selectedRegistration && <AnimatePresence mode="wait">
                  {currentStep === "info" ? (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 text-left pb-24"
                    >
                      {selectedRegistration!.registrationStatusId === RegistrationStatusEnum["Ожидает оплаты"] && (
                        <div className="bg-yellow-100 p-4 rounded-2xl">
                          <p className="text-yellow-800 font-semibold">Ожидает оплаты</p>
                          <Typography variant="body1" className="text-yellow-800 mt-2">
                            Для завершения регистрации необходимо произвести оплату. Выберите удобный способ оплаты ниже.
                          </Typography>
                        </div>
                      )}

                      {selectedRegistration!.registrationStatusId === RegistrationStatusEnum["На проверке"] && (
                        <div className="bg-blue-100 p-6 rounded-2xl shadow-md">
                          <Typography variant="h6" className="!font-semibold !mb-3 text-gray-800">
                            Ваша заявка на проверке
                          </Typography>
                          <Typography variant="body1" className="text-gray-600">
                            Вашу заявку проверяет администратор: <span className="!font-semibold text-gray-900">{admin?.bankCardOwner}</span>.
                          </Typography>
                          <Typography variant="body1" className="text-gray-600 !mt-2">
                            Проверка займет несколько дней. Спасибо за ожидание!
                          </Typography>
                          <Typography variant="body1" className="text-gray-600 !mt-2">
                            Если у вас есть вопросы, свяжитесь с администратором по телефону: <br /><span className="!font-semibold text-gray-900">{admin?.phoneNumber}</span>.
                          </Typography>
                        </div>
                      )}

                      {selectedRegistration!.registrationStatusId === RegistrationStatusEnum.Оплачено && (
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                          <Typography variant="h6" className="!font-semibold !mb-3 text-gray-800">
                            Оплата успешно завершена
                          </Typography>
                          <Typography variant="body1" className="text-gray-600">
                            Мы ждем вас в наших лагерях! Все оплачено, и ваша заявка подтверждена.
                          </Typography>
                          <Typography variant="body1" className="text-gray-600 !mt-2">
                            Если у вас есть вопросы, свяжитесь с администратором по телефону: <span className="!font-semibold text-gray-900">{admin?.phoneNumber}</span>.
                          </Typography>
                        </div>
                      )}

                      {selectedRegistration!.registrationStatusId === RegistrationStatusEnum.Отклонено && (
                        <div className="bg-red-100 p-6 rounded-2xl shadow-md">
                          <Typography variant="h6" className="!font-semibold !mb-3 text-red-800">
                            Заявка отклонена
                          </Typography>
                          <Typography variant="body1" className="text-red-800">
                            К сожалению, ваша заявка была отклонена администратором.
                          </Typography>
                          <Typography variant="body1" className="text-red-800 !mt-2">
                            Пожалуйста, свяжитесь с администратором для уточнения деталей: <span className="!font-semibold text-red-900">{admin?.phoneNumber}</span>.
                          </Typography>
                        </div>
                      )}

                      {/* Остальная информация о заявке */}
                      <div>
                        <div className='text-[18px]'><strong>Фамилия:</strong> {selectedRegistration!.lastName}</div>
                        <div className='text-[18px]'><strong>Имя:</strong> {selectedRegistration!.name}</div>
                        <div className='text-[18px]'><strong>Дата рождения:</strong> {dayjs(selectedRegistration!.birthdate).format('D MMMM YYYY')}</div>
                        <div className='text-[18px]'><strong>Город:</strong> {selectedRegistration!.city}</div>
                        <div className='text-[18px]'><strong>Дата регистрации:</strong> {dayjs(selectedRegistration!.registrationDate).format('D MMMM YYYY, HH:mm')}</div>
                        <div className='text-[18px]'><strong>Статус:</strong> {selectedRegistration!.registrationStatus.name}</div>
                        <div className='text-[18px]'><strong>Лагеря:</strong></div>
                        <ul>
                          {selectedRegistration!.registrationLinkPrice.map((link, index) => (
                            <li key={index} className='text-[18px]'>
                              🏕️ {link.price.camp.name}: {link.price.value}₽
                            </li>
                          ))}
                        </ul>

                        <div className='text-blue-500 font-bold mt-3'>ИТОГО: {totalAmount}₽</div>
                      </div>

                      {/* Просмотр чека оплаты */}
                      <PhotoProvider>
                        {renderPaymentCheck(selectedRegistration!.paymentCheck as any)}
                      </PhotoProvider>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 text-left pb-24"
                    >
                      {/* Шаг оплаты (только для статуса "Ожидает оплаты") */}
                      {selectedRegistration!.registrationStatusId === RegistrationStatusEnum["Ожидает оплаты"] && (
                        <>
                          <div className="bg-white p-6 rounded-2xl shadow-md">
                            <Typography variant="h6" className="!font-semibold !mb-3 text-gray-800">
                              Выберите способ оплаты
                            </Typography>
                            <div className="space-y-3">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="paymentMethod"
                                  value="cash"
                                  checked={paymentMethod === PaymentTypeEnum.Cash}
                                  onChange={() => setPaymentMethod(PaymentTypeEnum.Cash)}
                                  className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="text-gray-700">Наличные</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="paymentMethod"
                                  value="card"
                                  checked={paymentMethod === PaymentTypeEnum.Card}
                                  onChange={() => setPaymentMethod(PaymentTypeEnum.Card)}
                                  className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="text-gray-700">Карта</span>
                              </label>
                            </div>
                          </div>

                          {paymentMethod === PaymentTypeEnum.Cash && (
                            <div className="bg-white p-6 rounded-2xl shadow-md">
                              <Typography variant="h6" className="!font-semibold !mb-3 text-gray-800">
                                Способ оплаты: Наличные
                              </Typography>
                              <Typography variant="body1" className="text-gray-600">
                                Передайте <span className="!font-semibold text-gray-900">{totalAmount}₽</span> администратору.
                              </Typography>
                              <Typography variant="body1" className="text-gray-600 !mt-2">
                                Получатель: <span className="!font-semibold text-gray-900">{admin?.bankCardOwner}</span>
                              </Typography>
                              <Typography variant="body1" className="text-gray-600 !mt-2">
                                Контактный телефон: <span className="!font-semibold text-gray-900">{admin?.phoneNumber}</span>
                              </Typography>
                            </div>
                          )}

                          {paymentMethod === PaymentTypeEnum.Card && (
                            <div className="bg-white p-6 rounded-2xl shadow-md">
                              <Typography variant="h6" className="!font-semibold !mb-3 text-gray-800">
                                Способ оплаты: Карта
                              </Typography>
                              <Typography variant="body1" className="text-gray-600">
                                Переведите <span className="!font-semibold text-gray-900">{totalAmount}₽</span> на карту.
                              </Typography>
                              <Typography variant="body1" className="text-gray-600 !mt-2">
                                Номер карты: <span className="!font-semibold text-gray-900">{admin?.bankCardNumber}</span>
                              </Typography>
                              <Typography variant="body1" className="text-gray-600 !mt-2">
                                Владелец карты: <span className="!font-semibold text-gray-900">{admin?.bankCardOwner}</span>
                              </Typography>
                              <Typography variant="body1" className="text-gray-600 !mt-2">
                                Банк: <span className="!font-semibold text-gray-900">{admin?.bankName}</span>
                              </Typography>

                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Прикрепите скриншот оплаты:
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Итоговая сумма */}
                      <div className="bg-gray-100 p-6 rounded-2xl shadow-sm">
                        <Typography variant="h6" className="!font-semibold !mb-2 !text-blue-500">
                          Итоговая сумма
                        </Typography>
                        <Typography variant="body1" className="!text-2xl !font-bold !text-blue-500">
                          {totalAmount}₽
                        </Typography>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>}

                <div className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t">
                  <div className="flex gap-4">
                    {currentStep === "info" ? (
                      <>
                        {selectedRegistration!.registrationStatusId === RegistrationStatusEnum["Ожидает оплаты"] && (
                          <Button
                            onClick={() => setCurrentStep("payment")}
                            className="flex-1 bg-blue-500 text-white"
                          >
                            Оплата
                          </Button>
                        )}
                        <Button
                          onClick={() => setIsDrawerOpen(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Закрыть
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => setCurrentStep("info")}
                          variant="outline"
                          className="flex-1"
                        >
                          Назад
                        </Button>
                        {selectedRegistration!.registrationStatusId === RegistrationStatusEnum["Ожидает оплаты"] && paymentMethod === PaymentTypeEnum.Card && (
                          <Button
                            onClick={async () => {
                              console.log("Отправлено на проверку");
                              setIsDrawerOpen(false);
                              await changeRequestStatus();

                            }}
                            variant={"outline"}
                            className="flex-1 bg-blue-500 text-white"
                            disabled={!uploadedFile}
                          >
                            Отправить на проверку
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};