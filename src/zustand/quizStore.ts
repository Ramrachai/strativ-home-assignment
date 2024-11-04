import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { sampleQuestions } from '@/data/sampleQuiz'

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
}

interface Answer {
  questionId: string
  userId: string
  answer: string

}

interface QuizStore {
  questions: Question[]
  answers: Answer[]
  addQuestion: (question: Question) => void
  editQuestion: (id: string, updatedQuestion: Partial<Question>) => void
  deleteQuestion: (id: string) => void
  addAnswer: (answer: Answer) => void
  editAnswer: (questionId: string, userId: string, newAnswer: string) => void
  initializeQuestions: () => void
  resetUserProgress: (userId: string) => void
}

export const useQuizStore = create(
  persist<QuizStore>(
    (set) => ({
      questions: [],
      answers: [],
      addQuestion: (question) =>
        set((state) => ({ questions: [...state.questions, question] })),
      editQuestion: (id, updatedQuestion) =>
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === id ? { ...q, ...updatedQuestion } : q
          ),
        })),
      deleteQuestion: (id) =>
        set((state) => ({
          questions: state.questions.filter((q) => q.id !== id),
          answers: state.answers.filter((a) => a.questionId !== id),
        })),
      addAnswer: (answer) =>
        set((state) => ({ answers: [...state.answers, answer] })),
      editAnswer: (questionId, userId, newAnswer) =>
        set((state) => ({
          answers: state.answers.map((a) =>
            a.questionId === questionId && a.userId === userId
              ? { ...a, answer: newAnswer}
              : a
          ),
        })),
      initializeQuestions: () =>
        set((state) => ({
          questions: state.questions.length === 0 ? sampleQuestions : state.questions,
        })),
      resetUserProgress: (userId) =>
        set((state) => ({
          answers: state.answers.filter((a) => a.userId !== userId),
        })),
    }),
    {
      name: 'quiz-store',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)