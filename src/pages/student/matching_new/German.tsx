import { VStack, useTheme, Heading, Column, Button } from 'native-base'
import { useCallback, useContext, useState } from 'react'
import IconTagList from '../../../widgets/IconTagList'
import TwoColGrid from '../../../widgets/TwoColGrid'
import { RequestMatchContext } from './RequestMatch'

const German: React.FC = () => {
  const { space } = useTheme()
  const { setMatching, setCurrentIndex } = useContext(RequestMatchContext)
  const [supportDaz, setSupportDaz] = useState<'yes' | 'no'>()

  const onGoNext = useCallback(() => {
    setMatching(prev => ({ ...prev, setDazSupport: supportDaz === 'yes' }))
    setCurrentIndex(3) // school classes
  }, [setMatching, setCurrentIndex, supportDaz])

  return (
    <VStack paddingX={space['1']} space={space['0.5']}>
      <Heading fontSize="2xl">Deutsch als Zweitsprache</Heading>
      <Heading>
        Kannst du dir vorstellen Schüler:innen zu unterstützen, die Deutsch als
        Zweitsprache sprechen und nur über wenige Deutschkenntnisse verfügen?
      </Heading>
      <TwoColGrid>
        <Column>
          <IconTagList
            initial={supportDaz === 'yes'}
            variant="selection"
            text="Ja"
            onPress={() => setSupportDaz('yes')}
          />
        </Column>
        <Column>
          <IconTagList
            initial={supportDaz === 'no'}
            variant="selection"
            text="Nein"
            onPress={() => setSupportDaz('no')}
          />
        </Column>
      </TwoColGrid>
      <Button onPress={onGoNext} isDisabled={!supportDaz}>
        Weiter
      </Button>
    </VStack>
  )
}
export default German
