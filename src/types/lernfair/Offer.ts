export type Offer = {
  key: string
  label: string
  text: string
}

export const offers: Offer[] = [
  {
    key: '1to1',
    label: '1:1 Lernunterstützung',
    text: 'digitales Zuschalten der Helfer:innen 1x wöchentlich über 3 - 12 Monate'
  },
  {
    key: 'group',
    label: 'Gruppenlernunterstützung',
    text: 'Kurzfristige Unterstützung bei spezifischen Problemen und Fragen'
  }
]
