import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  link: string
}

const FeatureCard = ({ title, description, link }: FeatureCardProps) => {
  return (
    <Link href={link}>
      <Card className="glass glass-hover transition-all duration-300 group">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <CardDescription className="mt-1 text-muted-foreground">
                {description}
              </CardDescription>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}

export default FeatureCard
