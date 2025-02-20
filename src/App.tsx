import { FC, useState } from 'react';
import './App.css';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from './components/ui/button';
import { motion } from 'framer-motion';

interface Invoice {
  lastName: string;
  firstName: string;
  middleName: string;
  age: number;
  city: string;
  church: string;
  paymentStatus: string;
}

// Пример данных
const invoices: Invoice[] = [
  { lastName: 'Иванов', firstName: 'Иван', middleName: 'Иванович', age: 30, city: 'Москва', church: 'Церковь Святого Петра', paymentStatus: 'Скинул скрин' },
  { lastName: 'Петров', firstName: 'Петр', middleName: 'Петрович', age: 25, city: 'Санкт-Петербург', church: 'Церковь Спаса', paymentStatus: 'Не оплачено' },
  { lastName: 'Сидоров', firstName: 'Сидор', middleName: 'Сидорович', age: 35, city: 'Новосибирск', church: 'Церковь Успения', paymentStatus: 'Скинул скрин' },
  { lastName: 'Кузнецов', firstName: 'Алексей', middleName: 'Алексеевич', age: 40, city: 'Екатеринбург', church: 'Церковь Святого Николая', paymentStatus: 'Оплачено' },
  { lastName: 'Смирнов', firstName: 'Дмитрий', middleName: 'Дмитриевич', age: 28, city: 'Казань', church: 'Церковь Казанской иконы', paymentStatus: 'Скинул скрин' },
  { lastName: 'Попов', firstName: 'Анатолий', middleName: 'Анатолиевич', age: 33, city: 'Челябинск', church: 'Церковь Святой Троицы', paymentStatus: 'Оплачено' },
  { lastName: 'Васильев', firstName: 'Сергей', middleName: 'Сергеевич', age: 29, city: 'Нижний Новгород', church: 'Церковь Святого Георгия', paymentStatus: 'Оплачено' },
  { lastName: 'Зайцев', firstName: 'Олег', middleName: 'Олегович', age: 31, city: 'Ростов-на-Дону', church: 'Церковь Святого Иоанна', paymentStatus: 'Не оплачено' },
];

const App: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleRowClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDrawerOpen(true);
  };

  const handlePaymentConfirmation = () => {
    if (selectedInvoice) {
      console.log(`Оплата подтверждена для: ${selectedInvoice.firstName} ${selectedInvoice.lastName}`);
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className='bg-white'>
      <Tabs defaultValue="Детский">
        <TabsList>
          <TabsTrigger value="Детский">Детский</TabsTrigger>
          <TabsTrigger value="Подростковый">Подростковый</TabsTrigger>
          <TabsTrigger value="Отец и сын">Отец и сын</TabsTrigger>
        </TabsList>
        <TabsContent value="Детский">
          <div>
            <Table className="min-w-full bg-white border rounded-lg shadow-md">
              <TableHeader>
                <TableRow className="bg-white border-b">
                  <TableHead className="py-3 px-4 text-left">Фамилия</TableHead>
                  <TableHead className="py-3 px-4 text-left">Имя</TableHead>
                  <TableHead className="py-3 px-4 text-left">Отчество</TableHead>
                  <TableHead className="py-3 px-4 text-right">Возраст</TableHead>
                  <TableHead className="py-3 px-4 text-left">Город</TableHead>
                  <TableHead className="py-3 px-4 text-left">Церковь</TableHead>
                  <TableHead className="py-3 px-4 text-left">Статус оплаты</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice, index) => (
                  <TableRow 
                    key={index} 
                    className="border-b hover:bg-gray-50 transition-colors duration-200 cursor-pointer" 
                    onClick={() => handleRowClick(invoice)}
                  >
                    <TableCell className="py-2 px-4">{invoice.lastName}</TableCell>
                    <TableCell className="py-2 px-4">{invoice.firstName}</TableCell>
                    <TableCell className="py-2 px-4">{invoice.middleName}</TableCell>
                    <TableCell className="py-2 px-4 text-right">{invoice.age}</TableCell>
                    <TableCell className="py-2 px-4">{invoice.city}</TableCell>
                    <TableCell className="py-2 px-4">{invoice.church}</TableCell>
                    <TableCell className="py-2 px-4">{invoice.paymentStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerContent>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 50 }}
                >
                  <DrawerHeader>
                    <DrawerTitle>Информация о счете</DrawerTitle>
                    {selectedInvoice && (
                      <DrawerDescription className='pt-6'>
                        <div className='text-left'>
                          <p><strong>Фамилия:</strong> {selectedInvoice.lastName}</p>
                          <p><strong>Имя:</strong> {selectedInvoice.firstName}</p>
                          <p><strong>Отчество:</strong> {selectedInvoice.middleName}</p>
                          <p><strong>Возраст:</strong> {selectedInvoice.age}</p>
                          <p><strong>Город:</strong> {selectedInvoice.city}</p>
                          <p><strong>Церковь:</strong> {selectedInvoice.church}</p>
                          <p><strong>Статус оплаты:</strong> {selectedInvoice.paymentStatus}</p>
                        </div>
                      </DrawerDescription>
                    )}
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button onClick={handlePaymentConfirmation} variant="outline">Подтвердить оплату</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Закрыть</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </motion.div>
              </DrawerContent>
            </Drawer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default App;
