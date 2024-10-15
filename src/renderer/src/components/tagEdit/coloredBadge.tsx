import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Badge, BadgeProps } from '../ui/badge'

const badgeVariants = cva('pl-3 pr-1 py-1 rounded-full', {
  variants: {
    color: {
      default: 'bg-neutral-500 hover:bg-neutral-600',
      red: 'bg-red-500 hover:bg-red-600',
      rose: 'bg-rose-500 hover:bg-rose-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
      yellow: 'bg-yellow-500 hover:bg-yellow-600',
      lime: 'bg-lime-500 hover:bg-lime-600',
      green: 'bg-green-500 hover:bg-green-600',
      emerald: 'bg-emerald-500 hover:bg-emerald-600',
      cyan: 'bg-cyan-500 hover:bg-cyan-600',
      blue: 'bg-blue-500 hover:bg-blue-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      pink: 'bg-pink-500 hover:bg-pink-600',
      slate: 'bg-slate-500 hover:bg-slate-600',
      gray: 'bg-gray-500 hover:bg-gray-600',
      zinc: 'bg-zinc-500 hover:bg-zinc-600',
      stone: 'bg-stone-500 hover:bg-stone-600'
    }
  },
  defaultVariants: {
    color: 'default'
  }
})

type ColoredBadgeProps = BadgeProps &
  VariantProps<typeof badgeVariants> & {
    tagProperties: Tag
    addTag(tag: Tag): void
  }

function ColoredBadge({ tagProperties, addTag, className, color, ...props }: ColoredBadgeProps) {
  return (
    <Badge className={cn(badgeVariants({ color }), className)} {...props}>
      <button className="flex flex-row flex-grow pr-2" onClick={() => addTag(tagProperties)}>
        {tagProperties.tag}
      </button>
    </Badge>
  )
}
export default ColoredBadge
