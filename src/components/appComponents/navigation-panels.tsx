import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiViewTable, CiHome } from "react-icons/ci";
import { AiOutlineQuestion } from "react-icons/ai";
import { useTabStore } from "../../stores/TabStore.ts";
import { PiCards } from "react-icons/pi";


export const NavigationPanels = () => {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[95%] mb-2 h-20">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#fa704c] flex gap-1 h-full px-6 rounded-full shadow-xl">
          <TabsTrigger value="home" className="p-5 px-7 data-[state=active]:px-8">
            <CiHome size={22} />
          </TabsTrigger>
          <TabsTrigger value="accountingPage" className="p-5 px-7 data-[state=active]:px-10">
            <CiViewTable size={22} />
          </TabsTrigger>
          <TabsTrigger value="info" className="p-5 px-7 data-[state=active]:px-10">
            <PiCards size={22} />
          </TabsTrigger>
          <TabsTrigger value="faq" className="p-5 px-7 data-[state=active]:px-10">
            <AiOutlineQuestion size={22} />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
