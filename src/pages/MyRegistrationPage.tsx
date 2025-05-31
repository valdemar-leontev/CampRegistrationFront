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
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';
import { RegistrationStatusEnum } from '@/models/enums/RegistrationStatusEnum';
import { IoChevronBack } from "react-icons/io5";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { IAdmin } from '@/models/IAdmin';
import { PaymentTypeEnum } from '@/models/enums/PaymentTypeEnum';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { FaRegSadTear } from 'react-icons/fa';
import { RegistrationForm } from '@/components/appComponents/registration-form/registration-form';
import { ChurchEnum } from '@/models/enums/ChurchEnum';


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
  totalSum: number;
  churchId: number;
  registrationLinkPrice: {
    value: number;
    campName: string;
    discountCoefficient: number;
  }[];
  paymentType: {
    name: string;
  };
  registrationStatus: {
    name: string;
  };
  phone: string;
  isMedicalWorker: boolean;
  isOrganizer: boolean;
  church: { name: string; }
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
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    (async () => {
      setIsLoading(true)
      if (!selectedRegistration) return;

      const response = await apiClient.get<IAdmin>(`/admins/${selectedRegistration!.adminId}`);
      setAdmin(response.data);
      setTimeout(() => setIsLoading(false), 500);
    })();
  }, [selectedRegistration]);


  const [currentStep, setCurrentStep] = useState<"info" | "payment">("info");

  const [paymentMethod, setPaymentMethod] = useState<PaymentTypeEnum | null>(PaymentTypeEnum.Cash);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { user } = useUserStore();
  const [registrationList, setRegistrationList] = useState<IRegistration[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get<IRegistration[]>(`users/${user!.id}/registrations`);
        setRegistrationList(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    })();
  }, [user]);

  const [currentPaymentCheck, setCurrentPaymentCheck] = useState<string>();

  useEffect(() => {
    (async () => {
      if (!selectedRegistration?.id) return;

      try {
        setIsLoading(true)

        const response = await apiClient.get<string>(`payment-check/registration/${selectedRegistration.id}`, { responseType: 'blob' });

        setCurrentPaymentCheck(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке payment check:", error);
        setCurrentPaymentCheck(undefined);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    })();
  }, [selectedRegistration]);

  const handleRowClick = (registration: IRegistration) => {
    setSelectedRegistration(registration);
    setIsDrawerOpen(true);
    setCurrentStep("info");
  };

  const totalSum = useMemo(() => {
    return selectedRegistration?.totalSum
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


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return registrationList.slice(startIndex, startIndex + itemsPerPage);
  }, [registrationList, currentPage]);

  const totalPages = Math.ceil(registrationList.length / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    registrationList && <div className="relative">
      <Typography className="!font-bold !text-2xl !mb-2">
        Мои регистрации
      </Typography>

      {registrationList.length > 0 ? (
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
                <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Фамилия</TableHead>
                <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Имя</TableHead>
                <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Отдых</TableHead>
                <TableHead className="py-3 px-4 font-bold text-center text-[16px] text-nowrap">Дата регистрации</TableHead>
                <TableHead className="py-3 px-4 font-bold text-center text-[16px] text-nowrap rounded-e-[40px]">Сумма</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((registration) => (
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
                  <TableCell className="py-2 px-4 text-nowrap">{registration.lastName}</TableCell>
                  <TableCell className="py-2 px-4 text-nowrap">{registration.name}</TableCell>
                  <TableCell className="py-2 px-4 text-nowrap text-left">
                    {registration.registrationLinkPrice.map((link, index) => (
                      <div key={index}>{++index}. {link.campName}</div>
                    ))}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-nowrap">
                    {dayjs(registration.registrationDate).format('D MMMM YYYY')}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-nowrap">
                    {registration.registrationLinkPrice.some(p => p.discountCoefficient !== 1) ? (
                      <div className="flex flex-col">
                        <div className="text-green-600 font-semibold">
                          {registration.totalSum} ₽
                        </div>
                        <div className="text-xs text-gray-500 mt-[-2px]">
                          Со скидкой
                        </div>
                      </div>
                    ) : (
                      <span>
                        {registration.registrationLinkPrice.reduce((sum, link) => sum + link.value, 0)}₽
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPrevPage();
                      }}
                      isActive={currentPage === 1}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(1);
                      }}
                      isActive={1 === currentPage}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>

                  {currentPage > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {currentPage > 1 && currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(currentPage);
                        }}
                        isActive
                      >
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {totalPages > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(totalPages);
                        }}
                        isActive={totalPages === currentPage}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToNextPage();
                      }}
                      isActive={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

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
                            <br />
                            <Typography variant="body1" className="text-yellow-800 mt-2 !font-bold">
                              Ваша заявка удалится в течении 7 дней автоматически, если оплата не поступила.
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
                              Мы ждем вас на нашем летнем отдыхе! Все оплачено, и ваша заявка подтверждена.
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
                          <div className='text-[18px]'><strong>Телефон:</strong> {selectedRegistration!.phone}</div>
                          <div className='text-[18px]'><strong>Дата регистрации:</strong> {dayjs(selectedRegistration!.registrationDate).format('D MMMM YYYY, HH:mm')}</div>
                          <div className='text-[18px]'><strong>Статус:</strong> {selectedRegistration!.registrationStatus.name}</div>
                          <div className='text-[18px]'><strong>Церковь:</strong> {selectedRegistration!.church.name}</div>
                          <div className='text-[18px]'><strong>Летний отдых:</strong></div>
                          {selectedRegistration!.isMedicalWorker ?
                            <div className='text-[18px]'><strong>Обладает мед. знаниями:</strong> Да</div> :
                            <></>
                          }
                          {selectedRegistration!.isOrganizer ?
                            <div className='text-[18px]'><strong>Из команды организаторов:</strong> Да</div> :
                            <></>
                          }
                          <ul>
                            {selectedRegistration!.registrationLinkPrice.map((link, index) => {
                              const campPrice = selectedRegistration.registrationLinkPrice.find(rp => rp.campName === link.campName);
                              const discountCoefficient = campPrice!.discountCoefficient!;
                              const finalPrice = Math.round(link.value * discountCoefficient);

                              return (
                                <li key={index} className='text-[18px] mb-2'>
                                  🏕️ {link.campName}: {' '}
                                  {discountCoefficient < 1 && (
                                    <>
                                      <span className='line-through text-gray-500 mr-1'>
                                        {link.value}₽
                                      </span>
                                      <span className='text-green-600 font-semibold mr-2'>
                                        {finalPrice}₽
                                      </span>
                                      <br />
                                      <span className='text-sm text-green-600'>
                                        {discountCoefficient === 0 ? (
                                          "(до 2 лет бесплатно)"
                                        ) : discountCoefficient === 0.5 ? (
                                          "(возраст 2-6 лет - скидка 50%)"
                                        ) : (
                                          `(скидка ${Math.round((1 - discountCoefficient) * 100)}%)`
                                        )}
                                      </span>
                                    </>
                                  )}
                                  {discountCoefficient === 1 && (
                                    <span>{link.value}₽</span>
                                  )}
                                </li>
                              )
                            })}
                          </ul>

                          <div className='text-blue-500 font-bold mt-3'>
                            ИТОГО:{' '}
                            <span>{totalSum}₽</span>
                          </div>
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
                                    disabled={selectedRegistration.churchId === ChurchEnum.Другая}
                                  />
                                  {selectedRegistration.churchId !== ChurchEnum.Другая ? (
                                    <span className="text-gray-700">Наличные</span>
                                  ) : (
                                    <span className="text-gray-400">Наличные (только для Казанцев)</span>
                                  )}
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === PaymentTypeEnum.Card}
                                    onChange={() => setPaymentMethod(PaymentTypeEnum.Card)}
                                    className="form-radio h-4 w-4 text-blue-600"
                                    disabled={selectedRegistration.churchId !== ChurchEnum.Другая}
                                  />
                                  {selectedRegistration.churchId === ChurchEnum.Другая ? (
                                    <span className="text-gray-700">Карта</span>
                                  ) : (
                                    <span className="text-gray-400">Карта (только для гостей)</span>
                                  )}
                                </label>
                              </div>
                            </div>

                            {paymentMethod === PaymentTypeEnum.Cash && selectedRegistration.churchId !== ChurchEnum.Другая && (
                              <div className="bg-white p-6 rounded-2xl shadow-md">
                                <Typography variant="h6" className="!font-semibold !mb-3 text-gray-800">
                                  Способ оплаты: Наличные
                                </Typography>
                                <Typography variant="body1" className="text-gray-600">
                                  Передайте <span className="!font-semibold text-gray-900">{totalSum!} ₽</span> администратору.
                                </Typography>
                                <Typography variant="body1" className="text-gray-600 !mt-2">
                                  Получатель: <span className="!font-semibold text-gray-900">{admin?.user.firstName} {admin?.user.lastName}</span>
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
                                  Переведите <span className="!font-semibold text-gray-900">{totalSum!}₽</span> на карту.
                                </Typography>
                                <Typography variant="body1" className="text-gray-600 !mt-2">
                                  Номер карты: <span className="!font-semibold text-gray-900">{admin?.bankCardNumber}</span>
                                </Typography>
                                <Typography variant="body1" className="text-gray-600 !mt-2">
                                  Получатель: <span className="!font-semibold text-gray-900">{admin?.bankCardOwner}</span>
                                </Typography>
                                <Typography variant="body1" className="text-gray-600 !mt-2">
                                  Банк: <span className="!font-semibold text-gray-900">{admin?.bankName}</span>
                                </Typography>
                                <Typography variant="body1" className="text-gray-600 !mt-2">
                                  Контактный телефон: <span className="!font-semibold text-gray-900"><br />{admin?.phoneNumber}</span>
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
                            {totalSum!}₽
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
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="bg-blue-50 p-8 rounded-2xl shadow-sm text-center max-w-md">
            <div className="flex justify-center mb-4">
              <FaRegSadTear className="text-5xl text-blue-400" />
            </div>
            <Typography variant="h5" className="!font-bold !mb-3 !text-blue-600">
              У вас пока нет регистраций
            </Typography>
            <Typography variant="body1" className="!text-gray-600 !mb-4">
              Вы ещё не зарегистрировались ни на один из наших летних отдыхов.
            </Typography>
            <RegistrationForm />
          </div>
        </motion.div>)}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: 'fixed',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(3px)'
        }}
        open={isLoading}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <CircularProgress color="inherit" size={60} thickness={4} />
          <Typography variant="h6" color="white">
            Пожалуйста, подождите...
          </Typography>
        </Box>
      </Backdrop>
    </div>
  );
};