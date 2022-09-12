import { Question } from '../../components/Questionnaire'
import { languages } from '../../types/lernfair/Language'
import { schooltypes } from '../../types/lernfair/SchoolType'
import { states } from '../../types/lernfair/State'
import { subjects } from '../../types/lernfair/Subject'

const questions: Question[] = [
  {
    imgRootPath: 'schooltypes',
    label: 'Schulform',
    question: 'Auf welche Schule gehst du?',
    type: 'selection',
    maxSelections: 1,
    options: schooltypes
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
    options: languages
  },
  {
    imgRootPath: 'subjects',
    label: 'Fächer',
    question: 'In welchen Fächern benötigst du Unterstützung?',
    type: 'selection',
    text: 'Du kannst mehrere Fächer auswählen',
    options: subjects
  },
  {
    imgRootPath: 'states',
    label: 'Bundesland',
    question: 'Aus welchem Bundesland kommst du?',
    type: 'selection',
    maxSelections: 1,

    options: states
  }
]

export default questions
