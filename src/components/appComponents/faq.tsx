import apiClient from '@/axios';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { IFaq } from '@/models/IFaq';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';

const fadeInUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.3, ease: "easeOut" } },
});

const FAQ = () => {
  const [faqItems, setFaqItems] = useState<IFaq[]>([])

  useEffect(() => {
    (async () => {
      const response = await apiClient.get('faqs');

      setFaqItems(response.data);
    })() 
  }, [])
  

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
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
