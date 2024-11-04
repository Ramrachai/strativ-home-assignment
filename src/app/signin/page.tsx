'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

export default function SignIn() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })
    if (result?.ok) {
      toast.success("Login Successful")
      router.push('/')
    } else {
      toast.error("Incorrect username or password")
      console.error('Sign in failed')
    }
  }

  const handleFill = (type: string) => {
    if (type == 'admin') {
      setUsername("admin")
      setPassword("admin1234")
    } else {
      setUsername("user")
      setPassword("user1234")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </CardContent>

        <CardFooter className='flex justify-between'>
          <Button size={'sm'} variant={'link'} onClick={() => handleFill("admin")}>admin</Button>
          <Button size={'sm'} variant={'link'} onClick={() => handleFill("user")}>user</Button>
        </CardFooter>
      </Card>
    </div>
  )
}