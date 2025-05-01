"use client"

import { FileText, Loader2, CheckCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useUserStore } from '@/stores/UserStore'
import axios from 'axios'

export const ExportPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()
  const { user } = useUserStore()
  const telegramId = user?.telegramId

  const handleExport = async () => {
    if (!telegramId) {
      toast({
        title: "Ошибка",
        description: "Не удалось определить ваш Telegram ID",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setIsComplete(false)

    try {
      await axios.post(`https://slovo-istiny-kzn.ru:7443/send-registration-journal?telegramId=${telegramId}`)
      
      setIsComplete(true)
      toast({
        title: "Файл отправлен",
        description: "Проверьте свои личные сообщения в Telegram",
      })
    } catch (error) {
      toast({
        title: "Ошибка при отправке",
        description: "Пожалуйста, попробуйте еще раз позже",
        variant: "destructive",
      })
      console.error("Export error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-500" />
          Экспорт данных
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex justify-center items-center gap-3 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Отправляем файл в Telegram...</span>
                </div>
              </motion.div>
            )}

            {isComplete && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-green-50 rounded-lg p-5 text-center border border-green-200"
              >
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mb-3" />
                  <p className="font-semibold text-green-800">Файл отправлен!</p>
                  <p className="text-sm text-green-600 mt-1">
                    Проверьте свои личные сообщения в Telegram
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleExport}
            disabled={isLoading || isComplete}
            size="lg"
            className="w-full rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Отправляем...
              </>
            ) : isComplete ? (
              <>Отправлено в Telegram</>
            ) : (
              <>Экспортировать в Telegram</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}