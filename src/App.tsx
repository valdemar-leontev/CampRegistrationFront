import { FC, useState } from 'react';
import './App.css';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import { Button } from './components/ui/button';



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
  { lastName: 'Иванов', firstName: 'Иван', middleName: 'Иванович', age: 30, city: 'Москва', church: 'Церковь Святого Петра', paymentStatus: 'Скинул скрин' },
  { lastName: 'Петров', firstName: 'Петр', middleName: 'Петрович', age: 25, city: 'Санкт-Петербург', church: 'Церковь Спаса', paymentStatus: 'Не оплачено' },
  { lastName: 'Сидоров', firstName: 'Сидор', middleName: 'Сидорович', age: 35, city: 'Новосибирск', church: 'Церковь Успения', paymentStatus: 'Скинул скрин' },
  { lastName: 'Кузнецов', firstName: 'Алексей', middleName: 'Алексеевич', age: 40, city: 'Екатеринбург', church: 'Церковь Святого Николая', paymentStatus: 'Оплачено' },
  { lastName: 'Смирнов', firstName: 'Дмитрий', middleName: 'Дмитриевич', age: 28, city: 'Казань', church: 'Церковь Казанской иконы', paymentStatus: 'Не оплачено' },
  { lastName: 'Попов', firstName: 'Анатолий', middleName: 'Анатолиевич', age: 33, city: 'Челябинск', church: 'Церковь Святой Троицы', paymentStatus: 'Оплачено' },
  { lastName: 'Васильев', firstName: 'Сергей', middleName: 'Сергеевич', age: 29, city: 'Нижний Новгород', church: 'Церковь Святого Георгия', paymentStatus: 'Оплачено' },
  { lastName: 'Зайцев', firstName: 'Олег', middleName: 'Олегович', age: 31, city: 'Ростов-на-Дону', church: 'Церковь Святого Иоанна', paymentStatus: 'Не оплачено' },
];

const App: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  return (
    <>
      <Tabs defaultValue="account">
        <TabsList >
          <TabsTrigger value="Детский">Детский</TabsTrigger>
          <TabsTrigger value="Подростковый">Подростковый</TabsTrigger>
          <TabsTrigger value="Отец и сын">Отец и сын</TabsTrigger> 
          {/* <TabsTrigger value="Семейный">Семейный</TabsTrigger> */}
          {/* <TabsTrigger value="Молодежный">Молодежный</TabsTrigger>  */}
        </TabsList>
        <TabsContent value="Детский">
          <div>
            <Table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <TableHeader>
                <TableRow className="bg-gray-100 border-b">
                  <TableHead className="py-3 px-4 text-left text-gray-600">Фамилия</TableHead>
                  <TableHead className="py-3 px-4 text-left text-gray-600">Имя</TableHead>
                  <TableHead className="py-3 px-4 text-left text-gray-600">Отчество</TableHead>
                  <TableHead className="py-3 px-4 text-right text-gray-600">Возраст</TableHead>
                  <TableHead className="py-3 px-4 text-left text-gray-600">Город</TableHead>
                  <TableHead className="py-3 px-4 text-left text-gray-600">Церковь</TableHead>
                  <TableHead className="py-3 px-4 text-left text-gray-600">Статус оплаты</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice, index) => (
                  <TableRow key={index} className="border-b hover:bg-gray-50 transition-colors duration-200">
                    <TableCell className="py-2 px-4" onClick={() => setIsDrawerOpen(true)}>{invoice.lastName}</TableCell>
                    <TableCell className="py-2 px-4" onClick={() => setIsDrawerOpen(true)}>{invoice.firstName}</TableCell>
                    <TableCell className="py-2 px-4" onClick={() => setIsDrawerOpen(true)}>{invoice.middleName}</TableCell>
                    <TableCell className="py-2 px-4" onClick={() => setIsDrawerOpen(true)}>{invoice.age}</TableCell>
                    <TableCell className="py-2 px-4" onClick={() => setIsDrawerOpen(true)}>{invoice.city}</TableCell>
                    <TableCell className="py-2 px-4" onClick={() => setIsDrawerOpen(true)}>{invoice.church}</TableCell>
                    <TableCell className="py-2 px-4" onClick={() => setIsDrawerOpen(true)}>{invoice.paymentStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} >
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                  <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </TabsContent>
      </Tabs>



    </>

  );
};

export default App;
