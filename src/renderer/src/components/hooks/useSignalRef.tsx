import { useRef } from 'react'
import { useSignal } from 'react-signal-slot'

function useSignalRef() {
  const signal = useSignal()
  return useRef(signal)
}
export default useSignalRef
