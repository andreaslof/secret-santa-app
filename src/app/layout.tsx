import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Secret Santa App',
  description: 'A simple secret santa gift exchange app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="grid justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
          {children}
        </div>
      </body>
    </html>
  )
}
