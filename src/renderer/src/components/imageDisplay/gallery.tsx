import { useState } from 'react'
import { useSignal, useSlot } from 'react-signal-slot'
import OptimizedGrid from './optimizedGrid'

function Gallery() {
  const [imageList, setImageList] = useState<ImageWithTags[]>([])
  const signal = useSignal()

  useSlot('changeImageList', (images: ImageWithTags[]) => {
    setImageList(images)
  })

  useSlot(
    'updateGalleryImage',
    ({ updatedImage, value }: { updatedImage: ImageWithTags; value: ImageWithTags }) => {
      const foundIndex = imageList.findIndex((v) => v.imagePath === updatedImage.imagePath)
      if (foundIndex === -1) {
        return
      }
      const tempImageList = [...imageList]
      tempImageList[foundIndex] = updatedImage
      setImageList(tempImageList)
      signal('imageChanged', value)
    }
  )

  return (
    <div className="flex w-full h-full">
      <OptimizedGrid items={imageList} maxItemHeight={128} />
    </div>
  )
}
export default Gallery
