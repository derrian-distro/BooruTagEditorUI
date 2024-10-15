import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { ImageWithTags } from '../main/functions'

// Custom APIs for renderer
const api = {
  getTags: () => ipcRenderer.invoke('getTags'),
  getImages: () => ipcRenderer.invoke('getImages'),
  saveTags: (image: ImageWithTags) => ipcRenderer.invoke('saveTags', image)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
