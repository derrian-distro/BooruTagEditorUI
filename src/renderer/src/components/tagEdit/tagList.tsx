import { cn } from '@/lib/utils'
import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import ColoredBadge from './coloredBadge'
import TagEditSkeleton from './tagEditSkeleton'

const categoryColors = {
  action: 'red',
  animal: 'stone',
  attire: 'orange',
  copyright: 'yellow',
  expression: 'lime',
  gesture: 'green',
  image_composition: 'emerald',
  location: 'cyan',
  object: 'blue',
  other: 'purple',
  position: 'pink',
  sex: 'slate',
  style: 'gray',
  text_and_symbol: 'zinc',
  trait: 'rose'
}

type BadgeListProps = HTMLAttributes<HTMLDivElement> & {
  tags: Tag[]
  addTag(tag: Tag): void
  isResizing: boolean
}

function TagList({ tags, addTag, isResizing, className, ...props }: BadgeListProps) {
  const [displayedTags, setDisplayedTags] = useState<Tag[]>([])
  const [numDisplayed, setNumDisplayed] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const loadMoreTags = useCallback(() => {
    const newNumDisplayed = Math.min(numDisplayed + 100, tags.length)
    setNumDisplayed(newNumDisplayed)
    setDisplayedTags(tags.slice(0, newNumDisplayed))
  }, [numDisplayed])

  useEffect(() => {
    setNumDisplayed(700)
    setDisplayedTags(tags.slice(0, 700))
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0)
    }
  }, [tags])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const container = containerRef.current

    const handleScroll = () => {
      if (numDisplayed >= tags.length) {
        return
      }
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 20) {
        loadMoreTags()
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  })

  return (
    <div className={cn(className, 'overflow-y-scroll')} {...props} ref={containerRef}>
      {isResizing ? (
        <TagEditSkeleton height={window.innerHeight} />
      ) : (
        displayedTags.map((value, index) => (
          <ColoredBadge
            tagProperties={value}
            key={index}
            addTag={addTag}
            color={categoryColors[value.category]}
          />
        ))
      )}
    </div>
  )
}
export default TagList
