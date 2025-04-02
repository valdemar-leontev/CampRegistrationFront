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

const camps = [
  {
    id: 1,
    name: "Детский лагерь",
    registered: 126,
    waiting: 57,
    limit: 200,
    colorRegistered: "#3b82f6", // Синий
    colorWaiting: "#f59e0b", // Оранжевый
    colorFree: "#10b981", // Зеленый
  },
  {
    id: 2,
    name: "Подростковый лагерь",
    registered: 98,
    waiting: 42,
    limit: 180,
    colorRegistered: "#3b82f6",
    colorWaiting: "#f59e0b",
    colorFree: "#10b981",
  },
  {
    id: 3,
    name: "Мужской лагерь",
    registered: 85,
    waiting: 31,
    limit: 150,
    colorRegistered: "#3b82f6",
    colorWaiting: "#f59e0b",
    colorFree: "#10b981",
  },
  {
    id: 4,
    name: "Общецерковный лагерь",
    registered: 110,
    waiting: 45,
    limit: 200,
    colorRegistered: "#3b82f6",
    colorWaiting: "#f59e0b",
    colorFree: "#10b981",
  },
  {
    id: 5,
    name: "Молодёжный лагерь",
    registered: 110,
    waiting: 38,
    limit: 180,
    colorRegistered: "#3b82f6",
    colorWaiting: "#f59e0b",
    colorFree: "#10b981",
  },
]


export const CampRegistrationStats = () => {
  const [currentCampIndex, setCurrentCampIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [displayedCampIndex, setDisplayedCampIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentCamp = camps[currentCampIndex]
  const displayedCamp = camps[displayedCampIndex]
  const totalParticipants = displayedCamp.limit
  const freeSpots = Math.max(0, displayedCamp.limit - displayedCamp.registered - displayedCamp.waiting)

  const nextCamp = () => {
    if (isTransitioning) return
    setDirection(1)
    setIsTransitioning(true)
    setCurrentCampIndex((prev) => (prev + 1) % camps.length)
  }

  const prevCamp = () => {
    if (isTransitioning) return
    setDirection(-1)
    setIsTransitioning(true)
    setCurrentCampIndex((prev) => (prev - 1 + camps.length) % camps.length)
  }

  useEffect(() => {
    if (currentCampIndex !== displayedCampIndex && !isTransitioning) {
      setIsTransitioning(true)
    }
  }, [currentCampIndex, displayedCampIndex])

  useEffect(() => {
    if (!isTransitioning) return

    const timer = setTimeout(() => {
      setDisplayedCampIndex(currentCampIndex)
      setIsTransitioning(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [isTransitioning, currentCampIndex])

  return (
    <Card className="flex flex-col min-h-[400px]">
      <div className='text-[20px] font-bold bg-red-400 text-white'>В РАЗРАБОТКЕ!!!</div>
      <CardHeader className="items-center pb-0">
        <div className="flex items-center gap-4">
          <button
            onClick={prevCamp}
            disabled={isTransitioning}
            className="p-1 rounded-full transition-colors disabled:opacity-50"
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
            className="p-1 rounded-full transition-colors disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 items-center pb-0">
        {!isTransitioning && (
          <ChartContainer
            config={{
              registered: {
                label: "Подтверждено",
                color: displayedCamp.colorRegistered,
              },
              waiting: {
                label: "На проверке",
                color: displayedCamp.colorWaiting,
              },
              free: {
                label: "Свободно",
                color: displayedCamp.colorFree,
              },
            }}
            className="mx-auto aspect-square w-full max-w-[250px]"
          >
            <RadialBarChart
              data={[{
                registered: displayedCamp.registered,
                waiting: displayedCamp.waiting,
                free: freeSpots,
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
                            {totalParticipants}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-black"
                          >
                            Участников
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="registered"
                stackId="a"
                cornerRadius={5}
                fill={displayedCamp.colorRegistered}
                className="stroke-transparent stroke-2"
                animationBegin={0}
                animationDuration={1000}
              />
              <RadialBar
                dataKey="waiting"
                fill={displayedCamp.colorWaiting}
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
                animationBegin={500}
                animationDuration={1000}
              />
              <RadialBar
                dataKey="free"
                fill={displayedCamp.colorFree}
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
                animationBegin={1000}
                animationDuration={1000}
              />
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentCamp.id}
            custom={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2 w-full"
          >
            <div className="flex justify-between leading-none text-muted-foreground">
              <span>Подтверждено: {displayedCamp.registered}</span>
              <span>На проверке: {displayedCamp.waiting}</span>
              <span>Свободно: {freeSpots}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardFooter>
    </Card>
  )
}