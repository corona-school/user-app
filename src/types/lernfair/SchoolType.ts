export type SchoolType = {
  key: string
  label: string
}

export const schooltypes: SchoolType[] = [
  { label: 'Grundschule', key: 'grundschule' },
  { label: 'Hauptschule', key: 'hauptschule' },
  { label: 'Gesamtschule', key: 'gesamtschule' },
  { label: 'Realschule', key: 'realschule' },
  { label: 'Gymnasium', key: 'gymnasium' },
  { label: 'Berufsschule', key: 'berufsschule' },
  { label: 'Förderschule', key: 'f_rderschule' },
  { label: 'Sonstige', key: 'other' }
]
