import { SessionProvider } from 'next-auth/react'
import { NavBar } from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Toaster />
          <NavBar />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}