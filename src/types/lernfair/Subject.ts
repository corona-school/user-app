export type SubjectName =
  | 'Mathematik'
  | 'Deutsch'
  | 'Englisch'
  | 'Biologie'
  | 'Chemie'
  | 'Physik'
  | 'Informatik'
  | 'Sachkunde'
  | 'Geschichte'
  | 'Erdkunde'
  | 'Wirtschaft'
  | 'Politik'
  | 'Philosophie'
  | 'Kunst'
  | 'Musik'
  | 'Pädagogik'
  | 'Französisch'
  | 'Latein'
  | 'Altgriechisch'
  | 'Spanisch'
  | 'Italienisch'
  | 'Russisch'
  | 'Niederländisch'
  | 'Deutsch als Zweitsprache'

export type Subject = {
  name: SubjectName
  minGrade?: number
  maxGrade?: number
}
