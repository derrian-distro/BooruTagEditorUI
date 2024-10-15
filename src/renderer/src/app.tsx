import ImageDisplay from './components/imageDisplay'
import TagEdit from './components/tagEdit'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'

function App() {
  return (
    <div className="overflow-hidden h-dvh">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={15} collapsible>
          <ImageDisplay />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={15} collapsible>
          <TagEdit />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
export default App
