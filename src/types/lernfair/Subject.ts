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

export const subjects: { key: string; label: string }[] = [
  { key: 'arbeitslehre', label: 'Arbeitslehre' },
  { key: 'biologie', label: 'Biologie' },
  { key: 'chemie', label: 'Chemie' },
  { key: 'deutsch', label: 'Deutsch' },
  { key: 'deutsch-2', label: 'Deutsch als Zweitsprache' },
  { key: 'englisch', label: 'Englisch' },
  { key: 'erdkunde', label: 'Erdkunde' },
  { key: 'franzoesisch', label: 'Französisch' },
  { key: 'geschichte', label: 'Geschichte' },
  { key: 'informatik', label: 'Informatik' },
  { key: 'italienisch', label: 'Italienisch' },
  { key: 'kunst', label: 'Kunst' },
  { key: 'latein', label: 'Latein' },
  { key: 'mathe', label: 'Mathe' },
  { key: 'musik', label: 'Musik' },
  { key: 'paedagogik', label: 'Pädagogik' },
  { key: 'philosophie', label: 'Philosophie' },
  { key: 'physik', label: 'Physik' },
  { key: 'politik', label: 'Politik' },
  { key: 'russisch', label: 'Russisch' },
  { key: 'sachkunde', label: 'Sachkunde' },
  { key: 'sonstige', label: 'Sonstige' },
  { key: 'spanisch', label: 'Spanisch' },
  { key: 'tuerkisch', label: 'Türkisch' },
  { key: 'wirtschaft', label: 'Wirtschaft' }

  // { key: 'andere', label: 'Andere' }
]
