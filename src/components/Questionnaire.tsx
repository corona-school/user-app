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
import { useMemo, useState } from 'react'
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
}

export type IQuestionnaire = {
  questions: Question[]
}

const Questionnaire: React.FC<IQuestionnaire> = ({ questions = [] }) => {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const { space } = useTheme()
  const currentQuestion = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex]
  )

  if (questions.length === 0) return <></>

  return (
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
          value={(currentIndex / questions.length) * 100}
          h="3.5"
          _filledTrack={{ backgroundColor: 'primary.900' }}
        />
        <Text fontWeight={600} mt={space['0.5']}>
          Schritt {currentIndex + 1} / {questions.length}
        </Text>
      </Box>
      <Flex flex="1" overflowY={'scroll'}>
        {currentQuestion.type === 'selection' && (
          <QuestionnaireSelectionView {...currentQuestion} />
        )}
      </Flex>
      <VStack paddingX={space['1']} space={space['0.5']}>
        <Button onPress={() => setCurrentIndex(prev => prev + 1)}>
          {t('questionnaire.btn.next')}
        </Button>

        <Button variant={'outline'}>{t('questionnaire.btn.skip')}</Button>

        {currentIndex > 0 && (
          <Button variant={'link'}>{t('questionnaire.btn.back')}</Button>
        )}
      </VStack>
    </Flex>
  )
}

export default Questionnaire
