export type LFCourse = {
  name: string
  description: string
  outline: string
}

export type LFSubCourse = {
  id?: number
  lectures: LFLecture[]
  image?: string
  course: LFCourse
}

export type LFLecture = {
  id?: number
  start: Date
  duration: number
}
