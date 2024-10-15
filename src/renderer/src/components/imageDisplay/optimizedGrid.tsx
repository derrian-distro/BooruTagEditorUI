import { CSSProperties, useEffect, useRef, useState } from 'react'
import { useSignal } from 'react-signal-slot'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeGrid as Grid } from 'react-window'
import { Skeleton } from '../ui/skeleton'

type OptimizedGridProps = {
  items: ImageWithTags[]
  maxItemHeight: number
}

function OptimizedGrid({ items, maxItemHeight }: OptimizedGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  })
  const [itemSize, setItemSize] = useState<{ width: number; height: number }>({
    width: 128,
    height: maxItemHeight
  })
  const [columnCount, setColumnCount] = useState(0)
  const [rowCount, setRowCount] = useState(0)
  const signal = useSignal()

  // setup the observer
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
  }, [])

  useEffect(() => {
    const { width, height } = dimensions
    const rowCount = Math.max(1, Math.floor(height / maxItemHeight))
    const rowHeight = height / rowCount

    const columnCount = Math.max(1, Math.ceil(items.length / rowCount))

    setItemSize({ width: Math.max(200, width / columnCount), height: rowHeight })
    setColumnCount(columnCount)
    setRowCount(rowCount)
  }, [dimensions, maxItemHeight, items.length])

  const Cell = ({
    columnIndex,
    rowIndex,
    isScrolling,
    style
  }: {
    rowIndex: number
    columnIndex: number
    isScrolling?: boolean
    style: CSSProperties
  }) => {
    const itemIndex = rowIndex * columnCount + columnIndex
    const value = items[itemIndex]
    if (itemIndex >= items.length) {
      return null
    }

    if (isScrolling) {
      return (
        <div style={style} className="grid-item">
          <Skeleton
            className="max-h-full max-w-48"
            style={{
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              paddingBottom: rowCount > 1 && rowIndex === 0 ? '4px' : undefined,
              paddingTop: rowCount > 1 && rowIndex !== 0 ? '4px' : undefined
            }}
          />
        </div>
      )
    }

    return (
      <div style={style} className="flex grid-item">
        <img
          src={'atom://' + value.imagePath}
          className="object-contain max-h-full border max-w-48 border-slate-600 hover:bg-[#05112e] cursor-pointer"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`
          }}
          onClick={() => {
            signal('updateImageTags', value)
          }}
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            className="grid"
            columnCount={columnCount}
            columnWidth={itemSize.width}
            height={height}
            rowCount={rowCount}
            rowHeight={itemSize.height}
            width={width}
            overscanRowCount={2}
            style={{
              overflowY: 'hidden',
              overflowX: 'auto'
            }}
            useIsScrolling
          >
            {Cell}
          </Grid>
        )}
      </AutoSizer>
    </div>
  )
}
export default OptimizedGrid
