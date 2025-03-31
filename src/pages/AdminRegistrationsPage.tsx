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
import dayjs from 'dayjs';
import { Backdrop, Box, CircularProgress, TextField, Typography } from '@mui/material';
import { RegistrationStatusEnum } from '@/models/enums/RegistrationStatusEnum';
import { IoChevronBack } from "react-icons/io5";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText } from '@mui/material';
import { IRegistrationStatus } from '@/models/IRegistrationStatus';
import { ICamp } from '@/models/ICamp';
import { IChurch } from '@/models/IChurch';
import { useUserStore } from '@/stores/UserStore';
import { AccordionItem, AccordionTrigger, AccordionContent, Accordion } from '@radix-ui/react-accordion';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationLink, PaginationNext, PaginationPrevious, PaginationItem } from '@/components/ui/pagination';

interface IAdminRegistration {
  id: number;
  name: string;
  lastName: string;
  birthdate: string;
  city: string;
  registrationDate: string;
  totalSum: number;
  churchId: number;
  userId: number;
  registrationStatusId: number;
  paymentTypeId: number | null;
  registrationLinkPrice: {
    value: number;
    campName: string;
    startDate: Date
    discountCoefficient: number;
  }[];
  registrationStatus: string;
  church: string;
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

export const AdminRegistrationsPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedRegistration, setSelectedRegistration] = useState<IAdminRegistration | null>(null);
  const [statusFilter, setStatusFilter] = useState<number[]>([]);
  const [churchFilter, setChurchFilter] = useState<string[]>([]);
  const [campFilter, setCampFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [registrationList, setRegistrationList] = useState<IAdminRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUserStore();

  const handleRowClick = (registration: IAdminRegistration) => {
    setSelectedRegistration(registration);
    setIsDrawerOpen(true);
  };

  const totalAmount = useMemo(() => {
    return selectedRegistration?.totalSum;
  }, [selectedRegistration]);

  const changeRequestStatus = useCallback(async (status: RegistrationStatusEnum) => {
    if (!selectedRegistration) return;

    setIsLoading(true);
    try {
      const response = await apiClient.put(`/registrations/${selectedRegistration.id}/status/${status}`);

      if (response.status === 200) {
        setRegistrationList((prevList) =>
          prevList.map((reg) =>
            reg.id === selectedRegistration.id
              ? { ...reg, registrationStatusId: status }
              : reg
          )
        );
        setIsDrawerOpen(false);
      }
    } catch (error) {
      console.error("Ошибка при изменении статуса:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [selectedRegistration]);

  const [statusList, setStatusList] = useState<IRegistrationStatus[]>();
  const [churchList, setChurchList] = useState<IChurch[]>();
  const [campList, setCampList] = useState<ICamp[]>();

  const filteredRegistrations = useMemo(() => {
    return registrationList.filter((registration) => {
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(registration.registrationStatusId);
      const matchesChurch = churchFilter.length === 0 || churchFilter.includes(registration.church);
      const matchesCamp = campFilter.length === 0 || registration.registrationLinkPrice.some((link) => campFilter.includes(link.campName));

      const matchesSearch = searchQuery === '' || Object.values(registration).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (Array.isArray(value)) {
          return value.some((item) => item.campName.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return false;
      });

      return matchesStatus && matchesChurch && matchesCamp && matchesSearch;
    });
  }, [registrationList, statusFilter, churchFilter, campFilter, searchQuery]);

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

  const calculateAgeAtCamp = (birthdate: string, targetDate: Date): number => {
    const birth = dayjs(birthdate);
    const target = dayjs(targetDate);

    let age = target.year() - birth.year();

    if (target.month() < birth.month() || (target.month() === birth.month() && target.date() < birth.date())) {
      age--;
    }

    return age;
  }

  const [pendingAction, setPendingAction] = useState<RegistrationStatusEnum | null>(null);

  const handleConfirmAction = () => {
    if (pendingAction && selectedRegistration) {
      changeRequestStatus(pendingAction);
      setPendingAction(null);
    }
  };

  const handleCancelAction = () => {
    setPendingAction(null);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRegistrations, currentPage]);

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);

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

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const [
          registrations,
          statuses,
          churches,
          camps
        ] = await Promise.all([
          apiClient.get<IAdminRegistration[]>(`admins/${user?.id}/registrations`),
          apiClient.get(`/dictionaries/registrationStatus`),
          apiClient.get(`/dictionaries/church`),
          apiClient.get(`/dictionaries/camp`)
        ]);

        setRegistrationList(registrations.data);
        setStatusList(statuses.data as IRegistrationStatus[]);
        setChurchList(churches.data as IChurch[]);
        setCampList(camps.data as ICamp[]);

      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    fetchAllData();
  }, [user?.id]);

  return (
    registrationList && statusList && churchList && campList && <div className="py-6 relative">
      <Typography className="!font-bold !text-2xl !mb-2">
        Управление заявками
      </Typography>

      <Accordion type="single" collapsible>
        <AccordionItem value={'Фильтры'}>
          <AccordionTrigger className='p-3 border mb-3 border-blue-100 rounded-2xl'>Фильтры</AccordionTrigger>
          <AccordionContent>
            <AnimatePresence mode='sync'>

              <motion.div
                className="flex gap-4 mb-6 flex-col"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}>

                <div className="flex gap-4 mb-6 flex-wrap">
                  <TextField
                    label="Поиск"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-auto"
                  />
                  <FormControl variant="outlined" className="w-full md:w-auto">
                    <InputLabel>Статус</InputLabel>
                    <Select
                      label={'Статус'}
                      multiple
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as number[])}
                      renderValue={(selected) => (selected as number[]).map((s) => RegistrationStatusEnum[s]).join(', ')}
                    >
                      {statusList!.map(({ id, name }) => (
                        <MenuItem key={id} value={id}>
                          <Checkbox checked={statusFilter.includes(id)} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined" className="w-full md:w-auto">
                    <InputLabel>Церковь</InputLabel>
                    <Select
                      label={'Церковь'}
                      multiple
                      value={churchFilter}
                      onChange={(e) => setChurchFilter(e.target.value as string[])}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {churchList.map(({ id, name }) => (
                        <MenuItem key={id} value={name}>
                          <Checkbox checked={churchFilter.includes(name)} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined" className="w-full md:w-auto">
                    <InputLabel>Летний отдых</InputLabel>
                    <Select
                      label={'Летний отдых'}
                      multiple
                      value={campFilter}
                      onChange={(e) => setCampFilter(e.target.value as string[])}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {campList.map(({ id, name }) => (
                        <MenuItem key={id} value={name}>
                          <Checkbox checked={campFilter.includes(name)} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </motion.div>
            </AnimatePresence>

          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className='!h-[20vh]'
      >
        <Table className="bg-white border border-transparent !overflow-auto" mainContainerClassName={'!h-[55vh]'}>
          <TableHeader>
            <TableRow className="bg-blue-100 !border-none sticky top-0 z-10">
              <TableHead className="py-3 px-4 font-bold text-center text-[16px] rounded-s-[40px]">Статус</TableHead>
              <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Церковь</TableHead>
              <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Отдых</TableHead>
              <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Фамилия</TableHead>
              <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Имя</TableHead>
              <TableHead className="py-3 px-4 font-bold text-center text-[16px] text-nowrap">Дата регистрации</TableHead>
              <TableHead className="py-3 px-4 font-bold text-center text-[16px] text-nowrap ">Сумма</TableHead>
              <TableHead className="py-3 px-4 font-bold text-center text-[16px] rounded-e-[40px]">Возраст</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData && paginatedData.map((registration) => (
              <TableRow
                key={registration.id}
                className="border-b hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
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
                <TableCell className="py-2 px-4 text-nowrap">{registration.church}</TableCell>
                <TableCell className="py-2 px-4 text-nowrap text-left">
                  {registration.registrationLinkPrice!.map((link, index) => (
                    <div key={index}>{++index}. {link.campName}</div>
                  ))}
                </TableCell>
                <TableCell className="py-2 px-4 text-nowrap">{registration.lastName}</TableCell>
                <TableCell className="py-2 px-4 text-nowrap">{registration.name}</TableCell>
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
                <TableCell className="py-2 px-4 text-nowrap">
                  {registration.registrationLinkPrice.length > 0
                    ? calculateAgeAtCamp(registration.birthdate, registration.registrationLinkPrice[0].startDate)
                    : '—'}
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

                {selectedRegistration && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 text-left pb-24"
                  >
                    <div>
                      <div className='text-[18px]'><strong>Фамилия:</strong> {selectedRegistration!.lastName}</div>
                      <div className='text-[18px]'><strong>Имя:</strong> {selectedRegistration!.name}</div>

                      <div className='text-[18px]'><strong>Возраст на момент отдыха:</strong> {selectedRegistration.registrationLinkPrice.length > 0
                        ? calculateAgeAtCamp(selectedRegistration.birthdate, selectedRegistration.registrationLinkPrice[0].startDate)
                        : '—'}
                      </div>
                      <div className='text-[18px]'><strong>Дата рождения:</strong> {dayjs(selectedRegistration!.birthdate).format('D MMMM YYYY')}</div>
                      <div className='text-[18px]'><strong>Город:</strong> {selectedRegistration!.city}</div>
                      <div className='text-[18px]'><strong>Церковь:</strong> {selectedRegistration!.church}</div>
                      <div className='text-[18px]'><strong>Дата регистрации:</strong> {dayjs(selectedRegistration!.registrationDate).format('D MMMM YYYY, HH:mm')}</div>
                      <div className='text-[18px]'><strong>Статус:</strong> {selectedRegistration!.registrationStatus}</div>
                      <div className='text-[18px]'><strong>Летний отдых:</strong></div>
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
                        <span>{totalAmount}₽</span>
                      </div>
                    </div>

                    <PhotoProvider>
                      {renderPaymentCheck(currentPaymentCheck as any)}
                    </PhotoProvider>

                    {selectedRegistration.registrationStatusId !== RegistrationStatusEnum.Оплачено
                      && selectedRegistration.registrationStatusId !== RegistrationStatusEnum.Отклонено
                      && (
                        <div className="flex gap-4 mt-6 flex-col">
                          <AnimatePresence mode='wait'>
                            {pendingAction ? (
                              <motion.div
                                key="confirmation"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className='flex flex-col w-full'
                              >
                                <div className='text-center'>
                                  Вы уверены, что хотите перевести заявку в состояние <strong>{pendingAction === RegistrationStatusEnum.Оплачено ? "Оплачено" : "Отклонено"}</strong>?
                                </div>
                                <div className='flex gap-4 mt-4'>
                                  <Button
                                    onClick={handleConfirmAction}
                                    variant="outline"
                                    className="flex-1 text-white"
                                  >
                                    Да
                                  </Button>
                                  <Button
                                    onClick={handleCancelAction}
                                    variant="ghost"
                                    className="flex-1 text-white"
                                  >
                                    Нет
                                  </Button>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="actions"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className='flex gap-4 w-full'
                              >
                                <Button
                                  onClick={() => setPendingAction(RegistrationStatusEnum.Оплачено)}
                                  variant="outline"
                                  className="flex-1 text-white"
                                >
                                  Подтвердить
                                </Button>
                                <Button
                                  onClick={() => setPendingAction(RegistrationStatusEnum.Отклонено)}
                                  variant="ghost"
                                  className="flex-1 text-white"
                                >
                                  Отклонить
                                </Button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
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
    </div >
  );
};