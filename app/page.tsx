import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl mx-auto glass rounded-2xl shadow-2xl shadow-blue-500/10">
        <div className="p-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight text-gradient">
            AI Scraper Pro
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Effortlessly extract and analyze web data with the power of AI.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary/80 hover:bg-primary">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="bg-transparent hover:bg-white/5">
                View Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
