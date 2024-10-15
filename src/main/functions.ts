import { dialog } from 'electron'
import {
  ensureDir,
  readdir,
  readFile,
  readJson,
  readJsonSync,
  writeFileSync,
  writeJsonSync
} from 'fs-extra'
import path from 'path'
import { validateMIMEType } from 'validate-image-type'
import tags from '../../tag_groups.json'

// 15592 all
// 8279 other only
type Tag = {
  tag: string
  group: string
  category: string
}

export type ImageWithTags = {
  imagePath: string
  tags: string[]
  saveMode: 'json' | 'txt' | 'caption'
  wordSep: '_' | ' '
  tagSep: ',' | ' ' | null
}

type JSONData = {
  character: string[]
  general: string[]
  artist: string[]
  rating: {
    general: number
    sensitive: number
    questionable: number
    explicit: number
  }
}

let cachedTags: null | { [index: string]: Tag[] } = null

export function getTags(): {
  tags: { [index: string]: Tag[] }
  categories: string[]
} {
  const categories = Object.keys(tags)
  if (cachedTags) {
    return { tags: cachedTags, categories }
  }
  const outputTags: Map<string, Tag[]> = new Map()
  for (const category of categories) {
    for (const group of Object.keys(tags[category])) {
      if (group === 'other') {
        for (const item of tags[category][group]) {
          const catTags: Tag[] = outputTags.has(category) ? (outputTags.get(category) as Tag[]) : []
          catTags.push({ tag: item, group: group, category: category })
          outputTags.set(category, catTags)
        }
        continue
      }
      for (const type of Object.values<string[]>(tags[category][group])) {
        for (const tag of type) {
          const catTags: Tag[] = outputTags.has(category) ? (outputTags.get(category) as Tag[]) : []
          catTags.push({ tag: tag, group: group, category: category })
          outputTags.set(category, catTags)
        }
      }
    }
  }
  cachedTags = Object.fromEntries(outputTags.entries())
  return { tags: cachedTags, categories }
}

export async function getImages() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select Folder of Image Caption Pairs',
    buttonLabel: 'Open',
    properties: ['openDirectory']
  })

  if (canceled) {
    return
  }
  await ensureDir(filePaths[0])

  const files = await readdir(filePaths[0], {
    encoding: 'utf-8',
    withFileTypes: true
  })
  const img: string[] = []
  const tags: string[] = []
  const captionRegex = new RegExp(/\.(txt|json|caption)$/)
  for (const { name, path } of files) {
    if (name.split('.').length === 1) {
      continue
    }
    if (captionRegex.test(name)) {
      tags.push(`${path}${process.platform === 'win32' ? '\\' : '/'}${name}`)
    } else {
      img.push(`${path}${process.platform === 'win32' ? '\\' : '/'}${name}`)
    }
  }
  const ImageList: ImageWithTags[] = []
  for (const image of img) {
    const result = await validateMIMEType(image, {
      allowMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/bmp']
    })
    if (!result.ok) {
      console.log(result.error)
      continue
    }
    const imageRegex = new RegExp(`${image.split('.')[0]}`.replaceAll('\\', '\\\\'))
    const caption = tags.find((val) => imageRegex.test(val))

    if (caption?.endsWith('txt') || caption?.endsWith('caption')) {
      let data: string | string[] = await readFile(caption, {
        encoding: 'utf-8'
      })
      const wordSep = data.includes('_') ? '_' : ' '
      const tagSep = data.includes(',') ? ',' : ' '

      if (tagSep === ',') {
        data = data.replaceAll(', ', ',').split(',')
      } else {
        data = data.split(' ')
      }
      if (wordSep === ' ') {
        for (const [index, tag] of data.entries()) {
          data[index] = tag.replaceAll(' ', '_')
        }
      }

      ImageList.push({
        imagePath: image,
        tags: data,
        saveMode: caption?.endsWith('txt') ? 'txt' : 'caption',
        wordSep,
        tagSep
      })
    }

    if (caption?.endsWith('json')) {
      const data: string[] = ((await readJson(caption)) as JSONData).general
      let wordSep: '_' | ' ' = '_'
      for (const [index, item] of data.entries()) {
        if (item.includes(' ')) {
          wordSep = ' '
          data[index] = item.replaceAll(' ', '_')
        }
      }
      ImageList.push({
        imagePath: path.join(filePaths[0], image),
        tags: data,
        saveMode: 'json',
        wordSep: wordSep,
        tagSep: null
      })
    }
  }
  return ImageList
}

export function saveTags(image: ImageWithTags) {
  let tags: string | string[] = image.tags

  if (image.wordSep === ' ') {
    for (const [index, tag] of image.tags.entries()) {
      tags[index] = tag.replaceAll('_', ' ')
    }
  }
  if (image.saveMode !== 'json') {
    tags = tags.join(image.tagSep === ' ' ? ' ' : ', ')
    image.imagePath = image.imagePath.split('.')[0] + '.' + image.saveMode
    writeFileSync(image.imagePath, tags, { encoding: 'utf-8' })
  } else {
    image.imagePath = image.imagePath.split('.')[0] + '.' + image.saveMode
    const data: JSONData = readJsonSync(image.imagePath, { encoding: 'utf-8' })
    writeJsonSync(image.imagePath, { ...data, general: tags }, { encoding: 'utf-8', spaces: 2 })
  }
}
