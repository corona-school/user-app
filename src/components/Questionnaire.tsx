import { Box, Button, Flex, Heading, VStack } from 'native-base'
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
}

export type IQuestionnaire = {
  questions: Question[]
}

const Questionnaire: React.FC<IQuestionnaire> = ({ questions = [] }) => {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const currentQuestion = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex]
  )

  if (questions.length === 0) return <></>

  return (
    <Flex flex="1">
      <Box
        h="200"
        bgColor="primary.500"
        justifyContent="center"
        alignItems="center">
        <Heading>{currentQuestion.label}</Heading>
      </Box>
      <Flex flex="1" overflowY={'scroll'}>
        {currentQuestion.type === 'selection' && (
          <QuestionnaireSelectionView {...currentQuestion} />
        )}
      </Flex>
      <VStack>
        <Button onPress={() => setCurrentIndex(prev => prev + 1)}>
          {t('questionnaire.btn.next')}
        </Button>

        <Button>{t('questionnaire.btn.skip')}</Button>

        {currentIndex > 0 && <Button>{t('questionnaire.btn.back')}</Button>}
      </VStack>
    </Flex>
  )
}

export default Questionnaire
