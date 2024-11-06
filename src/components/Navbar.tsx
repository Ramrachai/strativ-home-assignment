'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavBar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-background text-foreground py-4 border-b shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Quiz App</Link>
        <div className='flex items-center space-x-4'>
          {session ? (
            <>
              <div className='hidden md:flex items-center space-x-4'>
                {session.user?.role === 'admin' && (
                  <Link href="/admin/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                )}
                <div className='flex flex-col items-end'>
                  <p className='text-sm font-medium'>{session?.user?.name}</p>
                  <p className='text-xs text-muted-foreground'>{session?.user?.email}</p>
                </div>
                <Button variant="default" onClick={() => signOut()}>Sign Out</Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <p className='font-medium'>{session?.user?.name}</p>
                    <p className='text-xs text-muted-foreground'>{session?.user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {session.user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/signin">
              <Button variant="default">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}