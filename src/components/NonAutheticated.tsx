import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Link from 'next/link'
import { Button } from './ui/button'

const NonAutheticated = () => {
  return (
    <div className="container mx-auto  flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome to the Quiz App!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Please sign in to participate in the quiz and test your knowledge.</p>
            <Link href="/signin">
              <Button className="w-full">Sign In to Start</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
  )
}

export default NonAutheticated