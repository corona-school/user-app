import { gql, useMutation } from '@apollo/client'
import {
  Text,
  VStack,
  Heading,
  Button,
  useTheme,
  TextArea,
  useToast,
  useBreakpointValue
} from 'native-base'
import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import useModal from '../../../hooks/useModal'
import { LFSubject } from '../../../types/lernfair/Subject'
import { RequestMatchContext } from './RequestMatch'
import PartyIcon from '../../../assets/icons/lernfair/lf-party.svg'

type Props = {}

const Details: React.FC<Props> = () => {
  const { setShow, setContent, setVariant } = useModal()
  const { space, sizes } = useTheme()
  const toast = useToast()
  const { matching, setMatching, setCurrentIndex } =
    useContext(RequestMatchContext)
  const navigate = useNavigate()

  const [update, _update] = useMutation(gql`
    mutation updatePupil($subjects: [SubjectInput!]) {
      meUpdate(update: { pupil: { subjects: $subjects } })
      pupilCreateMatchRequest
    }
  `)

  const buttonWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const showModal = useCallback(() => {
    setVariant('dark')

    setContent(
      <VStack
        paddingX={space['2']}
        paddingTop={space['2']}
        space={space['1']}
        alignItems="center">
        <PartyIcon />
        <Heading fontSize={'2xl'} color="lightText" textAlign="center">
          Geschafft, du bist auf der Warteliste!
        </Heading>

        <Button onPress={() => navigate('/group')} w={buttonWidth}>
          Zu den Gruppenkursen
        </Button>
        <Button
          w={buttonWidth}
          variant={'outlinelight'}
          onPress={() => {
            navigate('/matching', {
              state: { tabID: 1 }
            })
            setShow(false)
          }}>
          Fertig
        </Button>
      </VStack>
    )
    setShow(true)
  }, [buttonWidth, navigate, setContent, setShow, setVariant, space])

  const requestMatch = useCallback(async () => {
    const subs: LFSubject[] = []
    for (const sub of matching.subjects) {
      const data = { name: sub.label } as { name: string; mandatory?: boolean }
      if (matching.priority === sub) {
        data.mandatory = true
      }
      subs.push(data)
    }

    if (matching.setDazPriority) {
      subs.push({ name: 'Deutsch als Zweitsprache', mandatory: true })
    }

    const res = await update({ variables: { subjects: subs } })

    if (res.data && !res.errors) {
      showModal()
    } else {
      toast.show({ description: 'Es ist ein Fehler aufgetreten' })
    }
  }, [
    matching.priority,
    matching.setDazPriority,
    matching.subjects,
    showModal,
    toast,
    update
  ])

  return (
    <VStack paddingX={space['1']} space={space['0.5']}>
      <Heading fontSize="2xl">Details</Heading>
      <Heading>
        Möchtest du noch etwas an deine:n zuküftigen Lernpartner:in loswerden?
      </Heading>

      <Text>
        Hier kannst du weitere Angaben zu dir oder deiner aktuellen Situation
        machen, z.B. hast du ein spezielles Thema bei dem du Hilfe benötigst
        oder gibt es etwas, was deine Lernpartner:in über dich wissen sollte?
        Wir leiten diesen Text an deine:n zukünftige:n Lernpartner:in weiter.
      </Text>

      <Heading fontSize="md" mt={space['1']}>
        Deine Angaben
      </Heading>
      <TextArea
        placeholder="Was sollte dein:e zukünftige:r Lernpartner:in über dich wissen?"
        autoCompleteType={'off'}
        value={matching.message}
        onChangeText={text => setMatching(prev => ({ ...prev, message: text }))}
      />
      <Button
        isDisabled={_update.loading}
        onPress={requestMatch}
        w={buttonWidth}>
        Weiter
      </Button>

      <Button
        variant="outline"
        onPress={() => setCurrentIndex(4)}
        w={buttonWidth}>
        Zurück
      </Button>
    </VStack>
  )
}
export default Details
