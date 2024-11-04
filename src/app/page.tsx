'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useQuizStore } from '@/zustand/quizStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import NonAutheticated from '@/components/NonAutheticated'
import Loader from '@/components/Loader'

export default function Home() {
  const { data: session } = useSession()
  const { questions, answers, addAnswer, editAnswer, initializeQuestions, resetUserProgress } = useQuizStore()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeQuestions()
    setIsLoading(false)
  }, [initializeQuestions])

  useEffect(() => {
    if (session && questions.length > 0) {
      const userAnswers = answers.filter(a => a.userId === session.user?.email)
      if (userAnswers.length > 0) {
        const lastAnsweredIndex = questions.findIndex(q => q.id === userAnswers[userAnswers.length - 1].questionId)
        setCurrentQuestionIndex(lastAnsweredIndex + 1)
        const initialSelectedAnswers = userAnswers.reduce((acc, answer) => {
          acc[answer.questionId] = answer.answer
          return acc
        }, {} as { [key: string]: string })
        setSelectedAnswers(initialSelectedAnswers)
      }
    }
  }, [session, questions, answers])

  const handleAnswer = (direction: 'next' | 'prev') => {
    if (session?.user?.email && currentQuestion) {
      const currentAnswer = selectedAnswers[currentQuestion.id]
      if (currentAnswer) {
        const existingAnswer = answers.find(
          (a) => a.questionId === currentQuestion.id && a.userId === session.user.email
        )

        if (existingAnswer) {
          editAnswer(currentQuestion.id, session.user.email, currentAnswer)
        } else {
          addAnswer({
            questionId: currentQuestion.id,
            userId: session.user.email,
            answer: currentAnswer,

          })
        }
      }

      if (direction === 'next') {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
        } else {
          setQuizCompleted(true)
        }
      } else {
        setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
      }
    }
  }

  const calculateScore = () => {
    let score = 0
    answers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId)
      if (question && answer.answer === question.correctAnswer) {
        score++
      }
    })
    return score
  }

  const resetQuiz = () => {
    if (session?.user?.email) {
      resetUserProgress(session.user.email)
      setCurrentQuestionIndex(0)
      setSelectedAnswers({})
      setQuizCompleted(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-[80vh]'>
        <Loader />
      </div>
    )
  }

  if (!session) {
    return <NonAutheticated />
  }

  const currentQuestion = questions[currentQuestionIndex]

  if (quizCompleted) {
    const score = calculateScore()
    return (
      <div className="container max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your score: {score} out of {questions.length}</p>
            <p>Percentage: {((score / questions.length) * 100).toFixed(2)}%</p>
            <Button onClick={resetQuiz} className="mt-4">
              Restart Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto max-w-sm p-4">
        <Card>
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There are currently no questions in the quiz. Please check back later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{currentQuestion.text}</p>
          <RadioGroup
            value={selectedAnswers[currentQuestion.id] || ''}
            onValueChange={(value) => setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: value })}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => handleAnswer('prev')}
              disabled={currentQuestionIndex === 0}
            >
              Prev
            </Button>
            <Button
              onClick={() => handleAnswer('next')}
              disabled={!selectedAnswers[currentQuestion.id]}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}