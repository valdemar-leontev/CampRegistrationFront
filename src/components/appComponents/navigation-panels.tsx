import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiViewTable, CiHome } from "react-icons/ci";
import { AiOutlineQuestion } from "react-icons/ai";
import { useTabStore } from "../../stores/TabStore.ts";
import { PiCards } from "react-icons/pi";
import { GoChecklist } from "react-icons/go";
import { useUserStore } from '@/stores/UserStore.ts';

export const NavigationPanels = () => {
  const { activeTab, setActiveTab } = useTabStore();
  const { user } = useUserStore();

  return (
    user && <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full px-2 !mb-4">
      <TabsList className="bg-white flex gap-1 h-full rounded-full shadow-xl ">
        <TabsTrigger value="home" className="p-5 px-5">
          <CiHome size={22} />
        </TabsTrigger>

        {user.admins.length > 0 && <TabsTrigger value="accountingPage" className="p-5 px-5">
          <CiViewTable size={22} />
        </TabsTrigger>}

        <TabsTrigger value="myRequests" className="p-5 px-5">
          <GoChecklist size={22} />
        </TabsTrigger>
        <TabsTrigger value="info" className="p-5 px-5">
          <PiCards size={22} />
        </TabsTrigger>
        <TabsTrigger value="faq" className="p-5 px-5">
          <AiOutlineQuestion size={22} />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
