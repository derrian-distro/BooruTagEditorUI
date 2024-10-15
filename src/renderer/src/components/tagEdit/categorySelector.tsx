import { cn } from '@/lib/utils'
import { SelectValue } from '@radix-ui/react-select'
import { HTMLAttributes } from 'react'
import useGetTagList from '../hooks/useGetTagList'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'

type CategorySelectorProps = HTMLAttributes<HTMLButtonElement> & {
  value: string
  setValue(category: string): void
}

function CategorySelector({ value, setValue, className, ...props }: CategorySelectorProps) {
  const { categories } = useGetTagList()
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className={cn('min-w-[120px] max-w-[180px] h-9', className)} {...props}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {categories.map((value, index) => {
          let parts = value.split('_')
          parts = parts.map((value) => {
            return `${value.charAt(0).toUpperCase()}${value.substring(1)}`
          })
          return (
            <SelectItem value={value} key={index}>
              {parts.join(' ')}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
export default CategorySelector
