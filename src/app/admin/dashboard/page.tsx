'use client'

import { useState, useId } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/zustand/quizStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const { questions, addQuestion, editQuestion, deleteQuestion } = useQuizStore()
  const [newQuestion, setNewQuestion] = useState({ text: '', options: ['', '', '', ''], correctAnswer: '' })
  const ID = useId()

  if (session?.user?.role !== 'admin') {
    router.push('/')
    return null
  }

  const handleAddQuestion = () => {
    addQuestion({ ...newQuestion, id: ID })
    setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: '' })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Question"
            value={newQuestion.text}
            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            className="mb-2"
          />
          {newQuestion.options.map((option, index) => (
            <Input
              key={index}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const newOptions = [...newQuestion.options]
                newOptions[index] = e.target.value
                setNewQuestion({ ...newQuestion, options: newOptions })
              }}
              className="mb-2"
            />
          ))}
          <Input
            placeholder="Correct Answer"
            value={newQuestion.correctAnswer}
            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
            className="mb-2"
          />
          <Button onClick={handleAddQuestion}>Add Question</Button>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>{question.text}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 mb-2">
                {question.options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
              <p>Correct Answer: {question.correctAnswer}</p>
              <div className="flex space-x-2 mt-2">
                <Button onClick={() => editQuestion(question.id, { ...question })}>Edit</Button>
                <Button variant="destructive" onClick={() => deleteQuestion(question.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}