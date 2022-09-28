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
  useContext,
  useMemo
} from 'react'
import { useTranslation } from 'react-i18next'
import QuestionnaireSelectionView from './questionnaire/QuestionnaireSelectionView'
import { ISelectionItem } from './questionnaire/SelectionItem'

export type Question = {
  label: string
  question: string
  type: 'selection'
  text?: string
}

export interface SelectionQuestion extends Question {
  imgRootPath: string
  minSelections?: number
  maxSelections?: number
  options: ISelectionItem[]
  viewType?: 'normal' | 'large'
}

export type Answer<T = boolean | number> = {
  [key: string]: T
}

type IQuestionnaireContext = {
  questions: Question[]
  currentQuestion: Question
  setQuestions?: Dispatch<SetStateAction<Question[]>>
  currentIndex: number
  setCurrentIndex?: Dispatch<SetStateAction<number>>
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
  answers: {},
  currentQuestion: { label: '', question: '', type: 'selection' }
})

export type IQuestionnaire = {
  onQuestionnaireFinished: (answers: { [key: string]: Answer }) => any
  onPressItem?: (data?: any) => any
  onQuestionChanged?: (question: Question) => any
  modifySelectionQuestionBeforeRender?: () => any
  modifyQuestionBeforeNext?: () => any
  disableNavigation?: boolean
}

const Questionnaire: React.FC<IQuestionnaire> = ({
  onQuestionnaireFinished,
  onPressItem,
  modifyQuestionBeforeNext,
  disableNavigation
}) => {
  const { t } = useTranslation()
  const { space } = useTheme()

  const { currentIndex, questions, answers, setCurrentIndex, currentQuestion } =
    useContext(QuestionnaireContext)

  /**
   * check if index is not at the tail end of questions
   * if it is, end the questionnaire
   * else move on after modifying the question
   * if the prop exists
   */
  const next = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      onQuestionnaireFinished && onQuestionnaireFinished(answers)
    } else {
      modifyQuestionBeforeNext && modifyQuestionBeforeNext()
      setCurrentIndex && setCurrentIndex(prev => prev + 1)
    }
  }, [
    answers,
    currentIndex,
    modifyQuestionBeforeNext,
    onQuestionnaireFinished,
    questions.length,
    setCurrentIndex
  ])

  // check if answer is valid when question type is selection
  const isValidSelectionAnswer: (answer: Answer) => boolean = useCallback(
    (answer: Answer) => {
      const question = currentQuestion as SelectionQuestion
      const answercount = Object.values(answer || {}).filter(a => !!a).length
      return (
        answercount >= (question.minSelections || 1) &&
        (question.maxSelections ? answercount <= question.maxSelections : true)
      )
    },
    [currentQuestion]
  )

  // check if current answer is appropriate for corresponding type
  const isValidAnswer: boolean = useMemo(() => {
    const currentAnswer = answers[currentQuestion.label]
    let isValid = false
    if (!currentAnswer) return false
    if (currentQuestion.type === 'selection') {
      isValid = isValidSelectionAnswer(currentAnswer)
    }

    return isValid
  }, [
    answers,
    currentQuestion.label,
    currentQuestion.type,
    isValidSelectionAnswer
  ])

  // skip one question
  const skip = useCallback(() => {
    delete answers[currentQuestion.label]
    next()
  }, [answers, currentQuestion.label, next])

  // go one question back
  const back = useCallback(() => {
    setCurrentIndex && setCurrentIndex(prev => prev - 1)
  }, [setCurrentIndex])

  if (questions.length === 0) return <></>

  return (
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
            {...(currentQuestion as SelectionQuestion)}
            prefill={answers[currentQuestion.label]}
            onPressSelection={onPressItem}
          />
        )}
      </Flex>
      <VStack paddingX={space['1']} space={space['0.5']}>
        <Button isDisabled={disableNavigation || !isValidAnswer} onPress={next}>
          {t('questionnaire.btn.next')}
        </Button>

        <Button
          isDisabled={disableNavigation}
          onPress={skip}
          variant={'outline'}>
          {t('questionnaire.btn.skip')}
        </Button>

        {currentIndex > 0 && (
          <Button
            isDisabled={disableNavigation}
            onPress={back}
            variant={'link'}>
            {t('questionnaire.btn.back')}
          </Button>
        )}
      </VStack>
    </Flex>
  )
}

export default Questionnaire
