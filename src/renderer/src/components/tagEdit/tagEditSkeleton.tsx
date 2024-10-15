import { useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton'

function TagEditSkeleton({ height }: { height: number }) {
  const [sizes, setSizes] = useState<number[]>([])

  useEffect(() => {
    const temp: number[] = []
    for (let i = 0; i < 40; i++) {
      temp.push(Math.round(Math.random() * 40 + 80))
    }
    setSizes(temp)
  }, [])

  return (
    <div
      className="flex flex-wrap content-start justify-center gap-1"
      style={{
        height: `${height}px`
      }}
    >
      {sizes.map((value, index) => (
        <Skeleton
          className="rounded-xl border px-2.5 py-0.5 h-[30px]"
          style={{ width: `${value}px` }}
          key={index}
        />
      ))}
    </div>
  )
}
export default TagEditSkeleton
