import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

type SearchModeSelectorProps = HTMLAttributes<HTMLButtonElement> & {
  value: 'tag' | 'group'
  setValue(type: 'tag' | 'group'): void
}

function SearchModeSelector({ value, setValue, className, ...props }: SearchModeSelectorProps) {
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className={cn('min-w-16 max-w-20 h-9', className)} {...props}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="tag">Tag</SelectItem>
        <SelectItem value="group">Group</SelectItem>
      </SelectContent>
    </Select>
  )
}
export default SearchModeSelector
