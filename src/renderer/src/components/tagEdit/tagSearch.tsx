import { useSignal } from 'react-signal-slot'
import { Input } from '../ui/input'
import CategorySelector from './categorySelector'
import SearchModeSelector from './searchModeSelector'
import TagList from './tagList'

type TagSearchProps = {
  tagsToDisplay: Tag[]
  selectedTags: [Tag[], React.Dispatch<React.SetStateAction<Tag[]>>]
  searchText: [string, React.Dispatch<React.SetStateAction<string>>]
  category: [string, React.Dispatch<React.SetStateAction<string>>]
  searchMode: ['tag' | 'group', React.Dispatch<React.SetStateAction<'tag' | 'group'>>]
  isResizing: boolean
}

function TagSearch({
  tagsToDisplay,
  selectedTags,
  searchText,
  category,
  searchMode,
  isResizing
}: TagSearchProps) {
  const signal = useSignal()

  const addTag = (tag: Tag) => {
    const [currentTags, setSelectedTags] = selectedTags
    signal('addUndoItem', [...currentTags])
    setSelectedTags((prev) => {
      return [...prev, tag]
    })
  }

  return (
    <>
      <div className="flex flex-row pt-2">
        <CategorySelector value={category[0]} setValue={category[1]} />
        <SearchModeSelector value={searchMode[0]} setValue={searchMode[1]} />
        <Input
          value={searchText[0]}
          placeholder="Search"
          onChange={(e) => {
            searchText[1](e.target.value)
          }}
        />
      </div>
      <div className="flex flex-col flex-grow overflow-hidden">
        <TagList
          tags={tagsToDisplay}
          addTag={addTag}
          className="flex flex-wrap content-start justify-center h-full gap-1 pt-1 pl-4 overflow-x-hidden overflow-y-auto"
          isResizing={isResizing}
        />
      </div>
    </>
  )
}
export default TagSearch
