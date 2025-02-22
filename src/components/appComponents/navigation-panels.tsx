import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiViewTable } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoBarChartOutline } from "react-icons/io5";

export const NavigationPanels = () => {
  return (
    <Tabs defaultValue="Детский" className="fixed bottom-3 left-1/2 transform -translate-x-1/2 w-[95%] mb-2 h-20">
      <TabsList className="flex gap-1 h-full px-6 rounded-full shadow-xl">
        <TabsTrigger value="Детский" className="p-4 px-8 data-[state=active]:px-20"><CiViewTable size={22} /></TabsTrigger>
        <TabsTrigger value="Подростковый" className="p-4 px-8 data-[state=active]:px-20"><CiCalendarDate size={22} /></TabsTrigger>
        <TabsTrigger value="Отец и сын" className="p-4 px-8 data-[state=active]:px-20"><IoBarChartOutline size={22} /></TabsTrigger>
      </TabsList>
      <TabsContent value="Детский">
        {/* <App /> */}
      </TabsContent>
    </Tabs>
  );
};
