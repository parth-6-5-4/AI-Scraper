import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto glass">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Scraper Pro. All rights reserved.
        </p>
        <nav className="flex items-center gap-4">
          <Link href="#" className="text-sm hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm hover:text-primary transition-colors">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
