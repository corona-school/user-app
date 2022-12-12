import { gql, useMutation } from '@apollo/client'
import {
  Text,
  VStack,
  Heading,
  Button,
  useTheme,
  TextArea,
  useToast
} from 'native-base'
import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import useModal from '../../../hooks/useModal'
import { LFSubject } from '../../../types/lernfair/Subject'
import { RequestMatchContext } from './Matching'

type Props = {}

const Details: React.FC<Props> = () => {
  const { setShow, setContent, setVariant } = useModal()
  const { space } = useTheme()
  const toast = useToast()
  const { matching, setMatching } = useContext(RequestMatchContext)
  const navigate = useNavigate()

  const [update, _update] = useMutation(gql`
    mutation update($subjects: [SubjectInput!]) {
      meUpdate(update: { pupil: { subjects: $subjects } })
    }
  `)

  const showModal = useCallback(() => {
    setVariant('dark')

    setContent(
      <VStack>
        <Heading fontSize={'2xl'}>
          Geschafft, du bist auf der Warteliste!
        </Heading>

        <Button>Zu den Gruppenkursen</Button>
        <Button
          variant={'outline'}
          onPress={() => {
            navigate('/start')
            setShow(false)
          }}>
          Fertig
        </Button>
      </VStack>
    )
    setShow(true)
  }, [navigate, setContent, setShow, setVariant])

  const requestMatch = useCallback(async () => {
    const subs: LFSubject[] = []
    for (const sub of matching.subjects) {
      const data = { name: sub.label } as { name: string; mandatory?: boolean }
      if (matching.priority === sub) {
        data.mandatory = true
      }
      subs.push(data)
    }

    const res = await update({ variables: { subjects: subs } })

    if (res.data && !res.errors) {
      showModal()
    } else {
      toast.show({ description: 'Es ist ein Fehler aufgetreten' })
    }
  }, [matching.priority, matching.subjects, showModal, toast, update])

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
      <Button isDisabled={_update.loading} onPress={requestMatch}>
        Weiter
      </Button>
    </VStack>
  )
}
export default Details
