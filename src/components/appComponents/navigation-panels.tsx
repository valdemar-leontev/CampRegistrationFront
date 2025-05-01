import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiHome } from "react-icons/ci";
import { AiOutlineQuestion } from "react-icons/ai";
import { useTabStore } from "../../stores/TabStore.ts";
import { PiCards } from "react-icons/pi";
import { GoChecklist } from "react-icons/go";
import { useUserStore } from '@/stores/UserStore.ts';
import { FiUsers, FiPieChart, FiSettings } from "react-icons/fi";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";
import { CiExport } from "react-icons/ci";


export const NavigationPanels = () => {
  const { activeTab, setActiveTab } = useTabStore();
  const { user } = useUserStore();

  return (
    user && (
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full px-2 !mb-2"
      >
        <TabsList className="bg-white flex gap-1 h-full rounded-full shadow-xl">
          <TabsTrigger value="home" className="p-5 px-5 data-[state=active]:bg-gray-900">
            <CiHome size={22} />
          </TabsTrigger>

          <TabsTrigger value="myRequests" className="p-5 px-5 data-[state=active]:bg-gray-900">
            <GoChecklist size={22} />
          </TabsTrigger>

          <TabsTrigger value="info" className="p-5 px-5 data-[state=active]:bg-gray-900">
            <PiCards size={22} />
          </TabsTrigger>

          <TabsTrigger value="faq" className="p-5 px-5 data-[state=active]:bg-gray-900">
            <AiOutlineQuestion size={22} />
          </TabsTrigger>

          {user.admins.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className={`
          p-5 px-5 rounded-full cursor-pointer transition-all duration-300
          ${['accountingPage', 'statistics'].includes(activeTab)
                      ? 'bg-black text-white'
                      : ' !bg-white text-black'}
          hover:bg-gray-800
        `}>
                    <FiSettings size={22} />
                  </div>
                </motion.div>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                sideOffset={10}
                className="w-48 p-2 rounded-xl shadow-xl border-none bg-white"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-1"
                >
                  <TabsTrigger
                    value="accountingPage"
                    className={`justify-start gap-3 !px-2 rounded-2xl transition-all ${activeTab === 'accountingPage' ? 'bg-gray-100 font-medium scale-110' : 'hover:bg-gray-50'
                      }`}
                    onClick={() => setActiveTab("accountingPage")}
                  >
                    <FiUsers size={18} />
                    <span>Заявки</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="statistics"
                    className={`justify-start gap-3 !px-2 rounded-2xl transition-all ${activeTab === 'statistics' ? 'bg-gray-100 font-medium scale-110' : 'hover:bg-gray-50'
                      }`}
                    onClick={() => setActiveTab("statistics")}
                  >
                    <FiPieChart size={18} />
                    <span>Статистика</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="export"
                    className={`justify-start gap-3 !px-2 rounded-2xl transition-all ${activeTab === 'export' ? 'bg-gray-100 font-medium scale-110' : 'hover:bg-gray-50'
                      }`}
                    onClick={() => setActiveTab("export")}
                  >
                    <CiExport size={18} />
                    <span>Выгрузка</span>
                  </TabsTrigger>
                </motion.div>
              </PopoverContent>
            </Popover>
          )}
        </TabsList>
      </Tabs>
    )
  );
};