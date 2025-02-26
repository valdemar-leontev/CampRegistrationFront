import { useForm, SubmitHandler } from "react-hook-form"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

interface FormValues {
  firstName: string
  lastName: string
  age: number | string
  phone: string
  city: string
  church: string
}

interface Camp {
  name: string
  date: string
  price: number
}

const steps = ["Личная информация", "Церковь", "Лагерь", "Обзор"]
const churches = ["Слово Истины", "Новая Жизнь", "Примирение", "Свет Евангелия", "Другая"]
const camps: Camp[] = [
  { name: "Детский", date: "10-15 мая", price: 100 },
  { name: "Подростковый", date: "20-25 июня", price: 400 },
  { name: "Мужской", date: "5-10 сентября", price: 300 },
  { name: "Молодежный", date: "5-10 сентября", price: 300 },
  { name: "Семейный", date: "5-10 сентября", price: 300 },
]

export function DrawerRegistration() {
  const [step, setStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedChurch, setSelectedChurch] = useState<string>("")
  const [selectedCamps, setSelectedCamps] = useState<Camp[]>([])
  const form = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      age: "",
      phone: "",
      city: "",
      church: "",
    },
    mode: "onBlur",
  })

  function toggleCamp(camp: Camp) {
    setSelectedCamps((prev) =>
      prev.includes(camp) ? prev.filter((c) => c !== camp) : [...prev, camp]
    )
  }

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    console.log({ ...values, selectedCamps })
    onClose();
  }

  const onClose = () => {
    setIsOpen(false);
  }

  const totalPrice = selectedCamps.reduce((sum, camp) => sum + camp.price, 0)

  const handleNext = () => {
    const isStepValid = form.formState.isValid
    if (isStepValid || step === 3) {
      setStep((prev) => prev + 1)
    } else {
      form.trigger()
    }
  }

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Когда окно открывается, устанавливаем фокус на кнопку "Закрыть"
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant={'ghost'} className='p-10 !py-6'>
        Начать регистрацию
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[calc(100vh-10px)] overflow-auto transition-all duration-1000">

          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{steps[step]}</DialogTitle>
          </DialogHeader>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -150 }}
            transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
            className="p-2 space-y-4 h-[60vh] overflow-auto relative"
          >
            {step === 0 && (
              <>
                <label className="block font-medium">Имя</label>
                <Input
                  {...form.register("firstName", { required: "Это поле обязательно для заполнения" })}
                  placeholder="Введите ваше имя"
                  className={form.formState.errors.firstName ? "border-red-500" : ""}
                />
                <AnimatePresence>
                  {form.formState.errors.firstName && (
                    <motion.p
                      className="text-red-500 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {form.formState.errors.firstName.message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <label className="block font-medium mt-3">Фамилия</label>
                <Input
                  {...form.register("lastName", { required: "Это поле обязательно для заполнения" })}
                  placeholder="Введите вашу фамилию"
                  className={form.formState.errors.lastName ? "border-red-500" : ""}
                />
                <AnimatePresence>
                  {form.formState.errors.lastName && (
                    <motion.p
                      className="text-red-500 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {form.formState.errors.lastName.message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <label className="block font-medium mt-3">Возраст</label>
                <Input
                  type="number"
                  {...form.register("age", { required: "Это поле обязательно для заполнения" })}
                  placeholder="Введите ваш возраст"
                  className={form.formState.errors.age ? "border-red-500" : ""}
                />
                <AnimatePresence>
                  {form.formState.errors.age && (
                    <motion.p
                      className="text-red-500 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {form.formState.errors.age.message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <label className="block font-medium">Телефон</label>
                <Input
                  {...form.register("phone", { required: "Это поле обязательно для заполнения" })}
                  placeholder="Введите ваш номер телефона"
                  className={form.formState.errors.phone ? "border-red-500" : ""}
                />
                <AnimatePresence>
                  {form.formState.errors.phone && (
                    <motion.p
                      className="text-red-500 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {form.formState.errors.phone.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </>
            )}

            {step === 1 && (
              <>
                <label className="block font-medium mt-3">Город</label>
                <Input
                  {...form.register("city", { required: "Это поле обязательно для заполнения" })}
                  placeholder="Введите ваш город"
                  className={form.formState.errors.city ? "border-red-500" : ""}
                />
                <AnimatePresence>
                  {form.formState.errors.city && (
                    <motion.p
                      className="text-red-500 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {form.formState.errors.city.message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <label className="block font-medium mt-3">Выберите церковь</label>
                <Select
                  onValueChange={(value) => {
                    setSelectedChurch(value)
                    form.setValue("church", value)
                  }}
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
                  {form.formState.errors.church && (
                    <motion.p
                      className="text-red-500 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {form.formState.errors.church.message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {selectedChurch === "Другая" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3"
                    >
                      <label className="block font-medium">Введите название церкви</label>
                      <Input
                        {...form.register("church", { required: "Это поле обязательно для заполнения" })}
                        placeholder="Введите название вашей церкви"
                        className={form.formState.errors.church ? "border-red-500" : ""}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <label className="block text-xl font-semibold text-gray-800">Выберите лагерь</label>
                <div className="space-y-2">
                  {camps.map((camp) => (
                    <label
                      key={camp.name}
                      className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 cursor-pointer -z-10000"
                      onClick={() => toggleCamp(camp)}
                    >
                      <Checkbox
                        checked={selectedCamps.includes(camp)}
                        onCheckedChange={() => toggleCamp(camp)}
                        className="cursor-pointer"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-700">{camp.name}</span>
                        <div className="text-sm text-gray-500">{camp.date} - {camp.price} рублей</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg font-semibold">Обзор</h2>
                <p>Имя: {form.getValues("firstName")}</p>
                <p>Фамилия: {form.getValues("lastName")}</p>
                <p>Возраст: {form.getValues("age")}</p>
                <p>Телефон: {form.getValues("phone")}</p>
                <p>Город: {form.getValues("city")}</p>
                <p>Церковь: {form.getValues("church")}</p>

                <h3 className="mt-4 text-lg font-semibold">Выбранные лагеря:</h3>
                {selectedCamps.map((camp) => (
                  <p key={camp.name}>
                    {camp.name} ({camp.date}) - {camp.price} рублей
                  </p>
                ))}
                <p className="mt-3 font-bold">ИТОГО: {totalPrice} рублей</p>
              </>
            )}
          </motion.div>

          <DialogFooter className="flex justify-between p-6 gap-5">
            {step > 0 ? (
              <Button onClick={() => setStep(step - 1)} variant="outline">
                Назад
              </Button>
            ) : (
              <Button onClick={onClose} variant="outline" ref={closeButtonRef}>
                Закрыть
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={handleNext} variant={'ghost'}>Далее</Button>
            ) : (
              <Button onClick={form.handleSubmit(onSubmit)} variant={'ghost'}>Отправить</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
