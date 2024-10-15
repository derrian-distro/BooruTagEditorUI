import { useMemo, useState } from 'react'

const tagData = await window.api.getTags()

function useGetTagList() {
  const [tags, ,] = useState<{
    [index: string]: Tag[]
  }>(tagData.tags)
  const [categories, ,] = useState<string[]>(tagData.categories)
  const allTagList = useMemo(() => {
    let allTags: Tag[] = []
    for (const cat of Object.values(tagData.tags)) {
      allTags = allTags.concat(cat)
    }
    return allTags
  }, [])
  return { tags, categories, allTagList }
}
export default useGetTagList
