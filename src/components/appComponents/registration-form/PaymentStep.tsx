import { Typography, RadioGroup, FormControlLabel, Radio, Button, FormControl } from "@mui/material";
import { IoCopyOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { IPaymentType } from '@/models/IPaymentType';
import { ICamp } from '@/models/ICamp';
import { IPrice } from '@/models/IPrice';
import { PaymentTypeEnum } from '@/models/enums/paymentTypeEnum';
import { IAdmin } from '@/models/IAdmin';

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
  admin
}: PaymentStepProps) => {
  return (
    <div className="text-left bg-white p-6 rounded-2xl shadow-lg border border-gray-200 overflow-auto">
      <Typography variant="h5" className="text-xl font-semibold text-gray-900 mb-3">Оплата</Typography>
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
                <strong>Получатель</strong> - ДОБАВИТЬ ИМЯ.
                <strong>Телефон</strong> - {admin.phoneNumber}
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
              Пожалуйста, передайте сумму <strong>{selectedCamps.reduce((acc, camp) => acc + getCurrentPrice(camp.prices)?.totalValue!, 0)}₽</strong> следующему человеку:
            </Typography>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Typography variant="body1">
                <strong>Имя:</strong> ДОБАВИТЬ ИМЯ
              </Typography>
              <Typography variant="body1">
                <strong>Церковь:</strong> ПУСТЬ ШЛЮТ ЦЕРКОВЬ
              </Typography>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};