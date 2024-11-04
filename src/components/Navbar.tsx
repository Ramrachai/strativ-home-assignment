'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function NavBar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Quiz App</Link>
        <div>
          {session ? (
            <>
              {session.user?.role === 'admin' && (
                <Link href="/admin/dashboard" className="mr-4">
                  <Button variant="ghost">Admin Dashboard</Button>
                </Link>
              )}
              <Button variant="ghost" onClick={() => signOut()}>Sign Out</Button>
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