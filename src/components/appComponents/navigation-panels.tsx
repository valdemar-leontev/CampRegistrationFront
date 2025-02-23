import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiViewTable, CiCalendarDate, CiHome } from "react-icons/ci";
import { AiOutlineQuestion } from "react-icons/ai";
import FAQ from "./faq";
import { useTabStore } from "../../stores/TabStore.ts";

export const NavigationPanels = () => {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[95%] mb-2 h-20">
      {activeTab === "Отец и сын" && (
        <div className="absolute bottom-full left-0 w-full mb-3">
          <FAQ />
        </div>
      )}
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#e7fe55] flex gap-1 h-full px-6 rounded-full shadow-xl">
          <TabsTrigger value="1" className="p-5 px-7 data-[state=active]:px-8">
            <CiHome size={22} />
          </TabsTrigger>
          <TabsTrigger value="Детский" className="p-5 px-7 data-[state=active]:px-10">
            <CiViewTable size={22} />
          </TabsTrigger>
          <TabsTrigger value="Подростковый" className="p-5 px-7 data-[state=active]:px-10">
            <CiCalendarDate size={22} />
          </TabsTrigger>
          <TabsTrigger value="Отец и сын" className="p-5 px-7 data-[state=active]:px-10">
            <AiOutlineQuestion size={22} />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
