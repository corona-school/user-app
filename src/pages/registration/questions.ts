import { Question } from '../../components/Questionnaire'
import { ISelectionItem } from '../../components/questionnaire/SelectionItem'

const questions: Question[] = [
  {
    label: 'Schulform',
    question: 'Auf welche Schule gehst du?',
    type: 'selection',
    options: [
      {
        key: 'gs',
        label: 'Grundschule'
      },
      {
        key: 'hs',
        label: 'Hauptschule'
      },
      {
        key: 'rs',
        label: 'Realschule'
      },
      {
        key: 'gym',
        label: 'Gymnasium'
      },
      {
        key: 'hos',
        label: 'Hochschule'
      },
      {
        key: 'bs',
        label: 'Berufsschule'
      },
      {
        key: 'other',
        label: 'Andere'
      }
    ]
  },
  {
    label: 'Klasse',
    question: 'In welcher Klasse bist du?',
    type: 'selection',
    options: new Array<ISelectionItem>(12)
      .fill({ key: '', label: '' })
      .map((_, index) => ({
        key: (index + 1).toString(),
        label: (index + 1).toString()
      }))
  },
  {
    label: 'Sprache',
    question: 'Welche Sprache(n) sprichst du zu Hause?',
    type: 'selection',
    options: [
      'Deutsch',
      'Englisch',
      'Französisch',
      'Latein',
      'Altgriechisch',
      'Spanisch',
      'Italienisch',
      'Russisch',
      'Niederländisch',
      'Andere'
    ].map((lang, index) => ({
      key: lang,
      label: lang
    }))
  },
  {
    label: 'Fächer',
    question: 'In welchen Fächern benötigst du Unterstützung?',
    type: 'selection',
    text: 'Du kannst bis zu 3 Fächer auswählen',
    options: [
      'Mathematik',
      'Deutsch',
      'Englisch',
      'Biologie',
      'Chemie',
      'Physik',
      'Informatik',
      'Sachkunde',
      'Geschichte',
      'Erdkunde',
      'Wirtschaft',
      'Politik',
      'Philosophie',
      'Kunst',
      'Musik',
      'Pädagogik',
      'Französisch',
      'Latein',
      'Altgriechisch',
      'Spanisch',
      'Italienisch',
      'Russisch',
      'Niederländisch',
      'Deutsch als Zweitsprache',
      'Andere'
    ].map((sub, index) => ({
      key: sub,
      label: sub
    }))
  },
  {
    label: 'Bundesland',
    question: 'Aus welchem Bundesland kommst du?',
    type: 'selection',

    options: [
      'Baden-Württemberg',
      'Bayern',
      'Berlin',
      'Brandenburg',
      'Bremen',
      'Hamburg',
      'Hessen',
      'Mecklenburg-Vorpommern',
      'Niedersachsen',
      'Nordrhein-Westfalen',
      'Rheinland-Pfalz',
      'Saarland',
      'Sachsen',
      'Sachsen-Anhalt',
      'Schleswig-Holstein',
      'Thüringen'
    ].map((sub, index) => ({
      key: sub,
      label: sub
    }))
  }
]

export default questions
