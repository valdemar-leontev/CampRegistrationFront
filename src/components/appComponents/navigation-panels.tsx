import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiViewTable, CiHome } from "react-icons/ci";
import { AiOutlineQuestion } from "react-icons/ai";
import { useTabStore } from "../../stores/TabStore.ts";
import { PiCards } from "react-icons/pi";


export const NavigationPanels = () => {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="fixed bottom-5 w-full px-2 mb-2 h-20 z-10">
      <TabsList className="bg-[#fa704c] flex gap-1 h-full  rounded-full shadow-xl ">
        <TabsTrigger value="home" className="p-5 ">
          <CiHome size={22} />
        </TabsTrigger>
        <TabsTrigger value="accountingPage" className="p-5 px-7 ">
          <CiViewTable size={22} />
        </TabsTrigger>
        <TabsTrigger value="info" className="p-5 px-7 ">
          <PiCards size={22} />
        </TabsTrigger>
        <TabsTrigger value="faq" className="p-5 px-7 ">
          <AiOutlineQuestion size={22} />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
