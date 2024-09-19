"use client"

import { useState } from "react"
import { Star, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useInterviewData } from "@/hooks/useInterviewData"
import { Day, Question } from "@/types"  // Add this import

export function InterviewPracticeComponent() {
  const { data, error, isLoading } = useInterviewData()
  const [expandedDays, setExpandedDays] = useState<number[]>([])

  const toggleMarked = (dayIndex: number, questionIndex: number) => {
    if (!data) return
    const newData = [...data]
    newData[dayIndex].questions[questionIndex].marked = !newData[dayIndex].questions[questionIndex].marked
    // Note: This won't persist changes to the server. You'd need to implement that separately.
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>
  if (!data) return <div>No data available</div>


  const calculateProgress = (questions: Question[]) => {  // Update this type
    const finishedQuestions = questions.filter(q => q.finished).length
    return (finishedQuestions / questions.length) * 100
  }

  const toggleDayExpansion = (dayIndex: number) => {
    setExpandedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    )
  }

  return (
    <div className="container mx-auto p-4">
      
      {data.map((day: Day, dayIndex: number) => (
        <Card key={day.day} className="mb-4">
          <CardHeader 
            className="cursor-pointer"
            onClick={() => toggleDayExpansion(dayIndex)}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold">Day {day.day}</h2>
                {day.questions.length > 0 ? (
                  <span className="text-sm text-gray-600">
                    {day.questions.filter(q => q.finished).length}/{day.questions.length} completed
                  </span>
                ) : (
                  <Badge variant="secondary">Rest Day</Badge>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {day.questions.length > 0 && (
                  <div className="relative w-12 h-12">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200" strokeWidth="2" />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-blue-500"
                        strokeWidth="2"
                        strokeDasharray="100"
                        strokeDashoffset={100 - calculateProgress(day.questions)}
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                      {Math.round(calculateProgress(day.questions))}%
                    </div>
                  </div>
                )}
                {expandedDays.includes(dayIndex) ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardTitle>
          </CardHeader>
          {expandedDays.includes(dayIndex) && day.questions.length > 0 && (
            <CardContent>
              <ul className="space-y-2">
                {day.questions.map((question, questionIndex) => (
                  <li 
                    key={question.id} 
                    className={`flex flex-col p-3 rounded-lg ${question.finished ? 'bg-gray-100' : 'bg-white'}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex items-start sm:items-center space-x-2 sm:space-x-4 mb-2 sm:mb-0">
                        <span className="text-sm sm:text-lg font-medium w-6 sm:w-8">{questionIndex + 1}.</span>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span className="text-sm sm:text-lg">
                            {question.question.length > 30 ? `${question.question.substring(0, 30)}...` : question.question}
                          </span>
                          <Badge variant="secondary" className="mt-1 sm:mt-0 sm:ml-2 hidden sm:inline-flex">{question.tag}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMarked(dayIndex, questionIndex);
                          }}
                          className={`${question.marked ? "text-yellow-400" : "text-gray-400"}`}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Link href={`/practice/${question.id}`} passHref>
                          <Button>
                            Practice
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 sm:hidden">
                      <Badge variant="secondary">{question.tag}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}