import { Heading, Text, useTheme, VStack } from 'native-base'
import { useContext, useEffect, useState } from 'react'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'
import { Answer, QuestionnaireContext } from '../Questionnaire'
import { ISelectionItem } from './SelectionItem'

type Props = {
  options: ISelectionItem[]
  question: string
  text?: string
  imgRootPath: string
  label: string
  prefill?: Answer
}

const QuestionnaireSelectionView: React.FC<Props> = ({
  options,
  question,
  label,
  text,
  imgRootPath,
  prefill
}) => {
  const { setAnswers } = useContext(QuestionnaireContext)
  const [selections, setSelections] = useState<Answer>({})
  const { space } = useTheme()

  useEffect(() => {
    setSelections(prefill || {})
    return () => {
      setSelections({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question])

  useEffect(() => {
    if (!setAnswers) return
    const sel: Answer = { ...selections }
    for (const key in sel) {
      if (!sel[key]) delete sel[key]
    }
    setAnswers(prev => ({ ...prev, [label]: sel }))
  }, [label, selections, setAnswers])

  return (
    <VStack paddingX={space['1']} paddingTop={space['1']}>
      <Heading>{question}</Heading>
      {text && <Text>{text}</Text>}
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
            onPress={() =>
              setSelections(prev => ({
                ...prev,
                [opt.key]: !selections[opt.key]
              }))
            }
          />
        ))}
      </TwoColGrid>
    </VStack>
  )
}
export default QuestionnaireSelectionView
