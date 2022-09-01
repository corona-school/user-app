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

export type Answer = {}

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
  questions = [],
  onQuestionnaireFinished
}) => {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const [answers, setAnswers] = useState<{
    [key: string]: Answer
  }>({})

  const { space } = useTheme()
  const currentQuestion = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex]
  )

  const next = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      onQuestionnaireFinished && onQuestionnaireFinished(answers)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }, [answers, currentIndex, onQuestionnaireFinished, questions.length])

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

  if (questions.length === 0) return <></>

  return (
    <QuestionnaireContext.Provider
      value={{
        currentIndex,
        questions,
        answers,
        setAnswers
      }}>
      <Flex flex="1">
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
            <QuestionnaireSelectionView {...currentQuestion} />
          )}
        </Flex>
        <VStack paddingX={space['1']} space={space['0.5']}>
          <Button isDisabled={!isValidAnswer} onPress={next}>
            {t('questionnaire.btn.next')}
          </Button>

          <Button variant={'outline'}>{t('questionnaire.btn.skip')}</Button>

          {currentIndex > 0 && (
            <Button variant={'link'}>{t('questionnaire.btn.back')}</Button>
          )}
        </VStack>
      </Flex>
    </QuestionnaireContext.Provider>
  )
}

export default Questionnaire
