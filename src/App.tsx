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
  age: number;
  city: string;
  church: string;
  paymentStatus: string;
}

// Пример данных
const invoices: Invoice[] = [
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Оплатил' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Оплатил' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
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

      <h1 className='font-bold text-[23px] mb-5'>Учет летнего отдыха</h1>

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
                <TableRow className="border-b bg-slate-100">
                  <TableHead className="py-3 px-4 text-left">Фамилия</TableHead>
                  <TableHead className="py-3 px-4 text-left">Имя</TableHead>
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
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  <DrawerHeader>
                    <DrawerTitle>Информация о счете</DrawerTitle>
                    {selectedInvoice && (
                      <DrawerDescription className='pt-6'>
                        <div className='text-left'>
                          <p><strong>Фамилия:</strong> {selectedInvoice.lastName}</p>
                          <p><strong>Имя:</strong> {selectedInvoice.firstName}</p>
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
