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
import { motion } from 'framer-motion';
import { invoices } from '@/constants';
import { Button } from '@/components/ui/button';
import drawerImage1 from '../assets/draweImage-1.svg'
import drawerImage2 from '../assets/draweImage-2.svg'
import drawerImage3 from '../assets/draweImage-3.svg'
import drawerImage4 from '../assets/draweImage-4.svg'
import { useEffect, useState } from 'react';
import { Invoice } from '@/types';
import apiClient from '@/axios';
import { useUserStore } from '@/stores/UserStore';

const drawerImages = [drawerImage1, drawerImage2, drawerImage3, drawerImage4];
interface IRegistration {
  id: number;
  name: string;
  lastName: string;
  birthdate: string;
  city: string;
  registrationDate: string;
  userId: number;
  registrationStatusId: number;
  paymentTypeId: number;
  adminId: number;
  registrationLinkPrice: {
    price: {
      campId: number;
      camp: {
        name: string;
      };
      value: number;
    };
  }[];
  paymentType: {
    name: string;
  };
  registrationStatus: {
    name: string;
  };
}

export const AccountingPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [randomImage, setRandomImage] = useState<string>(drawerImages[0]);

  const { user } = useUserStore();

  const [registratinList, setRegistrationList] = useState<IRegistration[]>([])

  useEffect(() => {
    (async () => {
      const response = await apiClient.get<IRegistration[]>(`users/${user!.id}/registrations`);

      setRegistrationList(response.data);
    })()
  }, [])

  const handleRowClick = (invoice: Invoice) => {
    const randomIndex = Math.floor(Math.random() * drawerImages.length);
    setRandomImage(drawerImages[randomIndex]);
    setSelectedInvoice(invoice);

    setTimeout(() => {
      setIsDrawerOpen(true);
    }, 50);
  };

  const handlePaymentConfirmation = () => {
    if (selectedInvoice) {
      console.log(`Оплата подтверждена для: ${selectedInvoice.firstName} ${selectedInvoice.lastName}`);
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      const randomIndex = Math.floor(Math.random() * drawerImages.length);
      setRandomImage(drawerImages[randomIndex]);
    }
  }, [isDrawerOpen]);

  return (
    <>
      <Tabs defaultValue="Детский">
        <TabsList className="overflow-x-auto overflow-y-hidden whitespace-nowrap flex gap-2 w-full px-2 scrollbar-hide justify-start pl-2 py-8">
          <TabsTrigger value="Детский">Детский</TabsTrigger>
          <TabsTrigger value="Подростковый">Подростковый</TabsTrigger>
          <TabsTrigger value="Отец и сын">Отец и сын</TabsTrigger>
          <TabsTrigger value="Общий">Общий</TabsTrigger>
          <TabsTrigger value="Молодежный">Молодежный</TabsTrigger>
        </TabsList>

        <TabsContent value="Детский">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <Table className="bg-white border shadow-md border-transparent">
              <TableHeader>
                <TableRow className="bg-blue-100 !border-none">
                  <TableHead className="py-3 px-4 font-bold text-center text-[16px] rounded-s-[40px]">Фамилия</TableHead>
                  <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Имя</TableHead>
                  <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Возраст</TableHead>
                  <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Город</TableHead>
                  <TableHead className="py-3 px-4 font-bold text-center text-[16px]">Церковь</TableHead>
                  <TableHead className="py-3 px-4 font-bold text-center text-[16px] text-nowrap rounded-e-[40px]">Статус оплаты</TableHead>
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
                    <TableCell className="py-2 px-4">{invoice.age}</TableCell>
                    <TableCell className="py-2 px-4">{invoice.city}</TableCell>
                    <TableCell className="py-2 px-4 text-nowrap">{invoice.church}</TableCell>
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
                  <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <img src={randomImage} className="w-full h-[250px]" alt="Random" />
                  </motion.div>
                  <DrawerFooter>
                    <Button onClick={handlePaymentConfirmation} variant="outline" className='bg-[#fa704c] text-black border-none'>Подтвердить оплату</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Закрыть</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </motion.div>
              </DrawerContent>
            </Drawer>
          </motion.div>
        </TabsContent>
      </Tabs>
    </>
  )
}
