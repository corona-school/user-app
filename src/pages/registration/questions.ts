import { SelectionQuestion } from '../../components/Questionnaire'
import { languages } from '../../types/lernfair/Language'
import { schooltypes } from '../../types/lernfair/SchoolType'
import { states } from '../../types/lernfair/State'
import { subjects } from '../../types/lernfair/Subject'
import { offers } from '../../types/lernfair/Offer'

export const pupilQuestions: SelectionQuestion[] = [
  {
    id: 'schooltype',
    imgRootPath: 'schooltypes',
    type: 'selection',
    maxSelections: 1,
    options: schooltypes
  },
  {
    id: 'schoolclass',
    imgRootPath: 'text',
    type: 'selection',
    maxSelections: 1,
    // options are populated dynamically
    options: []
  },
  {
    id: 'languages',
    imgRootPath: 'languages',
    type: 'selection',
    options: languages
  },
  {
    id: 'subjects',
    imgRootPath: 'subjects',
    type: 'selection',
    options: subjects
  },
  {
    id: 'state',
    imgRootPath: 'states',
    type: 'selection',
    maxSelections: 1,
    options: states
  }
]

export const studentQuestions: SelectionQuestion[] = [
  {
    id: 'offers',
    imgRootPath: 'offers',
    type: 'selection',
    options: offers,
    viewType: 'large'
  },
  {
    id: 'subjects',
    imgRootPath: 'subjects',
    type: 'selection',
    options: subjects,
    maxSelections: 3
  }
]

const questions = { pupilQuestions, studentQuestions }
export default questions
