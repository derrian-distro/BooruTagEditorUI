import { FolderOpenIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSignal, useSlot } from 'react-signal-slot'
import { Button } from '../ui/button'

function MainImage() {
  const signal = useSignal()
  const [image, setImage] = useState<ImageWithTags | null>(null)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  })
  const containerRef = useRef<HTMLDivElement>(null)

  useSlot('imageChanged', (image: ImageWithTags) => {
    setImage(image)
    signal('newImageSelected', image)
  })

  useEffect(() => {
    const updateDimensions = (entries: { contentRect: { width: number; height: number } }[]) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setDimensions({ width, height })
      }
    }

    const resizeObserver = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current)
      }
    }
  })

  if (image) {
    return (
      <div
        className="relative flex items-center justify-center w-full h-full p-4"
        ref={containerRef}
      >
        <Button
          onClick={async () => {
            const images = await window.api.getImages()
            setImage(images[0])
            signal('newImageSelected', images[0])
            signal('changeImageList', images)
          }}
          className="absolute opacity-50 hover:opacity-100"
          style={{
            top: 0,
            margin: '0 auto'
          }}
        >
          <FolderOpenIcon width="100%" height="100%" />
          <div className="pl-1">Open Folder</div>
        </Button>
        <img
          src={'atom://' + image.imagePath}
          className="object-contain max-w-full max-h-full"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`
          }}
        />
      </div>
    )
  }

  return (
    <Button
      onClick={async () => {
        const images = await window.api.getImages()
        setImage(images[0])
        signal('newImageSelected', images[0])
        signal('changeImageList', images)
      }}
    >
      <FolderOpenIcon width="100%" height="100%" />
      <div className="pl-1">Open Folder</div>
    </Button>
  )
}
export default MainImage
