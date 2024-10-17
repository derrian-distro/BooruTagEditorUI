import { ChevronLeftIcon, ChevronRightIcon, FolderOpenIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSlot } from 'react-signal-slot'
import useSignalRef from '../hooks/useSignalRef'
import { Button } from '../ui/button'

function MainImage() {
  const signal = useSignalRef()
  const [image, setImage] = useState<ImageWithTags | null>(null)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  })
  const containerRef = useRef<HTMLDivElement>(null)

  useSlot('imageChanged', (image: ImageWithTags) => {
    setImage(image)
    signal.current('newImageSelected', image)
  })

  useSlot('changeImageArrow', (left: boolean) => {
    signal.current('incDecImage', image, left)
  })

  const handleLeftRight = (e: KeyboardEvent) => {
    console.log(e.key)
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      signal.current('changeImageArrow', true)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      signal.current('changeImageArrow', false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleLeftRight)
  }, [])

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
            signal.current('newImageSelected', images[0])
            signal.current('changeImageList', images)
          }}
          className="absolute top-0 mx-auto opacity-70 hover:opacity-100"
        >
          <FolderOpenIcon width="100%" height="100%" />
          <div className="pl-1">Open Folder</div>
        </Button>
        <Button
          className="absolute left-0 w-12 h-24 my-auto opacity-70 hover:opacity-100"
          onClick={() => signal.current('incDecImage', image, true)}
        >
          <ChevronLeftIcon transform="scale(2.5)" />
        </Button>
        <Button
          className="absolute right-0 w-12 h-24 my-auto opacity-70 hover:opacity-100"
          onClick={() => signal.current('incDecImage', image, false)}
        >
          <ChevronRightIcon transform="scale(2.5)" />
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
        signal.current('newImageSelected', images[0])
        signal.current('changeImageList', images)
      }}
    >
      <FolderOpenIcon width="100%" height="100%" />
      <div className="pl-1">Open Folder</div>
    </Button>
  )
}
export default MainImage
