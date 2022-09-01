import { Heading, Text, useTheme, VStack } from 'native-base'
import { useContext, useEffect, useState } from 'react'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'
import { QuestionnaireContext } from '../Questionnaire'
import { ISelectionItem } from './SelectionItem'

type Props = {
  options: ISelectionItem[]
  question: string
  text?: string
  imgRootPath: string
  label: string
}

const QuestionnaireSelectionView: React.FC<Props> = ({
  options,
  question,
  label,
  text,
  imgRootPath
}) => {
  const { setAnswers } = useContext(QuestionnaireContext)
  const [selections, setSelections] = useState<{ [key: string]: boolean }>({})
  const { space } = useTheme()

  useEffect(() => {
    return () => {
      setSelections({})
    }
  }, [question])

  useEffect(() => {
    if (!setAnswers) return
    const sel = { ...selections }
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
            text={imgRootPath === 'text' ? `${index + 1}. Klasse` : opt.label}
            variant="selection"
            textIcon={
              (imgRootPath === 'text' && (index + 1).toString()) || undefined
            }
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
