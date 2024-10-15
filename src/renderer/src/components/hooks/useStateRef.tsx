import { useRef, useState } from 'react'

function useStateRef<T>(defaultValue: T): [React.MutableRefObject<T>, (data: T) => void] {
  const [val, _setVal] = useState<T>(defaultValue)
  const valRef = useRef(val)
  const setVal = (data: T) => {
    valRef.current = data
    _setVal(data)
  }

  return [valRef, setVal]
}
export default useStateRef
