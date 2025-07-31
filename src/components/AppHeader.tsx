import { SidebarTrigger } from '@/components/ui/sidebar'

type AppHeaderProps = {
  title: string
  children?: React.ReactNode
}

export function AppHeader({ title, children }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </header>
  )
}
