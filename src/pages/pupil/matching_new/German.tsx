import { VStack, useTheme, Heading, Column, Button } from 'native-base'
import { useCallback, useContext, useState } from 'react'
import AlertMessage from '../../../widgets/AlertMessage'
import IconTagList from '../../../widgets/IconTagList'
import TwoColGrid from '../../../widgets/TwoColGrid'
import { RequestMatchContext } from './RequestMatch'

const German: React.FC = () => {
  const { space } = useTheme()
  const { setMatching, setCurrentIndex } = useContext(RequestMatchContext)
  const [showSecond, setShowSecond] = useState<boolean>(false)
  const [isNativeLanguage, setIsNativeLanguage] = useState<'yes' | 'no'>()
  const [learningSince, setLearningSince] = useState<
    '<1' | '1-2' | '2-4' | '>4'
  >()

  const onGoNext = useCallback(() => {
    if (isNativeLanguage === 'no') {
      setShowSecond(true)
    } else {
      setCurrentIndex(3)
    }
  }, [isNativeLanguage, setCurrentIndex])

  const onSecondNext = useCallback(() => {
    switch (learningSince) {
      case '<1':
      case '1-2':
        setMatching(prev => ({ ...prev, setDazPriority: true }))
        setCurrentIndex(5) // 5 = details, skip subjects, priorities
        break
      case '2-4':
        setMatching(prev => ({ ...prev, setDazPriority: true }))
        setCurrentIndex(3) // 3 = subjects
        break
      case '>4':
      default:
        setCurrentIndex(3)
        break
    }
  }, [learningSince, setCurrentIndex, setMatching])

  return (
    <VStack paddingX={space['1']} space={space['0.5']}>
      <Heading fontSize="2xl">Deutschkenntnisse</Heading>
      {!showSecond && (
        <>
          <Heading>Ist Deutsch deine Muttersprache?</Heading>
          <TwoColGrid>
            <Column>
              <IconTagList
                initial={isNativeLanguage === 'yes'}
                variant="selection"
                text="Ja"
                onPress={() => setIsNativeLanguage('yes')}
              />
            </Column>
            <Column>
              <IconTagList
                initial={isNativeLanguage === 'no'}
                variant="selection"
                text="Nein"
                onPress={() => setIsNativeLanguage('no')}
              />
            </Column>
          </TwoColGrid>
          <Button onPress={onGoNext} isDisabled={!isNativeLanguage}>
            Weiter
          </Button>
          <Button variant="outline" onPress={() => setCurrentIndex(1)}>
            Zurück
          </Button>
        </>
      )}
      {showSecond && (
        <>
          <Heading>Seit wann lernst du Deutsch?</Heading>
          <TwoColGrid>
            <Column>
              <IconTagList
                initial={learningSince === '<1'}
                variant="selection"
                text="Weniger als 1 Jahr"
                textIcon="<1"
                onPress={() => setLearningSince('<1')}
              />
            </Column>
            <Column>
              <IconTagList
                initial={learningSince === '1-2'}
                variant="selection"
                text="1-2 Jahre"
                textIcon="1-2"
                onPress={() => setLearningSince('1-2')}
              />
            </Column>
            <Column>
              <IconTagList
                initial={learningSince === '2-4'}
                variant="selection"
                text="2-4 Jahre"
                textIcon="2-4"
                onPress={() => setLearningSince('2-4')}
              />
            </Column>
            <Column>
              <IconTagList
                initial={learningSince === '>4'}
                variant="selection"
                text="Mehr als 4 Jahre"
                textIcon=">4"
                onPress={() => setLearningSince('>4')}
              />
            </Column>
          </TwoColGrid>

          {(learningSince === '<1' || learningSince === '1-2') && (
            <AlertMessage content="Wir suchen nach einer Person für dich, die dir beim Deutschlernen hilft." />
          )}

          <Button onPress={onSecondNext} isDisabled={!learningSince}>
            Weiter
          </Button>
          <Button variant="outline" onPress={() => setShowSecond(false)}>
            Zurück
          </Button>
        </>
      )}
    </VStack>
  )
}
export default German
