'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function NavBar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-100 text-black py-2 container border-b shadow-sm">
      <div className="max-w-[80%] mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Quiz App</Link>
        <div className='flex justify-between'>
          {session ? (
            <>
              {session.user?.role === 'admin' && (
                <Link href="/admin/dashboard" className="mr-4">
                  <Button variant="outline" >Dashboard</Button>
                </Link>
              )}
              <div className='gap-2 items-center hidden sm:flex mx-2'>
                <p className='text-stone-600 text-xs'>{session?.user?.name}</p>
                <p className='text-stone-500 text-xs'>{session?.user?.email}</p>
              </div>
              <Button variant="default" onClick={() => signOut()} >Sign Out</Button>
            </>
          ) : (
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}