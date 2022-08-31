import { Heading, Text, VStack } from 'native-base'
import { useState } from 'react'
import TwoColGrid from '../../widgets/TwoColGrid'
import SelectionItem, { ISelectionItem } from './SelectionItem'

type Props = {
  options: ISelectionItem[]
  question: string
  text?: string
}

const QuestionnaireSelectionView: React.FC<Props> = ({
  options,
  question,
  text
}) => {
  const [selections, setSelections] = useState<{ [key: string]: boolean }>({})

  return (
    <VStack>
      <Heading>{question}</Heading>
      {text && <Text>{text}</Text>}
      <TwoColGrid>
        {options.map(opt => (
          <SelectionItem
            {...opt}
            selected={selections[opt.key]}
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
