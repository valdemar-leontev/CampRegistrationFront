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
  Snackbar
} from "@mui/material";
import { IoChevronBack } from "react-icons/io5";
import { CiCircleInfo } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react";
// @ts-ignore
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import 'dayjs/locale/ru';
import { IChurch } from '@/models/IChurch';
import { ICamp } from '@/models/ICamp';
import { IPrice } from '@/models/IPrice';
import { IPaymentType } from '@/models/IPaymentType';
import { PaymentTypeEnum } from '@/models/enums/paymentTypeEnum';
import { PersonalInfoStep } from './PersonalInfoStep';
import { ChurchStep } from './ChurchStep';
import { CampSelectionStep } from './CampSelectionStep';
import { ReviewStep } from './ReviewStep';
import { PaymentStep } from './PaymentStep';
import { IRegistrationForm } from '@/models/IRegistrationForm';
import { registrationSchema } from '@/constants';
import { ICreateRegistration } from '@/models/dto/ICreateRegistration';
import { useTabStore } from '@/stores/TabStore';
import { IAdmin } from '@/models/IAdmin';
import apiClient from '@/axios';
import { Conclusion } from './Сonclusion';

const steps = ["Личная информация", "Церковь", "Лагерь", "Обзор", "Оплата", ''];

export const RegistrationForm = () => {
  const { user } = useTabStore();

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
    resolver: zodResolver(registrationSchema),
    defaultValues: { firstName: "", lastName: "", dateOfBirth: undefined, phone: "", church: undefined },
    mode: "onChange",
  });

  const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDifference = today.getMonth() - dateOfBirth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age;
  };

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleTooltipClose = () => {
    setIsTooltipOpen(false);
  };

  const handleTooltipOpen = () => {
    setIsTooltipOpen(true);
  };

  const validateAgeForCamp = (camp: ICamp, age: number): boolean => {
    let isValid = true;
    let errorMessage = null;

    switch (camp.name) {
      case "Детский":
        if (age < 6 || age > 13) {
          errorMessage = "Недопустимый возраст для детского лагеря (только от 6 до 13 лет)";
          isValid = false;
        } else if (age === 6) {
          errorMessage = "Для возраста 6 лет требуется сопровождение бабушки или тети";
        }
        break;
      case "Подростковый":
        if (age < 12 || age > 16) {
          errorMessage = "Недопустимый возраст для подросткового лагеря (только от 12 до 16 лет)";
          isValid = false;
        } else if (age === 12 && !selectedCamps.some((c) => c.name === "Детский")) {
          errorMessage = "В таком возрасте ехать в подростковый можно, если ты будешь в детском лагере";
          isValid = false;
        }
        break;
      case "Молодежный":
        if (age < 16) {
          errorMessage = "Нельзя ехать в молодежный лагерь в 15 лет, если ты не будешь в подростковом";
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
    const age = calculateAge(form.getValues("dateOfBirth"));
    if (validateAgeForCamp(camp, age)) {
      setSelectedCamps((prev) => (prev.includes(camp) ? prev.filter((c) => c !== camp) : [...prev, camp]));
    }
  };

  const handleCopyCardNumber = () => {
    const cardNumber = "1234 5678 9012 3456";
    navigator.clipboard.writeText(cardNumber).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const onSubmit = () => {
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

  const createRegistrationAsync = useCallback(async () => {
    const formValues = form.getValues();

    const priceList = selectedCamps.map((camp) => {
      const currentPrice = getCurrentPrice(camp.prices);
      if (!currentPrice) {
        throw new Error(`Цена для лагеря ${camp.name} не найдена.`);
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
      userId: user ? user.id : 1,
      churchId: formValues.church
    }

    try {
      const response = await apiClient.post(`/registrations`, body);

      return response.data;
    } catch (error) {
      console.error("Ошибка при создании регистрации:", error);
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
      if (selectedChurch === 0) {
        isValid = isValid && (await form.trigger(["otherChurchName", "otherChurchAddress"]));
      }
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
    const formData = new FormData();
    formData.append('fileUpload', file);

    try {
      const response = await apiClient.post(
        `/payment-check/${registration!.id}/${paymentMethod}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Файл успешно загружен:', response.data);

      handleNextStep()

      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      throw error;
    }
  };

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
            {step !== steps.length - 1 && <Box display="flex" justifyContent="space-between" alignItems="center" className="py-3">
              <Button onClick={onClose} variant="contained" className="!h-12 !min-w-0 rounded-full !bg-black">
                <IoChevronBack />
              </Button>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6">{steps[step]}</Typography>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <Tooltip
                    onClick={handleTooltipOpen}
                    onClose={handleTooltipClose}
                    open={isTooltipOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={<>
                      • Детский: 7-13 лет (6 лет с сопровождением) <br />
                      • Подростковый: 13-16 лет (12 лет только с регистрацией в детский) <br />
                      • Молодежный: от 16 лет (15 лет только с регистрацией в подростковый)</>}
                    arrow
                  >
                    <IconButton>
                      <CiCircleInfo className="text-gray-500" />
                    </IconButton>
                  </Tooltip>
                </ClickAwayListener>
              </Box>
            </Box>}


            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 overflow-x-scroll pt-5">
              {step === 0 && <PersonalInfoStep form={form} />}

              {step === 1 && (
                <ChurchStep
                  form={form}
                  churchesList={churchesList}
                  selectedChurch={selectedChurch}
                  setSelectedChurch={setSelectedChurch}
                />
              )}

              {step === 2 && (
                <CampSelectionStep
                  campList={campList}
                  selectedCamps={selectedCamps}
                  toggleCamp={toggleCamp}
                  getCurrentPrice={getCurrentPrice}
                />
              )}

              {step === 3 && (
                <ReviewStep
                  form={form}
                  selectedChurch={selectedChurch}
                  selectedCamps={selectedCamps}
                  getCurrentPrice={getCurrentPrice}
                />
              )}

              {step === 4 && (
                <PaymentStep
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  paymentTypes={paymentTypes}
                  selectedCamps={selectedCamps}
                  getCurrentPrice={getCurrentPrice}
                  handleCopyCardNumber={handleCopyCardNumber}
                  handleFileUpload={handleFileUpload}
                  file={file}
                  admin={admin!}
                />
              )}

              {step === 5 && <Conclusion onClose={onClose} />}

              <Box display="flex" justifyContent="space-between" mt={4}>
                {step > 0 && step <= 4 && (
                  <Button onClick={() => setStep(step - 1)} variant="outlined">
                    Назад
                  </Button>
                )}
                {step < steps.length - 2 ? (
                  <Button onClick={handleNextStep} variant="contained">
                    Далее
                  </Button>
                ) : (step !== steps.length - 1 &&
                  <Button variant="contained" onClick={() => uploadFile(file!)}>
                    Отправить
                  </Button>
                )}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}