import { Question } from '../../components/Questionnaire'
import { ISelectionItem } from '../../components/questionnaire/SelectionItem'

const questions: Question[] = [
  {
    imgRootPath: 'schooltypes',
    label: 'Schulform',
    question: 'Auf welche Schule gehst du?',
    type: 'selection',
    maxSelections: 1,
    options: [
      { label: 'Grundschule', key: 'grundschule' },
      { label: 'Hauptschule', key: 'hauptschule' },
      { label: 'Realschule', key: 'realschule' },
      { label: 'Gymnasium', key: 'gymnasium' },
      { label: 'Andere', key: 'andere' }
    ]
  },
  {
    imgRootPath: 'text',
    label: 'Klasse',
    question: 'In welcher Klasse bist du?',
    type: 'selection',
    maxSelections: 1,
    options: []
  },
  {
    imgRootPath: 'languages',
    label: 'Sprache',
    question: 'Welche Sprache(n) sprichst du zu Hause?',
    type: 'selection',
    options: [
      {
        key: 'albanisch',
        label: 'Albanisch'
      },
      {
        key: 'arabisch',
        label: 'Arabisch'
      },
      {
        key: 'armenisch',
        label: 'Armenisch'
      },
      {
        key: 'aserbaidschanisch',
        label: 'Aserbaidschanisch'
      },
      {
        key: 'bosnisch',
        label: 'Bosnisch'
      },
      {
        key: 'bulgarisch',
        label: 'Bulgarisch'
      },
      {
        key: 'chinesisch',
        label: 'Chinesisch'
      },
      {
        key: 'deutsch',
        label: 'Deutsch'
      },
      {
        key: 'englisch',
        label: 'Englisch'
      },
      {
        key: 'franzoesisch',
        label: 'Französisch'
      },
      {
        key: 'italienisch',
        label: 'Italienisch'
      },
      {
        key: 'kasachisch',
        label: 'Kasachisch'
      },
      {
        key: 'kurdisch',
        label: 'Kurdisch'
      },
      {
        key: 'polnisch',
        label: 'Polnisch'
      },
      {
        key: 'portugiesisch',
        label: 'Portugiesisch'
      },
      {
        key: 'russisch',
        label: 'Russisch'
      },
      {
        key: 'spanisch',
        label: 'Spanisch'
      },
      {
        key: 'tuerkisch',
        label: 'Türkisch'
      },
      {
        key: 'ukrainisch',
        label: 'Ukrainisch'
      },
      {
        key: 'vietnamesisch',
        label: 'Vietnamesisch'
      },
      {
        key: 'andere',
        label: 'Andere'
      }
    ]
  },
  {
    imgRootPath: 'subjects',
    label: 'Fächer',
    question: 'In welchen Fächern benötigst du Unterstützung?',
    type: 'selection',
    text: 'Du kannst bis zu 3 Fächer auswählen',
    maxSelections: 3,
    options: [
      { key: 'altgriechisch', label: 'Altgriechisch' },
      { key: 'biologie', label: 'Biologie' },
      { key: 'chemie', label: 'Chemie' },
      { key: 'deutsch', label: 'Deutsch' },
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
      { key: 'niederlaendisch', label: 'Niederländisch' },
      { key: 'paedagogik', label: 'Pädagogik' },
      { key: 'philosophie', label: 'Philosophie' },
      { key: 'physik', label: 'Physik' },
      { key: 'politik', label: 'Politik' },
      { key: 'russisch', label: 'Russisch' },
      { key: 'sachkunde', label: 'Sachkunde' },
      { key: 'sonstige', label: 'Sonstige' },
      { key: 'spanisch', label: 'Spanisch' },
      { key: 'wirtschaft', label: 'Wirtschaft' }
      // { key: 'andere', label: 'Andere' }
    ]
  },
  {
    imgRootPath: 'states',
    label: 'Bundesland',
    question: 'Aus welchem Bundesland kommst du?',
    type: 'selection',
    maxSelections: 1,
    options: [
      { key: 'baden-wuerttemberg', label: 'Baden-Württemberg' },
      { key: 'bayern', label: 'Bayern' },
      { key: 'berlin', label: 'Berlin' },
      { key: 'brandenburg', label: 'Brandenburg' },
      { key: 'bremen', label: 'Bremen' },
      { key: 'hamburg', label: 'Hamburg' },
      { key: 'hessen', label: 'Hessen' },
      { key: 'mecklenburg-vorpommern', label: 'Mecklenburg-Vorpommern' },
      { key: 'niedersachsen', label: 'Niedersachsen' },
      { key: 'nordrhein-westfalen', label: 'Nordrhein-Westfalen' },
      { key: 'rheinland-pfalz', label: 'Rheinland-Pfalz' },
      { key: 'saarland', label: 'Saarland' },
      { key: 'sachsen', label: 'Sachsen' },
      { key: 'sachsen-anhalt', label: 'Sachsen-Anhalt' },
      { key: 'schleswig-holstein', label: 'Schleswig-Holstein' },
      { key: 'thueringen', label: 'Thüringen' }
    ]
  }
]

export default questions
