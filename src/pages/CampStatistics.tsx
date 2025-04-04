"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { motion, AnimatePresence } from "framer-motion"
import apiClient from '@/axios'

interface ICampStatistic {
  id: number
  name: string
  seats_limit: number
  seats_remain: number
  active_count: number
  wait_payment: number
  on_confirmation: number
  paid: number
  booked: number
}

export const CampRegistrationStats = () => {
  const [currentCampIndex, setCurrentCampIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [displayedCampIndex, setDisplayedCampIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [campStatistics, setCampStatistics] = useState<ICampStatistic[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('registrations/analytics')
        setCampStatistics(response.data)
      } catch (error) {
        console.error('Error fetching camp statistics:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const nextCamp = () => {
    if (isTransitioning || campStatistics.length === 0) return
    setDirection(1)
    setIsTransitioning(true)
    setCurrentCampIndex((prev) => (prev + 1) % campStatistics.length)
  }

  const prevCamp = () => {
    if (isTransitioning || campStatistics.length === 0) return
    setDirection(-1)
    setIsTransitioning(true)
    setCurrentCampIndex((prev) => (prev - 1 + campStatistics.length) % campStatistics.length)
  }

  useEffect(() => {
    if (currentCampIndex !== displayedCampIndex && !isTransitioning && campStatistics.length > 0) {
      setIsTransitioning(true)
    }
  }, [currentCampIndex, displayedCampIndex, campStatistics.length])

  useEffect(() => {
    if (!isTransitioning || campStatistics.length === 0) return

    const timer = setTimeout(() => {
      setDisplayedCampIndex(currentCampIndex)
      setIsTransitioning(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [isTransitioning, currentCampIndex, campStatistics.length])

  if (isLoading) {
    return (
      <Card className="flex flex-col min-h-[450px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p className="mt-4">Загрузка данных...</p>
      </Card>
    )
  }

  if (campStatistics.length === 0) {
    return (
      <Card className="flex flex-col min-h-[450px] items-center justify-center">
        <p>Нет данных для отображения</p>
      </Card>
    )
  }

  const currentCamp = campStatistics[currentCampIndex]
  const displayedCamp = campStatistics[displayedCampIndex]


  return (
    <Card className="flex flex-col !overflow-scroll">
      <CardHeader className="items-center pb-0">
        <div className="flex items-center gap-4">
          <button
            onClick={prevCamp}
            disabled={isTransitioning}
            className="p-1 rounded-full transition-colors disabled:opacity-50 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentCamp.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
              transition={{ duration: 0.3 }}
              className="text-center min-w-[200px]"
            >
              <CardTitle>{currentCamp.name}</CardTitle>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={nextCamp}
            disabled={isTransitioning}
            className="p-1 rounded-full transition-colors disabled:opacity-50 hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 items-center pb-0 min-h-[250px] ">
        {!isTransitioning && (
          <ChartContainer
            config={{
              paid: {
                label: "Одобрено",
                color: "#3b82f6",
              },
              booked: {
                label: "Резерв",
                color: "#ef4444",
              },
              free: {
                label: "Свободно",
                color: "#10b981",
              },
            }}
            className="mx-auto aspect-square w-full max-w-[250px]"
          >
            <RadialBarChart
              data={[{
                paid: displayedCamp.paid,
                booked: displayedCamp.booked,
                free: displayedCamp.seats_remain,
              }]}
              endAngle={360}
              innerRadius={80}
              outerRadius={150}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-black text-2xl font-bold"
                          >
                            {displayedCamp.seats_limit}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-black"
                          >
                            Мест всего
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="paid"
                stackId="a"
                cornerRadius={5}
                fill="#3b82f6"
                className="stroke-transparent stroke-2"
                animationBegin={0}
                animationDuration={1000}
              />
              <RadialBar
                dataKey="booked"
                stackId="a"
                cornerRadius={5}
                fill="#ef4444"
                className="stroke-transparent stroke-2"
                animationBegin={300}
                animationDuration={1000}
              />
              <RadialBar
                dataKey="free"
                stackId="a"
                cornerRadius={5}
                fill="#10b981"
                className="stroke-transparent stroke-2"
                animationBegin={900}
                animationDuration={1000}
              />
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="p-3 flex justify-between gap-2 text-xs border-t">
        <div className="flex flex-col items-center p-1">
          <div className="w-3 h-3 rounded-full bg-blue-500 mb-1"></div>
          <span className="font-medium text-blue-600">Одобрено</span>
          <span className="text-gray-600">{displayedCamp.paid}</span>
        </div>

        <div className="flex flex-col items-center p-1">
          <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
          <span className="font-medium text-green-600">Свободно</span>
          <span className="text-gray-600">{displayedCamp.seats_remain}</span>
        </div>

        <div className="flex flex-col items-center p-1">
          <div className="w-3 h-3 rounded-full bg-[#ef4444] mb-1"></div>
          <span className="font-medium text-green-600">Резерв</span>
          <span className="text-gray-600">{displayedCamp.booked}</span>
        </div>
      </CardFooter>
    </Card>
  )
}