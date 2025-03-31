import { Typography, RadioGroup, FormControlLabel, Radio, Button, FormControl } from "@mui/material";
import { IoCopyOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { IPaymentType } from '@/models/IPaymentType';
import { ICamp } from '@/models/ICamp';
import { IPrice } from '@/models/IPrice';
import { IAdmin } from '@/models/IAdmin';
// @ts-ignore
import { PaymentTypeEnum } from '@/models/enums/PaymentTypeEnum';
import { ChurchEnum } from '@/models/enums/ChurchEnum';
import { useEffect } from 'react';
import { getDiscountedPrice } from '@/helpers/getDiscountedPrice';

interface PaymentStepProps {
  paymentMethod: number;
  setPaymentMethod: (value: number) => void;
  paymentTypes: IPaymentType[];
  selectedCamps: ICamp[];
  getCurrentPrice: (prices: IPrice[]) => IPrice | null;
  handleCopyCardNumber: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  admin: IAdmin;
  errorMessage: string | null;
  selectedChurch: number | null;
  age: number;
}

export const PaymentStep = ({
  paymentMethod,
  setPaymentMethod,
  paymentTypes,
  selectedCamps,
  getCurrentPrice,
  handleCopyCardNumber,
  handleFileUpload,
  file,
  admin,
  errorMessage,
  selectedChurch,
  age
}: PaymentStepProps) => {

  useEffect(() => {
    if (selectedChurch === ChurchEnum.Другая) {
      setPaymentMethod(PaymentTypeEnum.Card);
    } else {
      setPaymentMethod(PaymentTypeEnum.Cash);
    }
  }, [selectedChurch, setPaymentMethod]);

  return (
    admin && admin.user && <div className="text-left bg-white p-6 rounded-2xl shadow-lg border border-gray-200 overflow-auto">
      <Typography variant="h5" className="text-xl font-semibold text-gray-900 mb-3">Оплата</Typography>
      <Typography variant="body1" className="mb-4">
        Ваша заявка оформлена! Осталось только оплатить.
      </Typography>

      <FormControl component="fieldset" className="mb-4">
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => {
            if (selectedChurch !== ChurchEnum.Другая) {
              setPaymentMethod(Number(e.target.value));
            }
          }}
        >
          {paymentTypes.map((paymentType) => (
            <div className='flex items-center' key={paymentType.id}>
              <FormControlLabel
                value={paymentType.id}
                control={<Radio />}
                label={paymentType.name}
                disabled={
                  (selectedChurch === ChurchEnum.Другая && paymentType.id !== PaymentTypeEnum.Card) ||
                  (selectedChurch !== ChurchEnum.Другая && paymentType.id !== PaymentTypeEnum.Cash)
                }
              />
              {paymentType.id === PaymentTypeEnum.Card && (
                <span className="text-sm text-gray-400">
                  (после 1 июня, для гостей)
                </span>
              )}
            </div>
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
              Пожалуйста, переведите сумму <strong>{selectedCamps.reduce((acc, camp) => acc + getCurrentPrice(camp.prices)?.totalValue!, 0)}₽</strong> по данному номеру карты:
            </Typography>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Typography variant="body1" className="font-mono">
                <strong>{admin.bankCardNumber}</strong>
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
                <strong>Получатель</strong> - {admin.bankCardOwner}
                <br />
                <strong>Банк</strong> - {admin.bankName}
                <br />
                <strong>Церковь</strong> - {admin.church.name}
                <br />
                <strong>Телефон</strong> - {admin.phoneNumber}
              </Typography>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Прикрепите скриншот оплаты:
              </label>
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
              Пожалуйста, передайте сумму <strong>{ getDiscountedPrice(age, selectedCamps.reduce((acc, camp) => acc + getCurrentPrice(camp.prices)?.totalValue!, 0))}₽</strong> следующему человеку:
            </Typography>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Typography variant="body1">
                <strong>Имя:</strong> {admin.user.firstName} {admin.user.lastName}
              </Typography>
              <Typography variant="body1">
                <strong>Церковь:</strong> {ChurchEnum[admin.churchId]}
              </Typography>
              <Typography variant="body1">
                <strong>Номер:</strong> {admin.phoneNumber}
              </Typography>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};