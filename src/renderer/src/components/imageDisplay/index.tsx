import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'
import Gallery from './gallery'
import MainImage from './mainImage'

function ImageDisplay() {
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={25} maxSize={25} className="flex" minSize={10} collapsible>
        <Gallery />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="flex items-center justify-center w-full h-full">
        <MainImage />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
export default ImageDisplay
