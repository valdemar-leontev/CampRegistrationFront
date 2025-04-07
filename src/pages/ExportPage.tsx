"use client"

import { DownloadCloud, FileText, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import apiClient from '@/axios'

export const ExportPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    setProgress(0)
    setIsComplete(false)

    // Имитация процесса выгрузки
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 300)

    try {
      // Замените на реальный API-вызов
      await apiClient.post('/export/excel', { /* параметры */ })

      clearInterval(interval)
      setProgress(100)
      setIsComplete(true)

      // toast.success("Файл успешно сформирован", {
      //   description: "Данные готовы к скачиванию",
      //   action: {
      //     label: "Скачать",
      //     onClick: () => window.open('/download/excel', '_blank')
      //   }
      // })
    } catch (error) {
      clearInterval(interval)
      // toast.error("Ошибка при выгрузке", {
      //   description: "Попробуйте еще раз позже"
      // })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-500" />
          <span>Экспорт данных</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600">Выберите формат и параметры экспорта:</p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="border rounded-lg p-3 hover:border-blue-400 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium">Excel (.xlsx)</span>
                </div>
              </div>

              <div className="border rounded-lg p-3 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <span className="font-medium text-gray-400">PDF (скоро)</span>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Формирование файла...</span>
                  <span>{progress}%</span>
                </div>
                {/* <Progress value={progress} className="h-2" /> */}
              </motion.div>
            ) : isComplete ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 rounded-lg p-4 text-center"
              >
                <div className="flex flex-col items-center">
                  <DownloadCloud className="h-8 w-8 text-green-500 mb-2" />
                  <p className="font-medium text-green-800">Файл готов!</p>
                  <p className="text-sm text-green-600 mt-1">
                    Нажмите кнопку ниже чтобы скачать
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <Button
            onClick={handleExport}
            disabled={isLoading}
            size="lg"
            className="w-full rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Формируем файл...
              </>
            ) : isComplete ? (
              <>Скачать Excel файл</>
            ) : (
              <>Экспортировать в Excel</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}