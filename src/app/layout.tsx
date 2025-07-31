import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'

export const metadata: Metadata = {
  title: 'MealWise',
  description: 'Organize your weekly meals and grocery shopping with ease.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}
