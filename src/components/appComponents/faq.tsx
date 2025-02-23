import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="max-w-2xl h-[600px] text-left p-6 overflow-auto">
      <h1 className="text-3xl font-bold text-center">Часто задаваемые вопросы</h1>
      <Accordion type="single" collapsible>
        <AccordionItem value="price">
          <AccordionTrigger>Сколько стоит лагерь?</AccordionTrigger>
          <AccordionContent>
            50 рублей
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types">
          <AccordionTrigger>Какие есть лагеря?</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc ml-4">
              <li>Детский</li>
              <li>Подростковый</li>
              <li>Отец и сын</li>
              <li>Молодежный</li>
              <li>Семейный</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pickup">
          <AccordionTrigger>Откуда будут забирать участников?</AccordionTrigger>
          <AccordionContent>
            Деревня Криуши
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="process">
          <AccordionTrigger>Как проходит лагерь?</AccordionTrigger>
          <AccordionContent>
            Всем нравится
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Где проходят лагеря?</AccordionTrigger>
          <AccordionContent>
            Остров возле деревни Криуши
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="age">
          <AccordionTrigger>Для какого возраста подходят лагеря?</AccordionTrigger>
          <AccordionContent>
            У нас есть программы для детей от 7 лет, подростков, молодежи, а также общий семейный отдых.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="safety">
          <AccordionTrigger>Какие меры безопасности предусмотрены?</AccordionTrigger>
          <AccordionContent>
            В лагере есть медицинский персонал, проверенные вожатые и строгий контроль за безопасностью участников.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="other1">
          <AccordionTrigger>Еще вопрос</AccordionTrigger>
          <AccordionContent>
            Еще ответ
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="other2">
          <AccordionTrigger>Еще вопрос</AccordionTrigger>
          <AccordionContent>
            Еще ответ
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="other3">
          <AccordionTrigger>Еще вопрос</AccordionTrigger>
          <AccordionContent>
            Еще ответ
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="other4">
          <AccordionTrigger>Еще вопрос</AccordionTrigger>
          <AccordionContent>
            Еще ответ
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="other5">
          <AccordionTrigger>Еще вопрос</AccordionTrigger>
          <AccordionContent>
            Еще ответ
          </AccordionContent>
        </AccordionItem> <AccordionItem value="other2">
          <AccordionTrigger>Еще вопрос</AccordionTrigger>
          <AccordionContent>
            Еще ответ
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="other6">
          <AccordionTrigger>Еще вопрос</AccordionTrigger>
          <AccordionContent>
            Еще ответ
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQ;