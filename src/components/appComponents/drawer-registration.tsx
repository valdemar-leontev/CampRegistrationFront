import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { IoChevronBack } from "react-icons/io5";

// Схема валидации с использованием Zod
const schema = z.object({
  firstName: z.string().min(1, "Имя обязательно"),
  lastName: z.string().min(1, "Фамилия обязательна"),
  dateOfBirth: z.string().min(1, "Дата рождения обязательна"),
  phone: z.string().min(1, "Телефон обязателен"),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", dateOfBirth: "", phone: "", city: "", church: "" },
    mode: "onChange", // Валидация при каждом изменении
  });

  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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

    setAgeError(errorMessage); // Устанавливаем или очищаем ошибку
    return isValid;
  };

  const toggleCamp = (camp: Camp) => {
    const age = calculateAge(watch("dateOfBirth"));
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

    // Проверка полей в зависимости от текущего шага
    if (step === 0) {
      isValid = await trigger(["firstName", "lastName", "dateOfBirth", "phone"]);
    } else if (step === 1) {
      isValid = await trigger(["church"]);
      if (selectedChurch === "Другая") {
        isValid = isValid && (await trigger(["otherChurchName", "otherChurchAddress"]));
      }
    } else if (step === 2) {
      isValid = selectedCamps.length > 0; // Проверка, что выбран хотя бы один лагерь
    }

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  // Анимация для сообщений об ошибках
  const errorAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  };

  // Анимация для элементов формы
  const formElementAnimation = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { type: "spring", stiffness: 200, damping: 20 },
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant={"ghost"} className="p-10 !py-6">
        Начать регистрацию
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 w-full h-full bg-white shadow-xl z-[100000] p-6 overflow-auto"
          >
            <div className="flex justify-between items-center mb-4 p-1">
              <Button onClick={onClose} variant="outline" className="rounded-full w-12 h-12">
                <IoChevronBack />
              </Button>
              <h2 className="text-xl font-semibold">{steps[step]}</h2>
            </div>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
              className="space-y-4"
            >
              {step === 0 && (
                <>
                  <motion.div {...formElementAnimation}>
                    <Input
                      {...register("firstName")}
                      placeholder="Имя"
                    />
                    <AnimatePresence>
                      {errors.firstName && (
                        <motion.p {...errorAnimation} className="text-red-500">
                          {errors.firstName.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <motion.div {...formElementAnimation}>
                    <Input
                      {...register("lastName")}
                      placeholder="Фамилия"
                    />
                    <AnimatePresence>
                      {errors.lastName && (
                        <motion.p {...errorAnimation} className="text-red-500">
                          {errors.lastName.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <motion.div {...formElementAnimation}>
                    <Input
                      type="date"
                      {...register("dateOfBirth")}
                      placeholder="Дата рождения"
                    />
                    <AnimatePresence>
                      {errors.dateOfBirth && (
                        <motion.p {...errorAnimation} className="text-red-500">
                          {errors.dateOfBirth.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <motion.div {...formElementAnimation}>
                    <Input
                      {...register("phone")}
                      placeholder="Телефон"
                    />
                    <AnimatePresence>
                      {errors.phone && (
                        <motion.p {...errorAnimation} className="text-red-500">
                          {errors.phone.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}

              {step === 1 && (
                <>
                  <motion.div {...formElementAnimation}>
                    <Select
                      onValueChange={(value) => {
                        setSelectedChurch(value);
                        setValue("church", value);
                        trigger("church");
                      }}
                      {...register("church")}
                      value={selectedChurch}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите церковь" />
                      </SelectTrigger>
                      <SelectContent>
                        {churches.map((church) => (
                          <SelectItem key={church} value={church}>
                            {church}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <AnimatePresence>
                      {errors.church && (
                        <motion.p {...errorAnimation} className="text-red-500">
                          {errors.church.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  {selectedChurch === "Другая" && (
                    <>
                      <motion.div {...formElementAnimation}>
                        <Input
                          {...register("otherChurchName")}
                          placeholder="Название церкви"
                        />
                        <AnimatePresence>
                          {errors.otherChurchName && (
                            <motion.p {...errorAnimation} className="text-red-500">
                              {errors.otherChurchName.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      <motion.div {...formElementAnimation}>
                        <Input
                          {...register("otherChurchAddress")}
                          placeholder="Адрес церкви"
                        />
                        <AnimatePresence>
                          {errors.otherChurchAddress && (
                            <motion.p {...errorAnimation} className="text-red-500">
                              {errors.otherChurchAddress.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </>
                  )}
                </>
              )}

              {step === 2 && (
                <div className="space-y-2">
                  {camps.map((camp) => (
                    <motion.div
                      key={camp.name}
                      {...formElementAnimation}
                    >
                      <label
                        className={`flex items-center gap-4 p-3 rounded-lg transition-all border-2 border-dashed 
                          ${selectedCamps.includes(camp) ? "bg-accent !text-white !rounded-3xl" : "bg-gray-50 hover:bg-gray-100"}`}
                      >
                        <Checkbox checked={selectedCamps.includes(camp)} onCheckedChange={() => toggleCamp(camp)} />
                        <div className="flex flex-col items-start">
                          <p className={`text-accent font-bold ${selectedCamps.includes(camp) && "!text-white"}`}>
                            {camp.name}
                          </p>
                          <p className="font-medium">Дата - {camp.date}</p>
                          <p className="font-medium">Цена - {camp.price}₽</p>
                        </div>
                      </label>
                    </motion.div>
                  ))}
                  <AnimatePresence>
                    {ageError && (
                      <motion.p {...errorAnimation} className="text-red-500">
                        {ageError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {step === 3 && (
                <motion.div {...formElementAnimation} className="space-y-4 text-left">
                  <div className="bg-gray-50 p-4 rounded-2xl border-dashed border">
                    <h3 className="font-bold text-lg">Личная информация</h3>
                    <p>Имя: {watch("firstName")}</p>
                    <p>Фамилия: {watch("lastName")}</p>
                    <p>Дата рождения: {watch("dateOfBirth")}</p>
                    <p>Телефон: {watch("phone")}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border-dashed border">
                    <h3 className="font-bold text-lg">Церковь</h3>
                    <p>Церковь: {watch("church")}</p>
                    {selectedChurch === "Другая" && (
                      <>
                        <p>Название церкви: {watch("otherChurchName")}</p>
                        <p>Адрес церкви: {watch("otherChurchAddress")}</p>
                      </>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border-dashed border">
                    <h3 className="font-bold text-lg">Выбранные лагеря</h3>
                    {selectedCamps.map((camp) => (
                      <p key={camp.name}>
                        {camp.name} ({camp.date}) - {camp.price}₽
                      </p>
                    ))}
                  </div>
                  <p className='text-accent mt-10 font-bold ml-4'>ИТОГО: {selectedCamps.reduce((acc, camp) => acc + camp.price, 0)}₽</p>
                </motion.div>
              )}
            </motion.div>

            <div className="flex justify-between mt-6 ">
              {step > 0 ? <Button onClick={() => setStep(step - 1)}>Назад</Button> : null}
              {step < steps.length - 1 ? (
                <Button onClick={handleNextStep} variant={"ghost"}>
                  Далее
                </Button>
              ) : (
                <Button onClick={handleSubmit(onSubmit)}>Отправить</Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}