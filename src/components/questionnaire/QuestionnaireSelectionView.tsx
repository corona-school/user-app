import { Column, Heading, Pressable, Text, useTheme, VStack } from 'native-base'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserType } from '../../types/lernfair/User'
import CTACard from '../../widgets/CTACard'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'
import {
  Answer,
  ObjectAnswer,
  QuestionnaireContext,
  SelectionQuestion
} from '../Questionnaire'
import { ISelectionItem } from './SelectionItem'
import BooksIcon from '../../assets/icons/lernfair/lf-books.svg'

type Props = {
  currentQuestion: SelectionQuestion
  prefill?: Answer
  onPressSelection: undefined | ((selection: ISelectionItem) => any)
  userType: UserType
}

const QuestionnaireSelectionView: React.FC<Props> = ({
  currentQuestion,
  userType,
  prefill,
  onPressSelection
}) => {
  const { t } = useTranslation()
  const { setAnswers } = useContext(QuestionnaireContext)
  const [selections, setSelections] = useState<Answer>({})
  const { space } = useTheme()

  useEffect(() => {
    setSelections(prefill || {})
    return () => {
      setSelections({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion.id])

  useEffect(() => {
    if (!setAnswers) return
    const sel: ObjectAnswer = { ...selections }
    for (const k in sel) {
      if (!sel[k]) delete sel[k]
    }
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: sel }))
  }, [currentQuestion.id, selections, setAnswers])

  const textFormatted = useMemo(
    () =>
      t(`registration.questions.${userType}.${currentQuestion.id}.text`, {
        defaultValue: ''
      }),
    [t, userType, currentQuestion.id]
  )

  const Wrapper =
    (currentQuestion.viewType || 'normal') === 'normal' ? TwoColGrid : Column

  return (
    <VStack paddingX={space['1']} paddingTop={space['1']}>
      <Heading>
        {t(`registration.questions.${userType}.${currentQuestion.id}.question`)}
      </Heading>
      {textFormatted && <Text>{textFormatted}</Text>}
      <Wrapper>
        {currentQuestion.options.map(
          (opt, index) =>
            (currentQuestion.viewType === 'large' && (
              <Pressable
                mt={space['1']}
                onPress={() => {
                  setSelections((prev: Answer) => ({
                    ...prev,
                    [opt.key]: !selections[opt.key]
                  }))
                  onPressSelection && onPressSelection(opt)
                }}>
                <CTACard
                  key={`${currentQuestion.imgRootPath}-${index}`}
                  title={opt.label}
                  closeable={false}
                  content={opt.text && <Text>{opt.text}</Text>}
                  icon={<BooksIcon />}
                  variant={selections[opt.key] ? 'dark' : 'normal'}
                />
              </Pressable>
            )) || (
              <IconTagList
                key={`${currentQuestion.imgRootPath}-${index}`}
                initial={!!selections[opt.key]}
                text={opt.label}
                variant="selection"
                textIcon={
                  (currentQuestion.imgRootPath === 'text' && opt.key) ||
                  undefined
                }
                iconPath={
                  (currentQuestion.imgRootPath !== 'text' &&
                    `${currentQuestion.imgRootPath}/icon_${opt.key}.svg`) ||
                  undefined
                }
                onPress={() => {
                  setSelections((prev: Answer) => ({
                    ...prev,
                    [opt.key]: !selections[opt.key] ? opt : false
                  }))
                  onPressSelection && onPressSelection(opt)
                }}
              />
            )
        )}
      </Wrapper>
    </VStack>
  )
}
export default QuestionnaireSelectionView
