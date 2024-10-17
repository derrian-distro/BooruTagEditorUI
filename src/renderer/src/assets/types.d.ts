type Tag = {
  tag: string
  group: string
  category: string
}

type TagData = {
  tags: {
    [index: string]: Tag[]
  }
  categories: string[]
}

type ImageWithTags = {
  imagePath: string
  tags: string[]
  saveMode: 'json' | 'txt' | 'caption'
  wordSep: '_' | ' '
  tagSep: ',' | ' ' | null
  isSelected?: boolean
}
