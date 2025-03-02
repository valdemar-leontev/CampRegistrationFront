"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
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
} from "@mui/material";
import { IoChevronBack } from "react-icons/io5";
import { CiCircleInfo } from "react-icons/ci";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";

// Схема валидации
const phoneSchema = z.string()
  .min(1, 'Телефон обязателен')
  .refine((value) => {
    const cleanedValue = value.replace(/\D/g, "");
    return cleanedValue.length === 11 && cleanedValue.startsWith("7");
  }, "Телефон должен начинаться с 7 и содержать 11 цифр");

const schema = z.object({
  firstName: z.string().min(1, "Имя обязательно"),
  lastName: z.string().min(1, "Фамилия обязательна"),
  dateOfBirth: z.date({
    required_error: "Дата рождения обязательна",
  }),
  phone: phoneSchema,
  city: z.string().min(1, "Город обязателен"),
  church: z.string().min(1, "Церковь обязательна"),
  otherChurchName: z.string().optional(),
  otherChurchAddress: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Camp {
  name: string;
  date: string;
  price: number;
}

const steps = ["Личная информация", "Церковь", "Лагерь", "Обзор"];
const churches = ["Слово Истины", "Новая Жизнь", "Примирение", "Свет Евангелия", "Другая"];
const camps: Camp[] = [
  { name: "Детский", date: "30.06 - 05.07", price: 500 },
  { name: "Подростковый", date: "07.07 - 12.07", price: 800 },
  { name: "Мужской", date: "14.07 - 15.07", price: 1000 },
  { name: "Общецерковный", date: "17.07 - 20.07", price: 500 },
  { name: "Молодежный", date: "21.07 - 26.07", price: 800 },
];

export function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState<string>("");
  const [selectedCamps, setSelectedCamps] = useState<Camp[]>([]);
  const [ageError, setAgeError] = useState<string | null>(null);

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

  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const validateAgeForCamp = (camp: Camp, age: number): boolean => {
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

    setAgeError(errorMessage);
    return isValid;
  };

  const toggleCamp = (camp: Camp) => {
    const age = calculateAge(form.getValues("dateOfBirth"));
    if (validateAgeForCamp(camp, age)) {
      setSelectedCamps((prev) => (prev.includes(camp) ? prev.filter((c) => c !== camp) : [...prev, camp]));
    }
  };

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    console.log({ ...values, selectedCamps });
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
    }

    if (isValid) {
      setStep((prev) => prev + 1);
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
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "white", zIndex: 100000, padding: 24, overflow: "auto" }}
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
                    open={open}
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


            <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Дата рождения"
                      value={form.watch("dateOfBirth") ? dayjs(form.watch("dateOfBirth")) : null}
                      onChange={(date) => form.setValue("dateOfBirth", date!.toDate())}
                      slotProps={{
                        textField: {
                          error: !!form.formState.errors.dateOfBirth,
                          helperText: form.formState.errors.dateOfBirth?.message,
                        },
                      }}
                    />

                  </LocalizationProvider>
                  <TextField
                    label="Телефон"
                    {...form.register("phone")}
                    error={!!form.formState.errors.phone}
                    helperText={form.formState.errors.phone?.message}
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <FormControl fullWidth>
                    <InputLabel>Церковь</InputLabel>
                    <Select
                      label="Церковь"
                      value={form.watch("church")}
                      onChange={(e) => {
                        setSelectedChurch(e.target.value);
                        form.setValue("church", e.target.value);
                      }}
                    >
                      {churches.map((church) => (
                        <MenuItem key={church} value={church}>
                          {church}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedChurch === "Другая" && (
                    <>
                      <TextField
                        label="Название церкви"
                        {...form.register("otherChurchName")}
                      />
                      <TextField
                        label="Адрес церкви"
                        {...form.register("otherChurchAddress")}
                      />
                    </>
                  )}
                </>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {camps.map((camp) => {
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
                          onChange={() => toggleCamp(camp)}
                          className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <p className="text-lg font-semibold text-gray-900">{camp.name}</p>
                          <p className="text-sm text-gray-600 mt-1">📅 Дата: {camp.date}</p>
                          <p className="text-sm text-gray-600 mt-1">💰 Цена: {camp.price}₽</p>
                        </div>
                      </div>
                    );
                  })}
                  {ageError && <p className="text-red-500 text-sm">{ageError}</p>}
                </div>
              )}

              {step === 3 && (
                <div className="text-left bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                  {/* Личная информация */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Личная информация</h2>
                  <div className="space-y-1 text-gray-700">
                    <p><span className="font-medium">Имя:</span> {form.watch("firstName")}</p>
                    <p><span className="font-medium">Фамилия:</span> {form.watch("lastName")}</p>
                    <p><span className="font-medium">Дата рождения:</span> {dayjs(form.watch("dateOfBirth")).format("DD.MM.YYYY")}</p>
                    <p><span className="font-medium">Телефон:</span> {form.watch("phone")}</p>
                  </div>

                  {/* Церковь */}
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

                  {/* Выбранные лагеря */}
                  <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Выбранные лагеря</h2>
                  <div className="space-y-1 text-gray-700">
                    {selectedCamps.map((camp) => (
                      <p key={camp.name}>
                        <span className="font-medium">{camp.name}</span> ({camp.date}) – {camp.price}₽
                      </p>
                    ))}
                  </div>

                  {/* Итоговая сумма */}
                  <h2 className="text-xl font-semibold text-gray-900 mt-6">
                    ИТОГО: <span className="text-blue-600">{selectedCamps.reduce((acc, camp) => acc + camp.price, 0)}₽</span>
                  </h2>
                </div>
              )}


              <Box display="flex" justifyContent="space-between" mt={4}>
                {step > 0 && (
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
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}