import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Tooltip,
  IconButton,
  ClickAwayListener,
  Alert,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  FormHelperText,
} from "@mui/material";
import { IoChevronBack } from "react-icons/io5";
import { CiCircleInfo } from "react-icons/ci";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
// @ts-ignore
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import 'dayjs/locale/ru';
import { IChurch } from '@/models/church';
import { apiUrl } from '../../../constants'
import { ICamp } from '@/models/ICamp';
import { IPrice } from '@/models/IPrice';
import { IPaymentType } from '@/models/IPaymentType';
import { PaymentTypeEnum } from '@/models/enums/paymentTypeEnum';

dayjs.locale('ru');


const schema = z.object({
  firstName: z.string().min(1, "Имя обязательно"),
  lastName: z.string().min(1, "Фамилия обязательна"),
  dateOfBirth: z.date({
    required_error: "Дата рождения обязательна",
  }),
  phone: z.string().optional(),
  city: z.string().min(1, "Город обязателен"),
  church: z.string().min(1, "Церковь обязательна"),
  otherChurchName: z.string().optional(),
  otherChurchAddress: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.church === "Другая") {
    if (!data.otherChurchName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Название церкви обязательно",
        path: ["otherChurchName"],
      });
    }
    if (!data.otherChurchAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Адрес церкви обязателен",
        path: ["otherChurchAddress"],
      });
    }
  }
});

type FormValues = z.infer<typeof schema>;

// interface Camp {
//   name: string;
//   date: string;
//   price: number;
// }


const steps = ["Личная информация", "Церковь", "Лагерь", "Обзор", "Оплата"];
// const churches = ["Слово Истины", "Новая Жизнь", "Примирение", "Свет Евангелия", "Другая"];
// const camps: Camp[] = [
//   { name: "Детский", date: "30.06 - 05.07", price: 500 },
//   { name: "Подростковый", date: "07.07 - 12.07", price: 800 },
//   { name: "Мужской", date: "14.07 - 15.07", price: 1000 },
//   { name: "Общецерковный", date: "17.07 - 20.07", price: 500 },
//   { name: "Молодежный", date: "21.07 - 26.07", price: 800 },
// ];

export function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState<string>("");
  const [selectedCamps, setSelectedCamps] = useState<ICamp[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<number>(PaymentTypeEnum.Cash);
  const [isCopied, setIsCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [churchesList, setChurchesList] = useState<IChurch[]>([]);
  const [campList, setCampList] = useState<ICamp[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<IPaymentType[]>([])

  useEffect(() => {
    (async () => {
      var response = await axios.get(`${apiUrl}/churches`);

      setChurchesList(response.data as IChurch[])
    })()
  }, [])

  useEffect(() => {
    (async () => {
      var response = await axios.get(`${apiUrl}/camps`);

      setCampList(response.data as ICamp[])
    })()
  }, [])

  useEffect(() => {
    (async () => {
      var response = await axios.get(`${apiUrl}/registrations/dictionaries/payment-types`);

      setPaymentTypes(response.data as IPaymentType[])
    })()
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", dateOfBirth: undefined, phone: "", city: "", church: "" },
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

  const handleNextStep = async () => {
    let isValid = false;

    if (step === 0) {
      isValid = await form.trigger(["firstName", "lastName", "dateOfBirth", "phone"]);
    } else if (step === 1) {
      isValid = await form.trigger(["church"]);
      if (selectedChurch === "Другая") {
        isValid = isValid && (await form.trigger(["otherChurchName", "otherChurchAddress"]));
      }
    } else if (step === 2) {
      isValid = selectedCamps.length > 0;
    } else if (step === 3) {
      isValid = true;
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

  const getCurrentPrice = (prices: IPrice[]) => {
    const now = new Date();

    for (const price of prices) {
      const startDate = new Date(price.startDate);
      const endDate = new Date(price.endDate);
      if (now >= startDate && now <= endDate) {
        return price.totalValue;
      }
    }

    return 0;
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
            <Box display="flex" justifyContent="space-between" alignItems="center" className="py-3">
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
            </Box>


            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 overflow-x-scroll pt-5">
              {step === 0 && (
                <>
                  <TextField
                    label="Имя"
                    {...form.register("firstName")}
                    error={!!form.formState.errors.firstName}
                    helperText={form.formState.errors.firstName?.message}
                  />
                  <TextField
                    label="Фамилия"
                    {...form.register("lastName")}
                    error={!!form.formState.errors.lastName}
                    helperText={form.formState.errors.lastName?.message}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                    <DatePicker
                      maxDate={dayjs()}
                      minDate={dayjs().subtract(100, 'year')}
                      label="Дата рождения"
                      value={form.watch("dateOfBirth") ? dayjs(form.watch("dateOfBirth")) : null}
                      onChange={(date) => {
                        if (date) {
                          form.setValue("dateOfBirth", date.toDate());
                        } else {
                          form.setValue("dateOfBirth", new Date());
                        }
                      }}
                      format="DD MMMM YYYY"
                      slotProps={{
                        textField: {
                          error: !!form.formState.errors.dateOfBirth,
                          helperText: form.formState.errors.dateOfBirth?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>

                  <div className='flex flex-col'>
                    <MuiTelInput
                      forceCallingCode
                      onlyCountries={['RU']}
                      defaultCountry="RU"
                      value={form.watch('phone')}
                      error={!!form.formState.errors.phone}
                      onChange={(value: string) => {
                        const isValid = matchIsValidTel(value, {
                          onlyCountries: ['RU']
                        })

                        if (!isValid) {
                          console.log(form.formState.errors.phone);

                          form.setError('phone', { type: "custom", message: "Неверный формат" });
                        } else {
                          form.clearErrors('phone')
                        }
                        form.setValue('phone', value)
                      }} />
                    <div className='!text-[0.75rem] text-left ml-4 text-[#d3302f]'>
                      {form.formState.errors.phone ? form.formState.errors.phone!.message : ''}
                    </div>
                  </div>

                </>
              )}

              {step === 1 && (
                <>
                  <FormControl fullWidth error={!!form.formState.errors.church}>
                    <InputLabel>Церковь</InputLabel>
                    <Select
                      label="Церковь"
                      value={form.watch("church") || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedChurch(value);
                        form.setValue("church", value);
                        form.trigger("church");
                      }}
                      className='text-left'
                    >
                      {churchesList.map((church) => (
                        <MenuItem key={church.id} value={church.name}>
                          {church.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {form.formState.errors.church && (
                      <FormHelperText error>
                        {form.formState.errors.church.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  {selectedChurch === "Другая" && (
                    <>
                      <TextField
                        label="Название церкви"
                        {...form.register("otherChurchName")}
                        error={!!form.formState.errors.otherChurchName}
                        helperText={form.formState.errors.otherChurchName?.message}
                      />
                      <TextField
                        label="Адрес церкви"
                        {...form.register("otherChurchAddress")}
                        error={!!form.formState.errors.otherChurchAddress}
                        helperText={form.formState.errors.otherChurchAddress?.message}
                      />
                    </>
                  )}
                </>
              )}

              {step === 2 && (
                <div className="space-y-4 overflow-auto max-h-[65vh]">
                  {campList.map((camp) => {
                    const isSelected = selectedCamps.includes(camp);

                    return (
                      <div
                        key={camp.name}
                        onClick={() => toggleCamp(camp)}
                        className={`px-5 py-3 text-left rounded-2xl border transition cursor-pointer flex items-center gap-4
            ${isSelected
                            ? "bg-blue-100 border-blue-500 shadow-md"
                            : "bg-white border-gray-200 shadow-lg hover:shadow-xl"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="text-lg font-semibold text-gray-900">{camp.name}</p>
                          <p className="text-sm text-gray-600 mt-1">📅 Дата: {dayjs(camp.startDate).format('D MMMM')} - {dayjs(camp.endDate).format('D MMMM')}</p>
                          <p className="text-sm text-gray-600 mt-1">💰 Цена: {getCurrentPrice(camp.prices)}₽</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {step === 3 && (
                <div className="text-left bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Личная информация</h2>
                  <div className="space-y-1 text-gray-700">
                    <p><span className="font-medium">Имя:</span> {form.watch("firstName")}</p>
                    <p><span className="font-medium">Фамилия:</span> {form.watch("lastName")}</p>
                    <p><span className="font-medium">Дата рождения:</span> {dayjs(form.watch("dateOfBirth")).format("DD.MM.YYYY")}</p>
                    <p><span className="font-medium">Телефон:</span> {form.watch("phone")}</p>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Церковь</h2>
                  <div className="space-y-1 text-gray-700">
                    <p><span className="font-medium">Церковь:</span> {form.watch("church")}</p>
                    {selectedChurch === "Другая" && (
                      <>
                        <p><span className="font-medium">Название:</span> {form.watch("otherChurchName")}</p>
                        <p><span className="font-medium">Адрес:</span> {form.watch("otherChurchAddress")}</p>
                      </>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Выбранные лагеря</h2>
                  <div className="space-y-1 text-gray-700">
                    {selectedCamps.map((camp) => (
                      <p key={camp.name}>
                        <strong>{camp.name}</strong>
                        <br />
                        {dayjs(camp.startDate).format('D MMMM')} - {dayjs(camp.endDate).format('D MMMM')} – {getCurrentPrice(camp.prices)}₽
                      </p>
                    ))}
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mt-6">
                    ИТОГО: <span className="text-blue-600">{selectedCamps.reduce((acc, camp) => acc + getCurrentPrice(camp.prices), 0)}₽</span>
                  </h2>
                </div>
              )}

              {step === 4 && (
                <div className="text-left bg-white p-6 rounded-2xl shadow-lg border border-gray-200 overflow-auto">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Оплата</h2>
                  <Typography variant="body1" className="mb-4">
                    Ваша заявка оформлена! Осталось только оплатить.
                  </Typography>

                  <FormControl component="fieldset" className="mb-4">
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(Number(e.target.value))}
                    >
                      {paymentTypes.map((paymentType) => (
                        <FormControlLabel
                          key={paymentType.id}
                          value={paymentType.id}
                          control={<Radio />}
                          label={paymentType.name}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {paymentMethod === PaymentTypeEnum.Card ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <Typography variant="body1">
                          Пожалуйста, переведите сумму <strong>{selectedCamps.reduce((acc, camp) => acc + getCurrentPrice(camp.prices), 0)}₽</strong> по данному номеру карты:
                        </Typography>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <Typography variant="body1" className="font-mono">
                            <strong>1234 5678 9012 3456</strong>
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={handleCopyCardNumber}
                            className="!bg-blue-500 !text-white w-10 h-10 rounded-full"
                          >
                            <IoCopyOutline />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <Typography variant="body1" className="font-mono">
                            <strong>Получатель</strong> - Иванов И.И.
                          </Typography>
                        </div>

                        <Typography variant="body1" className="mt-4">
                          Загрузите скриншот оплаты:
                        </Typography>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="mt-2 w-full"
                        />
                        {file && (
                          <Typography variant="body2" className="mt-2">
                            Файл загружен: {file.name}
                          </Typography>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="cash"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <Typography variant="body1">
                          Пожалуйста, передайте сумму <strong>{selectedCamps.reduce((acc, camp) => acc + getCurrentPrice(camp.prices), 0)}₽</strong> следующему человеку:
                        </Typography>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <Typography variant="body1">
                            <strong>Имя:</strong> Иванов Иван
                          </Typography>
                          <Typography variant="body1">
                            <strong>Церковь:</strong> Слово Истины
                          </Typography>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              )}

              <Box display="flex" justifyContent="space-between" mt={4}>
                {step > 0 && step !== 4 && (
                  <Button onClick={() => setStep(step - 1)} variant="outlined">
                    Назад
                  </Button>
                )}
                {step < steps.length - 1 ? (
                  <Button onClick={handleNextStep} variant="contained">
                    Далее
                  </Button>
                ) : (
                  <Button type="submit" variant="contained">
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