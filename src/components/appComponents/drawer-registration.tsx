import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { IoChevronBack } from "react-icons/io5";


interface FormValues {
  firstName: string;
  lastName: string;
  age: number | string;
  phone: string;
  city: string;
  church: string;
}

interface Camp {
  name: string;
  date: string;
  price: number;
}

const steps = ["Личная информация", "Церковь", "Лагерь", "Обзор"];
const churches = ["Слово Истины", "Новая Жизнь", "Примирение", "Свет Евангелия", "Другая"];
const camps: Camp[] = [
  { name: "Детский", date: "10-15 мая", price: 100 },
  { name: "Подростковый", date: "20-25 июня", price: 400 },
  { name: "Мужской", date: "5-10 сентября", price: 300 },
  { name: "Молодежный", date: "5-10 сентября", price: 300 },
  { name: "Семейный", date: "5-10 сентября", price: 300 },
];

export function DrawerRegistration() {
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [_, setSelectedChurch] = useState<string>("");
  const [selectedCamps, setSelectedCamps] = useState<Camp[]>([]);
  const form = useForm<FormValues>({
    defaultValues: { firstName: "", lastName: "", age: "", phone: "", city: "", church: "" },
    mode: "onBlur",
  });

  function toggleCamp(camp: Camp) {
    setSelectedCamps((prev) => (prev.includes(camp) ? prev.filter((c) => c !== camp) : [...prev, camp]));
  }

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    console.log({ ...values, selectedCamps });
    onClose();
  };

  const onClose = () => {
    setIsOpen(false);
    form.clearErrors();
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
            className="fixed top-0 left-0 w-full h-full bg-white shadow-xl z-50 p-6 overflow-auto"
          >
            <div className="flex justify-between items-center mb-4 p-1">
              <Button onClick={onClose} variant="outline" className='rounded-full w-12 h-12'><IoChevronBack /></Button>
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
                  <Input {...form.register("firstName", { required: "Введите имя" })} placeholder="Имя" />
                  <Input {...form.register("lastName", { required: "Введите фамилию" })} placeholder="Фамилия" />
                  <Input type="number" {...form.register("age", { required: "Введите возраст" })} placeholder="Возраст" />
                  <Input {...form.register("phone", { required: "Введите телефон" })} placeholder="Телефон" />
                </>
              )}

              {step === 1 && (
                <>
                  <Input {...form.register("city", { required: "Введите город" })} placeholder="Город" />
                  <Select onValueChange={(value) => setSelectedChurch(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите церковь" />
                    </SelectTrigger>
                    <SelectContent>
                      {churches.map((church) => (
                        <SelectItem key={church} value={church}>{church}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              {step === 2 && (
                <div className="space-y-2">
                  {camps.map((camp) => (
                    <label
                      key={camp.name}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all border-2 border-dashed 
                        ${selectedCamps.includes(camp) ? "bg-accent  !text-white !rounded-3xl" : "bg-gray-50 hover:bg-gray-100"}`}
                    >
                      <Checkbox checked={selectedCamps.includes(camp)} onCheckedChange={() => toggleCamp(camp)} />
                      <div className='flex flex-col items-start'>
                        <p className={`text-accent font-bold ${selectedCamps.includes(camp) && '!text-white'}`}>{camp.name}</p>
                        <p className="font-medium">Дата - {camp.date} </p>
                        <p className="font-medium">Цена - {camp.price}₽</p>
                      </div>

                    </label>
                  ))}
                </div>
              )}


              {step === 3 && (
                <>
                  <p>Имя: {form.getValues("firstName")}</p>
                  <p>Фамилия: {form.getValues("lastName")}</p>
                  <p>Возраст: {form.getValues("age")}</p>
                  <p>Телефон: {form.getValues("phone")}</p>
                  <p>Город: {form.getValues("city")}</p>
                  <p>Церковь: {form.getValues("church")}</p>
                  <h3 className="mt-4">Выбранные лагеря:</h3>
                  {selectedCamps.map((camp) => (
                    <p key={camp.name}>{camp.name} ({camp.date}) - {camp.price}₽</p>
                  ))}
                </>
              )}
            </motion.div>

            <div className="flex justify-between mt-6">
              {step > 0 ? <Button onClick={() => setStep(step - 1)}>Назад</Button> : null}
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} variant={'ghost'}>Далее</Button>
              ) : (
                <Button onClick={form.handleSubmit(onSubmit)}>Отправить</Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}