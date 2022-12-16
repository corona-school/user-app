export type LFSubject = {
  name: string
  grade?: {
    min: number
    max: number
    __typename?: string
  }
  mandatory?: boolean
  __typename?: string
}

export const subjects: { key: string; label: string; formatted?: string }[] = [
  { key: 'mathematik', label: 'Mathematik' },
  { key: 'deutsch', label: 'Deutsch' },
  { key: 'englisch', label: 'Englisch' },
  { key: 'französisch', label: 'Französisch', formatted: 'Franz_sisch' },
  { key: 'physik', label: 'Physik' },
  { key: 'chemie', label: 'Chemie' },
  { key: 'biologie', label: 'Biologie' },
  { key: 'latein', label: 'Latein' },
  { key: 'spanisch', label: 'Spanisch' },
  { key: 'geschichte', label: 'Geschichte' },
  { key: 'erdkunde', label: 'Erdkunde' },
  { key: 'wirtschaft', label: 'Wirtschaft' },
  { key: 'informatik', label: 'Informatik' },
  { key: 'musik', label: 'Musik' },
  { key: 'politik', label: 'Politik' },
  { key: 'kunst', label: 'Kunst' },
  { key: 'philosophie', label: 'Philosophie' },
  { key: 'italienisch', label: 'Italienisch' },
  { key: 'paedagogik', label: 'Pädagogik', formatted: 'P_dagogik' },
  { key: 'russisch', label: 'Russisch' },
  { key: 'sachkunde', label: 'Sachkunde' }
]

export const getSubjectKey: (name: string) => string = name => {
  for (let subject of subjects) {
    if (subject.label === name) {
      return subject.key
    }
  }
  return 'other'
}

export const getSubjectLabel: (
  key: string,
  fromFormatted?: boolean
) => string = (key, fromFormatted) => {
  for (let subject of subjects) {
    if (
      (fromFormatted ? subject.formatted || subject.key : subject.key) === key
    ) {
      return subject.label
    }
  }
  if (key === 'daz') return 'Deutsch als Zweitsprache'
  return 'Andere'
}
