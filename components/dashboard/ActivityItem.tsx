import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, Loader } from 'lucide-react'

interface ActivityItemProps {
  status: 'COMPLETED' | 'FAILED' | 'RUNNING'
  description: string
  time: string
}

const statusStyles = {
  COMPLETED: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  FAILED: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  RUNNING: {
    icon: Loader,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    animate: 'animate-spin',
  },
}

const ActivityItem = ({ status, description, time }: ActivityItemProps) => {
  const { icon: Icon, color, bgColor, animate } = statusStyles[status]

  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg glass-hover transition-all duration-300">
      <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', bgColor)}>
        <Icon className={cn('h-5 w-5', color, animate)} />
      </div>
      <div className="flex-grow">
        <p className="text-sm text-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  )
}

export default ActivityItem
