import { Heading, Text, useTheme, VStack } from 'native-base'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserType } from '../../types/lernfair/User'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'
import { Answer, QuestionnaireContext } from '../Questionnaire'
import { ISelectionItem } from './SelectionItem'

type Props = {
  options: ISelectionItem[]
  id: string
  imgRootPath: string
  prefill?: Answer
  onPressSelection: undefined | ((selection: ISelectionItem) => any)
  userType: UserType
}

const QuestionnaireSelectionView: React.FC<Props> = ({
  options,
  id,
  userType,
  imgRootPath,
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
  }, [id])

  useEffect(() => {
    if (!setAnswers) return
    const sel: Answer = { ...selections }
    for (const k in sel) {
      if (!sel[k]) delete sel[k]
    }
    setAnswers(prev => ({ ...prev, [id]: sel }))
  }, [id, selections, setAnswers])

  const textFormatted = useMemo(
    () =>
      t(`registration.questions.${userType}.${id}.text`, { defaultValue: '' }),
    [t, userType, id]
  )

  return (
    <VStack paddingX={space['1']} paddingTop={space['1']}>
      <Heading>
        {t(`registration.questions.${userType}.${id}.question`)}
      </Heading>
      {textFormatted && <Text>{textFormatted}</Text>}
      <TwoColGrid>
        {options.map((opt, index) => (
          <IconTagList
            key={`${imgRootPath}-${index}`}
            initial={!!selections[opt.key]}
            text={opt.label}
            variant="selection"
            textIcon={(imgRootPath === 'text' && opt.key) || undefined}
            iconPath={
              (imgRootPath !== 'text' &&
                `${imgRootPath}/icon_${opt.key}.svg`) ||
              undefined
            }
            onPress={() => {
              setSelections(prev => ({
                ...prev,
                [opt.key]: !selections[opt.key]
              }))
              onPressSelection && onPressSelection(opt)
            }}
          />
        ))}
      </TwoColGrid>
    </VStack>
  )
}
export default QuestionnaireSelectionView
