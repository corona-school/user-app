export type SchoolType = {
  key: string
  label: string
}

export const schooltypes: SchoolType[] = [
  { label: 'Grundschule', key: 'grundschule' },
  { label: 'Hauptschule', key: 'hauptschule' },
  { label: 'Realschule', key: 'realschule' },
  { label: 'Gymnasium', key: 'gymnasium' },
  { label: 'Andere', key: 'andere' }
]
