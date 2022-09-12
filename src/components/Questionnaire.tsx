import {
  Box,
  Button,
  Flex,
  Heading,
  Progress,
  Text,
  useTheme,
  VStack
} from 'native-base'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import QuestionnaireSelectionView from './questionnaire/QuestionnaireSelectionView'
import { ISelectionItem } from './questionnaire/SelectionItem'

export type Question = {
  label: string
  question: string
  type: 'selection'
  options: ISelectionItem[]
  text?: string
  imgRootPath: string
  minSelections?: number
  maxSelections?: number
}

export type Answer = {
  [key: string]: boolean
}

export type IQuestionnaire = {
  questions: Question[]
  onQuestionnaireFinished: (answers: { [key: string]: Answer }) => any
}

type IQuestionnaireContext = {
  questions: Question[]
  currentIndex: number
  answers: {
    [key: string]: Answer
  }
  setAnswers?: Dispatch<
    SetStateAction<{
      [key: string]: Answer
    }>
  >
}

export const QuestionnaireContext = createContext<IQuestionnaireContext>({
  questions: [],
  currentIndex: 0,
  answers: {}
})

const Questionnaire: React.FC<IQuestionnaire> = ({
  questions: _questions = [],
  onQuestionnaireFinished
}) => {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<{
    [key: string]: Answer
  }>({})

  const { space } = useTheme()

  useEffect(() => {
    setQuestions(_questions)
  }, [_questions])

  const modifyQuestionBeforeRender: (question: Question) => Question =
    useCallback(
      (question: Question) => {
        if (question.label === 'Klasse') {
          const answer = answers['Schulform']

          if (!answer) {
            question.options = new Array(8).fill(0).map((_, i) => ({
              key: `${i + 5}`,
              label: t('lernfair.schoolclass', { class: i + 5 })
            }))
            return question
          }

          if (answer['grundschule']) {
            question.options = new Array(4).fill(0).map((_, i) => ({
              key: `${i + 1}`,
              label: t('lernfair.schoolclass', { class: i + 1 })
            }))
          } else {
            question.options = new Array(6).fill(0).map((_, i) => ({
              key: `${i + 5}`,
              label: t('lernfair.schoolclass', { class: i + 5 })
            }))
          }
          if (answer['gymnasium']) {
            question.options = new Array(8).fill(0).map((_, i) => ({
              key: `${i + 5}`,
              label: t('lernfair.schoolclass', { class: i + 5 })
            }))
          }
        }

        return question
      },
      [answers, t]
    )
  const currentQuestion = useMemo(() => {
    const question = { ...questions[currentIndex] }
    modifyQuestionBeforeRender(question)
    return question
  }, [questions, currentIndex, modifyQuestionBeforeRender])

  const modifyQuestionBeforeNext = useCallback(() => {
    if (currentQuestion.label === 'Sprache') {
      if (!answers['Sprache']) return
      const answer = Object.keys(answers['Sprache'])

      if (!answer) return
      if (!answer.includes('deutsch')) {
        const q: Question = {
          type: 'selection',
          imgRootPath: 'text',
          options: [
            { key: '<1', label: 'Weniger als 1 Jahr' },
            { key: '>1', label: 'Mehr als 1 Jahr' }
          ],
          label: 'Deutsch',
          question: 'Seit wann lernst du Deutsch?'
        }
        const qs = [...questions]
        qs.splice(currentIndex + 1, 0, q)
        setQuestions(qs)
      }
    }
    if (currentQuestion.label === 'Deutsch') {
      if (Object.keys(answers['Deutsch']).includes('<1')) {
        const qs = [...questions]
        qs.splice(currentIndex + 1, 1)
        setQuestions(qs)
      }
    }
  }, [answers, currentIndex, currentQuestion.label, questions])

  const next = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      onQuestionnaireFinished && onQuestionnaireFinished(answers)
    } else {
      modifyQuestionBeforeNext()
      setCurrentIndex(prev => prev + 1)
    }
  }, [
    answers,
    currentIndex,
    modifyQuestionBeforeNext,
    onQuestionnaireFinished,
    questions.length
  ])

  const isValidAnswer: boolean = useMemo(() => {
    const currentAnswer = answers[currentQuestion.label]

    if (!currentAnswer) return false

    const answercount = Object.values(currentAnswer || {}).filter(a => a).length

    return (
      answercount >= (currentQuestion.minSelections || 1) &&
      (currentQuestion.maxSelections
        ? answercount <= currentQuestion.maxSelections
        : true)
    )
  }, [
    answers,
    currentQuestion.label,
    currentQuestion.maxSelections,
    currentQuestion.minSelections
  ])

  const skip = useCallback(() => {
    delete answers[currentQuestion.label]
    next()
  }, [answers, currentQuestion.label, next])

  const back = useCallback(() => {
    setCurrentIndex(prev => prev - 1)
  }, [])

  if (questions.length === 0) return <></>

  return (
    <QuestionnaireContext.Provider
      value={{
        currentIndex,
        questions,
        answers,
        setAnswers
      }}>
      <Flex flex="1" pb={space['1']}>
        <Box
          paddingY={space['2']}
          bgColor="primary.500"
          justifyContent="center"
          alignItems="center"
          borderBottomRadius={8}>
          <Heading>{currentQuestion.label}</Heading>
        </Box>
        <Box paddingX={space['1']} mt={space['1']}>
          <Progress
            value={((currentIndex + 1) / questions.length) * 100}
            h="3.5"
            _filledTrack={{ backgroundColor: 'primary.900' }}
          />
          <Text fontWeight={600} mt={space['0.5']}>
            {t('questionnaire.step')} {currentIndex + 1} / {questions.length}
          </Text>
        </Box>
        <Flex flex="1" overflowY={'scroll'}>
          {currentQuestion.type === 'selection' && (
            <QuestionnaireSelectionView
              {...currentQuestion}
              prefill={answers[currentQuestion.label]}
            />
          )}
        </Flex>
        <VStack paddingX={space['1']} space={space['0.5']}>
          <Button isDisabled={!isValidAnswer} onPress={next}>
            {t('questionnaire.btn.next')}
          </Button>

          <Button onPress={skip} variant={'outline'}>
            {t('questionnaire.btn.skip')}
          </Button>

          {currentIndex > 0 && (
            <Button onPress={back} variant={'link'}>
              {t('questionnaire.btn.back')}
            </Button>
          )}
        </VStack>
      </Flex>
    </QuestionnaireContext.Provider>
  )
}

export default Questionnaire
