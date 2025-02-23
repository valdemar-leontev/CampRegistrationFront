import { FC, useEffect, useState } from 'react';
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
import { NavigationPanels } from './components/appComponents/navigation-panels';
import { GiCampingTent } from "react-icons/gi";
import drawerImage1 from './assets/draweImage-1.svg'
import drawerImage2 from './assets/draweImage-2.svg'
import drawerImage3 from './assets/draweImage-3.svg'
import drawerImage4 from './assets/draweImage-4.svg'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CiBellOn } from "react-icons/ci";
import { Skeleton } from './components/ui/skeleton';


const drawerImages = [drawerImage1, drawerImage2, drawerImage3, drawerImage4];

interface Invoice {
  lastName: string;
  firstName: string;
  age: number;
  city: string;
  church: string;
  paymentStatus: string;
}

const invoices: Invoice[] = [
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Оплатил' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Оплатил' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
  { lastName: 'Леонтьев', firstName: 'Владимир', age: 22, city: 'Казань', church: 'Новая Жизнь', paymentStatus: 'Скинул скрин' },
];

const App: FC<{ user: any }> = ({ user }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [randomImage, setRandomImage] = useState<string>(drawerImages[0]);


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

  useEffect(() => {
    console.log(user);
  }, [])


  return (
    <div className='bg-white'>
      <div className='flex items-center gap-4 mb-10 justify-between'>
        <div className='flex items-center gap-4'>
          {!user.photo_url ? <Skeleton className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-2xl" /> :
            <Avatar>
              <AvatarImage src={user.photo_url} />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>}
          <div className='flex flex-col text-left'>
            <h1 className='text-[18px] font-bold'>{user ? `${user.last_name} ${user.first_name}` : 'Test user'}</h1>
            <h1 className='text-[#c448a4] font-bold text-[16px]'>Администратор</h1>
          </div>
        </div>

        <motion.div
          className="w-14 h-14 rounded-full shadow flex justify-center items-center cursor-pointer"
          whileTap={{ scale: 0.8, opacity: 0.7 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <CiBellOn size={30} />
        </motion.div>
      </div>

      <>
        <div className='flex items-center gap-2 justify-center mb-3'>
          <h1 className='text-[22px] font-bold magic-font'>УЧЕТ ЛЕТНЕГО ОТДЫХА</h1>
          <GiCampingTent size={30} />
        </div>

        <Tabs defaultValue="Детский" >
          <TabsList className="overflow-x-auto overflow-y-hidden whitespace-nowrap flex gap-2 w-full px-2 scrollbar-hide justify-start pl-2 py-8 ">
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
                  <TableRow className="bg-[#e7fe55] !border-none">
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
                      <Button onClick={handlePaymentConfirmation} variant="outline" className='bg-[#e7fe55] text-black border-none'>Подтвердить оплату</Button>
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
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.5 }}
      >
        <NavigationPanels />
      </motion.div>

    </div >

  );
};

export default App;