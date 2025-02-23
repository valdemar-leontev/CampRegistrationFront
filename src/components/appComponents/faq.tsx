import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const fadeInUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.3, ease: "easeOut" } },
});

const FAQ = () => {
  const questions = [
    { value: "price", question: "Сколько стоит лагерь?", answer: "50 рублей" },
    { value: "types", question: "Какие есть лагеря?", answer: <ul className="list-disc ml-4"><li>Детский</li><li>Подростковый</li><li>Отец и сын</li><li>Молодежный</li><li>Семейный</li></ul> },
    { value: "pickup", question: "Откуда будут забирать участников?", answer: "Деревня Криуши" },
    { value: "process", question: "Как проходит лагерь?", answer: "Всем нравится" },
    { value: "location", question: "Где проходят лагеря?", answer: "Остров возле деревни Криуши" },
    { value: "age", question: "Для какого возраста подходят лагеря?", answer: "У нас есть программы для детей от 7 лет, подростков, молодежи, а также общий семейный отдых." },
    { value: "safety", question: "Какие меры безопасности предусмотрены?", answer: "В лагере есть медицинский персонал, проверенные вожатые и строгий контроль за безопасностью участников." },
    { value: "other1", question: "Еще вопрос", answer: "Еще ответ" },
    { value: "other2", question: "Еще вопрос", answer: "Еще ответ" },
    { value: "other3", question: "Еще вопрос", answer: "Еще ответ" },
    { value: "other4", question: "Еще вопрос", answer: "Еще ответ" },
    { value: "other5", question: "Еще вопрос", answer: "Еще ответ" },
    { value: "other6", question: "Еще вопрос1", answer: "Еще ответ" },
  ];

  return (
    <div className="max-w-2xl text-left px-6">
      <motion.h1 
        className="text-3xl font-bold text-center mb-4"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Часто задаваемые вопросы
      </motion.h1>

      <Accordion type="single" collapsible className='overflow-auto h-[57vh]'>
        {questions.map((item, index) => (
          <motion.div 
            key={item.value} 
            variants={fadeInUp(index * 0.1)} 
            initial="hidden" 
            animate="visible"
          >
            <AccordionItem value={item.value}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
