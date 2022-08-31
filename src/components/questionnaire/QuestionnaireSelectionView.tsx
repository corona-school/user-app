import { Heading, Text, useTheme, VStack } from 'native-base'
import { useState } from 'react'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'
import { ISelectionItem } from './SelectionItem'

type Props = {
  options: ISelectionItem[]
  question: string
  text?: string
  imgRootPath: string
}

const QuestionnaireSelectionView: React.FC<Props> = ({
  options,
  question,
  text,
  imgRootPath
}) => {
  const [selections, setSelections] = useState<{ [key: string]: boolean }>({})
  const { space } = useTheme()

  return (
    <VStack paddingX={space['1']} paddingTop={space['1']}>
      <Heading>{question}</Heading>
      {text && <Text>{text}</Text>}
      <TwoColGrid>
        {options.map((opt, index) => (
          <IconTagList
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
          // <SelectionItem
          //   {...opt}
          //   selected={selections[opt.key]}
          //   onPress={() =>
          //     setSelections(prev => ({
          //       ...prev,
          //       [opt.key]: !selections[opt.key]
          //     }))
          //   }
          // />
        ))}
      </TwoColGrid>
    </VStack>
  )
}
export default QuestionnaireSelectionView
