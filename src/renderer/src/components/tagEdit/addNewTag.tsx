import { PlusIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'

function AddNewTag({ addTag }: { addTag: (tag: string) => void }) {
  const [entryMode, setEntryMode] = useState<boolean>(false)

  return (
    <Badge className="px-2 py-1 rounded-full bg-slate-600 hover:bg-slate-700">
      {entryMode ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addTag(e.target[0].value)
            setEntryMode(false)
          }}
        >
          <Input
            autoFocus
            className="w-32 h-6 px-1 text-gray-400 border-0 bg-inherit focus-visible:ring-0"
            placeholder="New Tag"
          />
        </form>
      ) : (
        <PlusIcon
          className="text-gray-400"
          onClick={() => {
            setEntryMode(true)
          }}
        />
      )}
    </Badge>
  )
}
export default AddNewTag
