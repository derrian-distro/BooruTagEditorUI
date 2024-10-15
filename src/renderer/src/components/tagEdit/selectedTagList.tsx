import { cn } from '@/lib/utils'
import { DraggableContainer, DraggableItem } from '@wuweiweiwu/react-shopify-draggable'
import { HTMLAttributes } from 'react'
import { useSignal } from 'react-signal-slot'
import useGetTagList from '../hooks/useGetTagList'
import AddNewTag from './addNewTag'
import Chip from './chip'
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
  trait: 'rose',
  custom: 'teal'
}

type SelectedTagsListProps = HTMLAttributes<HTMLDivElement> & {
  selectedTags: [Tag[], React.Dispatch<React.SetStateAction<Tag[]>>]
  setSearchText(text: string): void
  setCategory(category: string): void
  setMode(mode: 'tag' | 'group'): void
  isResizing: boolean
}

function SelectedTagsList({
  selectedTags,
  setSearchText,
  setCategory,
  setMode,
  className,
  isResizing,
  ...props
}: SelectedTagsListProps) {
  const signal = useSignal()
  const { allTagList } = useGetTagList()

  const updateSearch = (tag: Tag, mode: 'tag' | 'group') => {
    setMode(mode)
    if (tag.category === 'custom') {
      setCategory('all')
      setSearchText(tag.tag)
    } else {
      setCategory(tag.category)
      setSearchText(mode === 'tag' ? '' : tag.group)
    }
  }

  const handleDelete = (tag: Tag) => {
    const [currentTags, setSelectedTags] = selectedTags
    signal('addUndoItem', [...currentTags])
    setSelectedTags((prev) => {
      return prev.filter((v) => v !== tag)
    })
  }

  const addTag = (tag: string) => {
    console.log(tag)
    const [currentTags, setSelectedTags] = selectedTags
    signal('addUndoItem', [...currentTags])
    setSelectedTags((prev) => {
      return [...prev, { tag: tag, category: 'custom', group: 'custom' }]
    })
  }

  const onDragStopped = (e: { sourceContainer: { childNodes: NodeList } }) => {
    const [currentTags, setSelectedTags] = selectedTags
    signal('addUndoItem', [...currentTags])
    const newTags: Tag[] = []
    for (const item of Array.from(e.sourceContainer.childNodes)) {
      const tagText = item.textContent
      const found = currentTags.find((v) => v.tag === item.textContent)
      if (found) {
        newTags.push(found)
      } else if (tagText) {
        const found = allTagList.find((v) => v.tag === tagText)
        if (found) {
          newTags.push(found)
        } else {
          newTags.push({ tag: tagText, category: 'custom', group: 'custom' })
        }
      }
    }
    setSelectedTags(newTags)
  }

  if (selectedTags[0].length === 0) {
    return <div className={className} {...props} />
  }

  return (
    <div className={cn(className, 'overflow-hidden px-0')} {...props}>
      {isResizing ? (
        <TagEditSkeleton height={window.innerHeight} />
      ) : (
        <DraggableContainer
          as="div"
          type="sortable"
          className={cn(className, 'overflow-y-scroll overflow-x-hidden')}
          onDragStopped={onDragStopped}
        >
          {selectedTags[0].map((value) => (
            <DraggableItem as="div" key={value.tag}>
              <Chip
                updateSearch={updateSearch}
                handleDelete={handleDelete}
                tagProperties={value}
                color={categoryColors[value.category]}
                className="max-h-8"
              />
            </DraggableItem>
          ))}
          <AddNewTag addTag={addTag} />
        </DraggableContainer>
      )}
    </div>
  )
}
export default SelectedTagsList
