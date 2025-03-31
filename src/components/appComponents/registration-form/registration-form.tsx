import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Typography,
  Box,
  Tooltip,
  IconButton,
  ClickAwayListener,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop
} from "@mui/material";
import { CiCircleInfo } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react";
// @ts-ignore
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import 'dayjs/locale/ru';
import { IChurch } from '@/models/IChurch';
import { ICamp } from '@/models/ICamp';
import { IPrice } from '@/models/IPrice';
import { IPaymentType } from '@/models/IPaymentType';
import { PersonalInfoStep } from './PersonalInfoStep';
import { ChurchStep } from './ChurchStep';
import { CampSelectionStep } from './CampSelectionStep';
import { ReviewStep } from './ReviewStep';
import { PaymentStep } from './PaymentStep';
import { IRegistrationForm } from '@/models/IRegistrationForm';
import { registrationSchema } from '@/constants';
import { ICreateRegistration } from '@/models/dto/ICreateRegistration';
import { IAdmin } from '@/models/IAdmin';
import apiClient from '@/axios';
import { Conclusion } from './Сonclusion';
import { PaymentTypeEnum } from '@/models/enums/PaymentTypeEnum';
import { useUserStore } from '@/stores/UserStore';
import { IoMdClose } from "react-icons/io";
import { ZodType } from 'zod';
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { useDebounce } from '@/hooks/useDebounce';
import { CampEnum } from '@/models/enums/CampEnum';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);


const steps = ["О себе", "Церковь", "Отдых", "Обзор", "Оплата", ''];

export const RegistrationForm = () => {
  const { user } = useUserStore();

  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState<number | null>(null);
  const [selectedCamps, setSelectedCamps] = useState<ICamp[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<number>(PaymentTypeEnum.Cash);
  const [isCopied, setIsCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [churchesList, setChurchesList] = useState<IChurch[]>([]);
  const [campList, setCampList] = useState<ICamp[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<IPaymentType[]>([])

  const [admin, setAdmin] = useState<IAdmin>()

  const getCurrentPrice = (prices: IPrice[]): IPrice | null => {
    const now = new Date();
    for (const price of prices) {
      const startDate = new Date(price.startDate);
      const endDate = new Date(price.endDate);
      if (now >= startDate && now <= endDate) {
        return price;
      }
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      var response = await apiClient.get(`/churches`);

      setChurchesList(response.data as IChurch[])
    })()
  }, [])

  useEffect(() => {
    (async () => {
      var response = await apiClient.get(`/camps`);

      setCampList(response.data as ICamp[])
    })()
  }, [])

  useEffect(() => {
    (async () => {
      var response = await apiClient.get(`/dictionaries/paymentType`);

      setPaymentTypes(response.data as IPaymentType[])
    })()
  }, [])

  const form = useForm<IRegistrationForm>({
    resolver: zodResolver(registrationSchema as unknown as ZodType<IRegistrationForm>),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      phone: "",
      city: "",
      church: undefined
    },
    mode: "onChange"
  });

  const debounceLastName = useDebounce(form.watch('lastName'));
  const debounceDateOfBirth = useDebounce(form.watch('dateOfBirth'));

  const [existedRegistrationData, setExistedRegistrationData] = useState<number[]>([]);

  useEffect(() => {
    const dob = form.getValues("dateOfBirth");
    if (dob) {
      const today = new Date();
      let calculatedAge = today.getFullYear() - dob.getFullYear();
      const monthDifference = today.getMonth() - dob.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--;
      }

      setAge(calculatedAge);
    }
  }, [form.watch('dateOfBirth')]);

  const [age, setAge] = useState(0);

  const [isRuleTooltipOpen, setRuleIsTooltipOpen] = useState<boolean>(false);
  const [isExistedCampRegistrationTooltipOpen, setIsExistedCampRegistrationTooltipOpen] = useState<boolean>(false)

  const handleRuleTooltipClose = () => {
    setRuleIsTooltipOpen(false);
  };

  const handleRuleTooltipOpen = () => {
    setRuleIsTooltipOpen(true);
  };

  const handleExistedCampRegistrationTooltipOpenClose = () => {
    setIsExistedCampRegistrationTooltipOpen(false);
  };

  const handleExistedCampRegistrationTooltipOpenOpen = () => {
    setIsExistedCampRegistrationTooltipOpen(true);
  };

  const validateAgeForCamp = (camp: ICamp, ageAtCampStart: number): boolean => {
    let isValid = true;
    let errorMessage = null;
  
    switch (camp.name) {
      case "Детский":
        if (ageAtCampStart < 6 || ageAtCampStart > 12) {
          errorMessage = `Недопустимый возраст для детского лагеря (только от 6 до 12 лет)`;
          isValid = false;
        } else if (ageAtCampStart === 6) {
          errorMessage = "Для возраста 6 лет требуется сопровождение бабушки или тети";
        }
        break;
      case "Подростковый":
        if (ageAtCampStart < 12 || ageAtCampStart > 16) {
          errorMessage = `Недопустимый возраст для подросткового лагеря (только от 12 до 16 лет)`;
          isValid = false;
        } else if (ageAtCampStart === 12
          && !selectedCamps.some((c) => c.name === "Детский")
          && !existedRegistrationData.some(r => r === CampEnum.Детский)) {
          errorMessage = "В 12 лет можно ехать в подростковый лагерь только при регистрации в детский";
          isValid = false;
        }
        break;
      case "Молодежный":
        if (ageAtCampStart === 15
          && !selectedCamps.some((c) => c.name === "Подростковый")
          && !existedRegistrationData.some(r => r === CampEnum.Подростковый)
        ) {
          errorMessage = "В 15 лет можно ехать в молодежный лагерь только при регистрации в подростковый";
          isValid = false;
        }
  
        if (ageAtCampStart < 15) {
          errorMessage = `Недопустимый возраст для молодежного лагеря (только от 15 лет)`;
          isValid = false;
        }
        break;
      default:
        break;
    }
  
    if (errorMessage) {
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  
    return isValid;
  };

  const toggleCamp = (camp: ICamp) => {
    const birthDate = form.getValues('dateOfBirth');
    if (!birthDate) {
      setSnackbarMessage("Пожалуйста, сначала укажите дату рождения");
      setSnackbarOpen(true);
      return;
    }
  
    const campStartDate = new Date(camp.startDate);
    const ageAtCampStart = calculateAge(birthDate, campStartDate);
  
    if (validateAgeForCamp(camp, ageAtCampStart)) {
      setSelectedCamps((prev) => {
        let newCamps = prev.includes(camp)
          ? prev.filter((c) => c !== camp)
          : [...prev, camp];
  
        if ((ageAtCampStart === 12 || ageAtCampStart === 11) && camp.name === "Детский" && !newCamps.includes(camp)) {
          const teenCamp = campList.find((c) => c.name === "Подростковый");
          if (teenCamp) {
            newCamps = newCamps.filter((c) => c.id !== teenCamp.id);
          }
        }

        if ((ageAtCampStart === 15 || ageAtCampStart === 14) && camp.name === "Подростковый" && !newCamps.includes(camp)) {
          const youthCamp = campList.find((c) => c.name === "Молодежный");
          if (youthCamp) {
            newCamps = newCamps.filter((c) => c.id !== youthCamp.id);
          }
        }
  
        return newCamps;
      });
    }
  };
  
  const calculateAge = (birthDate: Date, targetDate: Date) => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    
    let age = target.getFullYear() - birth.getFullYear();
    const monthDiff = target.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && target.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleCopyCardNumber = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

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
      setFile(file);
      setErrorMessage(null);
    } else {
      setErrorMessage("Пожалуйста, загрузите изображение.");
    }
  };

  const onSubmit = async () => {
    console.log({ ...form.getValues(), selectedCamps, paymentMethod, file });


    form.reset();
    form.clearErrors();
    setSelectedCamps([]);
    setStep(0);
    onClose();
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  const createRegistrationAsync = useCallback(async () => {
    setIsLoading(true);
    try {
      const formValues = form.getValues();
      const priceList = selectedCamps.map((camp) => {
        const currentPrice = getCurrentPrice(camp.prices);
        if (!currentPrice) {
          throw new Error(`Цена для летнего отдыха ${camp.name} не найдена.`);
        }
        return currentPrice.id as number;
      });

      const body: ICreateRegistration = {
        name: formValues.firstName,
        lastName: formValues.lastName,
        birthdate: formValues.dateOfBirth,
        city: formValues.city,
        registrationDate: new Date(),
        priceIds: priceList,
        userId: user ? user.id : 0,
        churchId: formValues.church
      };

      const response = await apiClient.post(`/registrations`, body);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        setSnackbarMessage('Места на выбранные виды отдыха уже закончились, выберите лагеря заново');
        setSnackbarOpen(true);
        setSelectedCamps([]);
        setStep(2);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [form, selectedCamps, paymentMethod, getCurrentPrice]);


  const getAdminAsync = useCallback(async (adminId: number) => {
    const response = await apiClient.get(`/admins/${adminId}`);

    setAdmin(response.data as IAdmin)
  }, [])

  const [registration, setRegistration] = useState<any>();

  const handleNextStep = async () => {
    let isValid = false;

    if (step === 0) {
      isValid = await form.trigger(["firstName", "lastName", "dateOfBirth", "phone", 'city']);
    } else if (step === 1) {
      isValid = await form.trigger(["church"]);
    } else if (step === 2) {
      isValid = selectedCamps.length > 0;
    } else if (step === 3) {
      isValid = true;

      const registration = await createRegistrationAsync();

      setRegistration(registration);

      getAdminAsync(registration.adminId)

    } else if (step === 4) {
      if (paymentMethod === PaymentTypeEnum.Card) {
        isValid = !!file;
      } else {
        isValid = true;
      }
    }
    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
      console.log("Ошибки валидации:", form.formState.errors);
    }
  };


  const uploadFile = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('fileUpload', file);

      const response = await apiClient.post(
        `/payment-check/${registration!.id}/${paymentMethod}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      handleNextStep();
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onFinishHandler = () => {
    form.reset();
    form.clearErrors();
    setSelectedCamps([]);
    setFile(null);
    setStep(0);
    onClose();
  }

  useEffect(() => {
    const fetchExistedRegistrations = async () => {
      if (!debounceLastName || !debounceDateOfBirth) return;

      try {
        const formattedDate = dayjs(debounceDateOfBirth)
          .utc()
          .format('YYYY-MM-DD HH:mm:ss.SSS');

        const encodedDate = encodeURIComponent(formattedDate);

        const response = await apiClient.get(
          `/camps/${debounceLastName}/${encodedDate}`
        );

        setExistedRegistrationData(response.data);
      } catch (err) {
        console.error('Error checking existed registrations:', err);
      };
    }

    fetchExistedRegistrations();
  }, [debounceLastName, debounceDateOfBirth]);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="contained" sx={{ p: 2 }}>
        Начать регистрацию
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className='h-[100vh] overflow-x-auto'
            style={{ position: "fixed", top: 0, left: 0, width: "100%", backgroundColor: "white", padding: 24 }}
          >
            {step !== steps.length - 1 && <Box display="flex" justifyContent="space-between" alignItems="center" className="py-3 px-1">
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6">{steps[step]}</Typography>
                <ClickAwayListener onClickAway={handleRuleTooltipClose}>
                  <Tooltip
                    onClick={handleRuleTooltipOpen}
                    onClose={handleRuleTooltipClose}
                    open={isRuleTooltipOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={<>
                      • Детский: от 7 до 12 лет (6 лет с сопровождением) <br />
                      • Подростковый: от 13 до 16 лет (12 лет только с регистрацией в детский) <br />
                      • Молодежный: от 16 лет (15 лет только с регистрацией в подростковый)</>}
                    arrow
                  >
                    <IconButton>
                      <CiCircleInfo className="text-gray-500" size={30} />
                    </IconButton>
                  </Tooltip>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={handleExistedCampRegistrationTooltipOpenClose}>
                  <Tooltip
                    onClick={handleExistedCampRegistrationTooltipOpenOpen}
                    onClose={handleExistedCampRegistrationTooltipOpenClose}
                    open={isExistedCampRegistrationTooltipOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={
                      existedRegistrationData.length > 0
                        ? `Вы уже зарегистрированы на ${existedRegistrationData.map(r => CampEnum[r]).join(', ')}`
                        : 'Нет активных регистраций'
                    }
                    arrow
                  >
                    <IconButton>
                      {existedRegistrationData.length > 0 ? (
                        <motion.div
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.9, 1.1, 0.9],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <HiOutlineViewfinderCircle className="text-red-500" size={30} />
                        </motion.div>
                      ) : (
                        <HiOutlineViewfinderCircle className="text-gray-400" size={30} />
                      )}
                    </IconButton>
                  </Tooltip>
                </ClickAwayListener>
              </Box>
              <Button onClick={onClose} variant="contained" className="!h-12 !min-w-0 rounded-full !bg-black">
                <IoMdClose />
              </Button>
            </Box>}

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 overflow-x-scroll pt-5">
              {step === 0 && <PersonalInfoStep form={form} />}

              {step === 1 && (
                <ChurchStep
                  form={form}
                  churchesList={churchesList}
                  setSelectedChurch={setSelectedChurch}
                />
              )}

              {step === 2 && (
                <CampSelectionStep
                  campList={campList}
                  selectedCamps={selectedCamps}
                  toggleCamp={toggleCamp}
                  getCurrentPrice={getCurrentPrice}
                  birthDate={form.getValues('dateOfBirth')}
                  existedRegistrationData={existedRegistrationData}
                />
              )}

              {step === 3 && (
                <ReviewStep
                  form={form}
                  selectedCamps={selectedCamps}
                  getCurrentPrice={getCurrentPrice}
                  // age={age}
                />
              )}

              {step === 4 && (
                <PaymentStep
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  paymentTypes={paymentTypes}
                  selectedCamps={selectedCamps}
                  getCurrentPrice={getCurrentPrice}
                  handleCopyCardNumber={() => handleCopyCardNumber(admin?.bankCardNumber!)}
                  handleFileUpload={handleFileUpload}
                  file={file}
                  admin={admin!}
                  errorMessage={errorMessage}
                  selectedChurch={selectedChurch}
                  age={age}
                />
              )}

              {step === 5 && <Conclusion onClose={onFinishHandler} paymentMethod={paymentMethod} />}

              <Box display="flex" justifyContent="space-between" mt={4}>
                {step > 0 && step <= 3 && (
                  <Button onClick={() => setStep(step - 1)} variant="outlined">
                    Назад
                  </Button>
                )}
                {step < steps.length - 2 ? (
                  <Button onClick={handleNextStep} variant="contained">
                    Далее
                  </Button>
                ) : (step !== steps.length - 1 && paymentMethod !== PaymentTypeEnum.Cash &&
                  <Button variant="contained" onClick={() => uploadFile(file!)} disabled={!!errorMessage || file === null}>
                    Отправить
                  </Button>
                )}
                {step === steps.length - 2 && paymentMethod === PaymentTypeEnum.Cash && <Button variant="contained" onClick={() => handleNextStep()}>Завершить</Button>}
              </Box>
            </form>

            <Snackbar
              open={isCopied}
              autoHideDuration={2000}
              onClose={() => setIsCopied(false)}
            >
              <Alert severity="success" onClose={() => setIsCopied(false)}>
                Номер карты скопирован!
              </Alert>
            </Snackbar>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                {snackbarMessage}
              </Alert>
            </Snackbar>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}