import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: string
  trendUp?: boolean
}

export default function KpiCard({
  label, value, icon: Icon, iconColor = 'text-navy', iconBg = 'bg-navy/10',
  trend, trendUp,
}: KpiCardProps) {
  return (
    <Card className="p-5 flex items-start gap-4 shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
        <Icon className={cn('w-5 h-5', iconColor)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{label}</p>
        <p className="text-xl font-bold text-navy truncate">{value}</p>
        {trend && (
          <p className={cn('text-xs mt-0.5', trendUp ? 'text-emerald-600' : 'text-muted-foreground')}>
            {trend}
          </p>
        )}
      </div>
    </Card>
  )
}
