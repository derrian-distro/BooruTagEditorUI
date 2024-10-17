import debounce from 'lodash.debounce'
import { useEffect, useRef, useState } from 'react'
import { useSlot } from 'react-signal-slot'
import useGetTagList from '../hooks/useGetTagList'
import useSignalRef from '../hooks/useSignalRef'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'
import SelectedTagsList from './selectedTagList'
import TagSearch from './tagSearch'

function TagEdit() {
  const { tags, allTagList } = useGetTagList()
  const [currentImage, setCurrentImage] = useState<ImageWithTags | null>(null)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [undoList, setUndoList] = useState<Tag[][]>([])
  const [redoList, setRedoList] = useState<Tag[][]>([])
  const [resize, setResize] = useState<boolean>(false)
  const tagsToDisplay = useState<Tag[]>([])
  const searchText = useState<string>('')
  const category = useState<string>('all')
  const searchMode = useState<'tag' | 'group'>('tag')
  const signal = useSignalRef()
  const resizeRef = useRef<HTMLDivElement>(null)

  const updateTags = () => {
    let newTags: Tag[] = []
    if (category[0] === 'all') {
      newTags = allTagList
    } else {
      newTags = tags[category[0]]
    }

    newTags = newTags.filter((value) => {
      const found = selectedTags.find((v) => v.tag === value.tag)
      return !found
    })
    if (searchMode[0] === 'group') {
      newTags = newTags.filter((value) => value.group.includes(searchText[0]))
    } else {
      const reg = new RegExp(`^${searchText[0]}|_${searchText[0]}`)
      newTags = newTags.filter((value) => {
        return reg.test(value.tag)
      })
    }
    tagsToDisplay[1](newTags)
  }

  useSlot('newImageSelected', (image: ImageWithTags) => {
    if (currentImage) {
      window.api.saveTags({ ...currentImage, tags: selectedTags.map((v) => v.tag) })
    }
    image.isSelected = true
    const newImageTags = image.tags
    const newTags: Tag[] = []
    for (const tag of newImageTags) {
      const found = allTagList.find((v) => v.tag === tag)
      if (found) {
        newTags.push(found)
      } else {
        newTags.push({ tag, category: 'custom', group: 'custom' })
      }
    }
    setCurrentImage(image)
    setSelectedTags(newTags)
    setUndoList([])
    setRedoList([])
  })

  useSlot('addUndoItem', (action: Tag[]) => {
    setRedoList([])
    setUndoList((p) => [...p, action])
  })

  useSlot('removeUndoItem', () => {
    const newUndoList = [...undoList]
    const undoItem = newUndoList.pop()
    if (!undoItem) {
      return
    }

    setRedoList((p) => [...p, [...selectedTags]])
    setSelectedTags(undoItem)
    setUndoList(newUndoList)
    updateTags()
  })

  useSlot('removeRedoItem', () => {
    const newRedoList = [...redoList]
    const redoItem = newRedoList.pop()
    if (!redoItem) {
      return
    }

    setSelectedTags(redoItem)
    setUndoList([])
    setRedoList(newRedoList)
    updateTags()
  })

  useSlot('updateImageTags', (value: ImageWithTags) => {
    if (!currentImage) {
      return
    }
    const updatedImage = {
      ...currentImage,
      tags: selectedTags.map((v) => v.tag)
    }
    signal.current('updateGalleryImage', { updatedImage, value })
  })

  useSlot('saveTagsPressed', () => {
    if (!currentImage) {
      return
    }
    window.api.saveTags({
      ...currentImage,
      tags: selectedTags.map((v) => v.tag)
    })
  })

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault()
          signal.current('removeUndoItem')
          break
        case 'y':
          e.preventDefault()
          signal.current('removeRedoItem')
          break
        case 's':
          e.preventDefault()
          signal.current('saveTagsPressed')
      }
    }
  }

  const saveLoaded = () => {
    signal.current('saveTagsPressed')
  }

  const setResizeFalse = debounce(() => {
    setResize(false)
  }, 400)

  useEffect(() => {
    updateTags()
  }, [searchText[0], category[0], searchMode[0], selectedTags])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('beforeunload', saveLoaded)

    const resizeObserver = new ResizeObserver(() => {
      setResize(true)
      setResizeFalse()
    })
    resizeObserver.observe(resizeRef.current as HTMLDivElement)
  }, [])

  return (
    <div ref={resizeRef} className="h-full" onClick={() => console.log(selectedTags)}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={35} className="flex items-center justify-center" minSize={35}>
          <SelectedTagsList
            selectedTags={[selectedTags, setSelectedTags]}
            setSearchText={searchText[1]}
            setCategory={category[1]}
            setMode={searchMode[1]}
            isResizing={resize}
            className="flex flex-wrap content-start justify-center w-full h-full gap-1 px-4 pt-1 overflow-auto"
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="flex flex-col" minSize={10} collapsible>
          <TagSearch
            tagsToDisplay={tagsToDisplay[0]}
            selectedTags={[selectedTags, setSelectedTags]}
            searchText={searchText}
            category={category}
            searchMode={searchMode}
            isResizing={resize}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
export default TagEdit
