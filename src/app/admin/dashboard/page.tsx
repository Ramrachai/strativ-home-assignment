'use client'

import { useState, useId, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Question, useQuizStore } from '@/zustand/quizStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const { questions, addQuestion, editQuestion, deleteQuestion } = useQuizStore()
  
  const [newQuestion, setNewQuestion] = useState({ id: '', text: '', options: ['', '', '', ''], correctAnswer: '' })
  const ID = useId()
  const [isEditing, setIsEditing] = useState(false)

  if (session?.user?.role !== 'admin') {
    router.push('/')
    return null
  }

  const handleAddOrEditQuestion = () => {
    if (isEditing) {
      editQuestion(newQuestion.id, newQuestion)
      setIsEditing(false)
    } else {
      addQuestion({ ...newQuestion, id: (questions.length + 1).toString() })
    }
    setNewQuestion({ id: '', text: '', options: ['', '', '', ''], correctAnswer: '' })
  }

  const handleEditClick = (question:Question) => {
    setNewQuestion(question)
    setIsEditing(true)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

      <div className='flex gap-4 justify-center sm:items-start flex-col sm:flex-row'>
        <div>
          <Card className="mb-4 min-w-80">
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Quiz' : 'Add New Quiz'}</CardTitle>
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
              <Button onClick={handleAddOrEditQuestion}>
                {isEditing ? 'Update Question' : 'Add Question'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {questions.slice().sort((a,b)=> parseInt(b.id) - parseInt(a.id)).map((question) => (
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
                  <Button onClick={() => handleEditClick(question)}>Edit</Button>
                  <Button variant="destructive" onClick={() => deleteQuestion(question.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
