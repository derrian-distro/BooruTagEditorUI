import { ElectronAPI } from '@electron-toolkit/preload'

interface API {
  getTags(): Promise<TagData>
  getImages(): Promise<ImageWithTags[]>
  saveTags(image: ImageWithTags): void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
