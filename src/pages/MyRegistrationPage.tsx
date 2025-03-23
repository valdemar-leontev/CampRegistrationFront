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
import { useCallback, useEffect, useMemo, useState } from 'react';
import apiClient from '@/axios';
import { useUserStore } from '@/stores/UserStore';
import dayjs from 'dayjs';
import { Typography } from '@mui/material';
import { RegistrationStatusEnum } from '@/models/enums/RegistrationStatusEnum';
import { IoChevronBack } from "react-icons/io5";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { IAdmin } from '@/models/IAdmin';
import { PaymentTypeEnum } from '@/models/enums/PaymentTypeEnum';

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
  totalAmount: number;
  registrationLinkPrice: {
    value: number;
    campName: string;
  }[];
  paymentType: {
    name: string;
  };
  registrationStatus: {
    name: string;
  };
}

const renderPaymentCheck = (paymentCheck: string) => {
  if (!paymentCheck) return null;

  const blob = new Blob([paymentCheck], { type: 'image/*' });
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

  const [admin, setAdmin] = useState<IAdmin>();

  useEffect(() => {
    (async () => {
      if (!selectedRegistration) return;

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

  const [currentPaymentCheck, setCurrentPaymentCheck] = useState<string>();

  useEffect(() => {
    (async () => {
      if (!selectedRegistration?.id) return;

      try {
        const response = await apiClient.get<string>(`payment-check/registration/${selectedRegistration.id}`, { responseType: 'blob' });

        setCurrentPaymentCheck(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке payment check:", error);
        setCurrentPaymentCheck(undefined);
      }
    })();
  }, [selectedRegistration]);

  const handleRowClick = (registration: IRegistration) => {
    setSelectedRegistration(registration);
    setIsDrawerOpen(true);
    setCurrentStep("info");
  };

  const totalAmount = useMemo(() => {
    return selectedRegistration?.totalAmount
  }, [selectedRegistration]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 1 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage("Размер файла не должен превышать 1 МБ.");
      return;
    }

    if (file.type.startsWith("image/")) {
      setUploadedFile(file);
      setErrorMessage(null);
    } else {
      setErrorMessage("Пожалуйста, загрузите изображение.");
    }
  };

  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);

  const changeRequestStatus = useCallback(async () => {
    const formData = new FormData();
    formData.append('fileUpload', uploadedFile!);

    const response = await apiClient.post(
      `/payment-check/${selectedRegistration!.id}/${paymentMethod}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 201) {
      setRegistrationList((prevList) =>
        prevList.map((reg) =>
          reg.id === selectedRegistration!.id
            ? {
              ...reg,
              registrationStatusId: RegistrationStatusEnum["На проверке"],
              registrationStatus: {
                ...reg.registrationStatus,
                name: "На проверке",
              },
            }
            : reg
        )
      );

      setHighlightedRowId(selectedRegistration!.id);
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);

      setIsDrawerOpen(false);
    }
  }, [uploadedFile, selectedRegistration, paymentMethod]);

  return (
    registrationList ? <div className="py-6">

      <Typography className="!font-bold !text-4xl !mb-8">
        Мои регистрации
      </Typography>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <Table className="bg-white border border-transparent !overflow-auto !max-h-[50vh]" >
          <TableHeader>
            <TableRow className="bg-blue-100 !border-none sticky top-0 z-10">
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
                className={`border-b hover:bg-gray-50 duration-200 cursor-pointer transition-all ${highlightedRowId === registration.id ? 'bg-blue-100' : ''}`}
                onClick={() => handleRowClick(registration)}
              >
                <TableCell className="text-center flex justify-center flex-col">
                  <div
                    className={`flex flex-col items-center gap-1 p-2 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 ${registration.registrationStatusId === RegistrationStatusEnum["Ожидает оплаты"]
                      ? "bg-gradient-to-br from-yellow-100 to-yellow-200"
                      : registration.registrationStatusId === RegistrationStatusEnum["На проверке"]
                        ? "bg-gradient-to-br from-purple-100 to-purple-200"
                        : registration.registrationStatusId === RegistrationStatusEnum.Оплачено
                          ? "bg-gradient-to-br from-green-100 to-green-200"
                          : registration.registrationStatusId === RegistrationStatusEnum.Отклонено
                            ? "bg-gradient-to-br from-red-100 to-red-200"
                            : "bg-gradient-to-br from-gray-100 to-gray-200"
                      }`}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {RegistrationStatusEnum[registration.registrationStatusId]}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-2 px-4 text-nowrap text-left">
                  {registration.registrationLinkPrice.map((link, index) => (
                    <div key={index}>{++index}. {link.campName}</div>
                  ))}
                </TableCell>
                <TableCell className="py-2 px-4 text-nowrap">{registration.lastName}</TableCell>
                <TableCell className="py-2 px-4 text-nowrap">{registration.name}</TableCell>
                <TableCell className="py-2 px-4 text-nowrap">
                  {dayjs(registration.registrationDate).format('D MMMM YYYY')}
                </TableCell>
                <TableCell className="py-2 px-4 text-nowrap">
                  {registration.registrationLinkPrice.reduce((sum, link) => sum + link.value, 0)}₽
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
                              🏕️ {link.campName}: {link.value}₽
                            </li>
                          ))}
                        </ul>

                        <div className='text-blue-500 font-bold mt-3'>ИТОГО: {totalAmount}₽</div>
                      </div>

                      {currentPaymentCheck && <PhotoProvider>
                        {renderPaymentCheck(currentPaymentCheck as any)}
                      </PhotoProvider>}
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
                                <div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                  />
                                  {errorMessage && (
                                    <div className="text-red-500 mt-2">
                                      {errorMessage}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

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
                              setUploadedFile(null);
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
    </div> : <h1>Loading...</h1>
  );
};