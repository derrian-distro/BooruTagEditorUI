import { cn } from '@/lib/utils'
import { Cross2Icon, DividerVerticalIcon } from '@radix-ui/react-icons'
import { cva, VariantProps } from 'class-variance-authority'
import { Badge, BadgeProps } from '../ui/badge'

const chipVariants = cva('pl-3 pr-1 py-1 rounded-full', {
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
      stone: 'bg-stone-500 hover:bg-stone-600',
      teal: 'bg-teal-500 hover:bg-teal-600'
    }
  },
  defaultVariants: {
    color: 'default'
  }
})

const crossVariants = cva('w-[20px] h-[20px] rounded-full items-center justify-center flex', {
  variants: {
    color: {
      default: 'hover:bg-neutral-700',
      red: 'hover:bg-red-700',
      rose: 'hover:bg-rose-700',
      orange: 'hover:bg-orange-700',
      yellow: 'hover:bg-yellow-700',
      lime: 'hover:bg-lime-700',
      green: 'hover:bg-green-700',
      emerald: 'hover:bg-emerald-700',
      cyan: 'hover:bg-cyan-700',
      blue: 'hover:bg-blue-700',
      purple: 'hover:bg-purple-700',
      pink: 'hover:bg-pink-700',
      slate: 'hover:bg-slate-700',
      gray: 'hover:bg-gray-700',
      zinc: 'hover:bg-zinc-700',
      stone: 'hover:bg-stone-700',
      teal: 'hover:bg-teal-700'
    }
  },
  defaultVariants: {
    color: 'default'
  }
})

type ChipProps = BadgeProps &
  VariantProps<typeof chipVariants> &
  VariantProps<typeof crossVariants> & {
    tagProperties: Tag
    updateSearch(tagProperties: Tag, mode: 'tag' | 'group'): void
    handleDelete(tag: Tag): void
  }

function Chip({
  tagProperties,
  updateSearch,
  handleDelete,
  color,
  className,
  ...props
}: ChipProps) {
  return (
    <Badge className={cn(chipVariants({ color }), className, 'cursor-move')} {...props}>
      <button
        className="flex flex-row flex-grow"
        onClick={() => updateSearch(tagProperties, 'tag')}
        onAuxClick={() => updateSearch(tagProperties, 'group')}
      >
        {tagProperties.tag}
      </button>
      <div className="w-[10px] h-[20px] rounded-full items-center justify-center flex">
        <DividerVerticalIcon transform="scale(1 2.5) translate (3 0)" />
      </div>
      <button className={crossVariants({ color })} onClick={() => handleDelete(tagProperties)}>
        <Cross2Icon transform="translate(1 0)" />
      </button>
    </Badge>
  )
}
export default Chip
