'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar'
import {
  ChefHat,
  LayoutGrid,
  BookOpen,
  Sparkles,
  Settings,
} from 'lucide-react'
import { Button } from './ui/button'

const Logo = () => (
  <div className="flex items-center gap-2">
    <ChefHat className="h-6 w-6 text-primary" />
    <h1 className="text-lg font-bold text-primary">MealWise</h1>
  </div>
)

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" passHref>
              <SidebarMenuButton
                isActive={isActive('/')}
                tooltip="Meal Planner"
              >
                <LayoutGrid />
                <span>Meal Planner</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/recipes" passHref>
              <SidebarMenuButton
                isActive={isActive('/recipes')}
                tooltip="Recipe Library"
              >
                <BookOpen />
                <span>Recipe Library</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/smart-suggestions" passHref>
              <SidebarMenuButton
                isActive={isActive('/smart-suggestions')}
                tooltip="Smart Suggestions"
              >
                <Sparkles />
                <span>Smart Suggestions</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
