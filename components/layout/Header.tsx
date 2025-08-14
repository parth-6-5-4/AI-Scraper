import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Bot } from 'lucide-react'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">AI Scraper Pro</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/jobs" className="transition-colors hover:text-primary">
              Jobs
            </Link>
          </nav>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 p-4">
                <Link href="/" className="flex items-center gap-2 font-bold">
                  <Bot className="h-6 w-6 text-primary" />
                  <span>AI Scraper Pro</span>
                </Link>
                <nav className="grid gap-2">
                  <Link href="/dashboard" className="py-2 transition-colors hover:text-primary">
                    Dashboard
                  </Link>
                  <Link href="/jobs" className="py-2 transition-colors hover:text-primary">
                    Jobs
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
