import apiClient from '@/axios';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { IFaq } from '@/models/IFaq';
import Typography from '@mui/material/Typography';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

const fadeInUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.3, ease: "easeOut" } },
});

const defaultFaqItems: IFaq[] = [
  {
    id: 1,
    question: "Если ребёнку 6 лет, сколько оплата?",
    answer: "С 2 лет до 6 лет включительно - скидка 50%."
  },
  {
    id: 2,
    question: "Со скольки лет подростковый лагерь? Детский? Молодёжный?",
    answer: `- **Детский**: 7-12 лет (6 лет с сопровождением)\n- **Подростковый**: 12-16 лет (12 лет только с регистрацией в детский)\n- **Молодежный**: от 16 лет (15 лет только с регистрацией в подростковый)`
  },
  {
    id: 3,
    question: "Во сколько заезд лагеря (выезд)?",
    answer: "Заезд в 10:00, выезд в 16:00.\n\n📍 Геолокация: [ссылка на карту](#)"
  },
  {
    id: 4,
    question: "Номера ответственных",
    answer: "📞 Контакты:\n- Филипп: +7 (XXX) XXX-XX-XX\n- Илья: +7 (XXX) XXX-XX-XX"
  },
  {
    id: 5,
    question: "Куда нужно приехать?",
    answer: "📍 Геолокация: [ссылка на карту](#)\n\nАдрес: ул. Примерная, д. 123"
  },
  {
    id: 6,
    question: "Что брать в детский лагерь? (Подростковый)",
    answer: "**Обязательно:**\n- Документы\n- Средства гигиены\n- Одежда по погоде\n\n**Рекомендуемо:**\n- Крем от солнца\n- Купальные принадлежности"
  },
  {
    id: 7,
    question: "Для гостей (что нужно взять для спальных принадлежностей)?",
    answer: "Для гостей, кто едет с других городов, будут выданы:\n- Постельное белье\n- Матрас\n- Подушка"
  },
  {
    id: 8,
    question: "Я купил путёвку ребёнку (или взрослому) и он не поедет в лагерь из-за болезни",
    answer: "В случае болезни необходимо:\n1. Предоставить медицинскую справку\n2. Написать заявление на возврат\n3. Возврат осуществляется в течение 10 рабочих дней"
  }
];

const FAQ = () => {
  const [faqItems, setFaqItems] = useState<IFaq[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await apiClient.get('faqs');
        setFaqItems(response.data.length ? response.data : defaultFaqItems);
      } catch (error) {
        setFaqItems(defaultFaqItems);
      }
    })()
  }, []);

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
        {faqItems.map((item, index) => (
          <motion.div
            key={item.id}
            variants={fadeInUp(index * 0.1)}
            initial="hidden"
            animate="visible"
          >
            <AccordionItem value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <MarkdownRenderer content={item.answer} />
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>

      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: faqItems.length * 0.1 + 0.2, duration: 0.3, ease: "easeOut" }}
      >
        <Typography className="inline-block !mr-1">
          Остались вопросы?
        </Typography>
        <a
          href="https://t.me/Shipov14"
          className="text-blue-500 hover:text-blue-700 underline transition-colors duration-200"
        >
          Свяжитесь с нами
        </a>
      </motion.div>
    </div>
  );
};

export default FAQ;