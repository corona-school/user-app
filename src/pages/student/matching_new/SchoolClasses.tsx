import {
  useTheme,
  VStack,
  Heading,
  Button,
  useToast,
  Text,
  useBreakpointValue,
  Box
} from 'native-base'
import { useCallback, useContext, useState } from 'react'
import Card from '../../../components/Card'
import { RequestMatchContext } from './RequestMatch'
import { Slider } from '@miblanchard/react-native-slider'
import { gql, useMutation } from '@apollo/client'
import { ClassRange } from '../../../types/lernfair/SchoolClass'
import { useNavigate } from 'react-router-dom'
import useModal from '../../../hooks/useModal'
import PartyIcon from '../../../assets/icons/lernfair/lf-party.svg'
import { getSubjectLabel } from '../../../types/lernfair/Subject'

type Props = {}

const SchoolClasses: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const toast = useToast()
  const { matching, setMatching, setCurrentIndex, isEdit } =
    useContext(RequestMatchContext)
  const navigate = useNavigate()
  const { setShow, setContent, setVariant } = useModal()

  const buttonWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const [updateSubjects] = useMutation(gql`
    mutation updateStudentSubjects($subjects: [SubjectInput!]) {
      meUpdate(update: { student: { subjects: $subjects } })
    }
  `)

  const [createMatchRequest] = useMutation(gql`
    mutation {
      studentCreateMatchRequest
    }
  `)

  const setSubjectClass = useCallback(
    (subjectKey: string, value: [number, number]) => {
      setMatching(prev => ({
        ...prev,
        schoolClasses: {
          ...prev.schoolClasses,
          [subjectKey]: value
        }
      }))
    },
    [setMatching]
  )

  const showModal = useCallback(() => {
    setVariant('dark')

    setContent(
      <VStack
        paddingX={space['2']}
        paddingTop={space['2']}
        space={space['1']}
        alignItems="center"
        height="100%">
        <Box
          maxWidth="600px"
          height="100%"
          justifyContent="center"
          alignItems="center"
          textAlign="center">
          <PartyIcon />
          <Heading
            fontSize={'2xl'}
            color="lightText"
            textAlign="center"
            marginY={space['1.5']}>
            Geschafft, du bist ein:e Held:in!
          </Heading>
          <Text color="lightText" textAlign="center" marginBottom={space['1']}>
            Danke, dass du eine:n (weitere:n) Schüler:in unterstützen möchtest!
          </Text>
          <Text color="lightText" textAlign="center" marginBottom={space['1']}>
            Wir suchen nun eine:n geignete:n Schüler:in für dich. Die Suche
            dauert in der Regel maximal eine Woche. Sobald wir jemanden für dich
            gefunden haben, werden wir dich direkt per E-Mail benachrichtigen.
            Solltest du Fragen haben, kannst du dich jederzeit bei uns melden.
          </Text>
          <Button
            w={buttonWidth}
            onPress={() => {
              navigate('/matching', {
                state: { tabID: 1 }
              })
              setShow(false)
            }}>
            Fertig
          </Button>
        </Box>
      </VStack>
    )
    setShow(true)
  }, [buttonWidth, navigate, setContent, setShow, setVariant, space])

  const submit = useCallback(async () => {
    const classes = { ...matching.schoolClasses }

    for (const sub of matching.subjects) {
      if (!classes[sub.key]) {
        classes[sub.key] = [1, 13]
      }
    }

    if (matching.setDazSupport) {
      if (!matching.schoolClasses['daz']) {
        classes['daz'] = [1, 13]
      }
    }

    const subjects: { name: string; grade: ClassRange }[] = []

    for (const [subjectKey, selectedClasses] of Object.entries(classes)) {
      subjects.push({
        name: getSubjectLabel(subjectKey),
        grade: { min: selectedClasses[0], max: selectedClasses[1] }
      })
    }

    const resSubs = await updateSubjects({ variables: { subjects: subjects } })
    if (resSubs.data && !resSubs.errors) {
      if (!isEdit) {
        const resRequest = await createMatchRequest()

        if (resRequest.data && !resRequest.errors) {
          showModal()
        } else {
          toast.show({ description: 'Es ist ein Fehler aufgetreten' })
        }
      } else {
        showModal()
      }
    } else {
      toast.show({ description: 'Es ist ein Fehler aufgetreten' })
    }
  }, [
    createMatchRequest,
    isEdit,
    matching.schoolClasses,
    matching.setDazSupport,
    matching.subjects,
    showModal,
    toast,
    updateSubjects
  ])

  return (
    <VStack paddingX={space['1']} space={space['0.5']}>
      <Heading fontSize="2xl">Jahrgangsstufen</Heading>
      <Heading>In welchen Jahrgangsstufen möchtest du helfen?</Heading>
      <VStack space={space['1']}>
        {matching.setDazSupport && (
          <Item
            subject={{ key: 'daz', label: 'Deutsch als Zweitsprache' }}
            onClassChanged={val => setSubjectClass('daz', val)}
          />
        )}

        {matching.subjects.map((sub: { label: string; key: string }) => (
          <Item
            subject={sub}
            onClassChanged={val => setSubjectClass(sub.key, val)}
          />
        ))}
      </VStack>

      <Button onPress={submit}>Weiter</Button>
      <Button variant="outline" onPress={() => setCurrentIndex(2)}>
        Zurück
      </Button>
    </VStack>
  )
}
export default SchoolClasses

const Item: React.FC<{
  subject: {
    label: string
    key: string
  }
  onClassChanged: (value: [number, number]) => void
}> = ({ subject, onClassChanged }) => {
  const { space, colors } = useTheme()
  const [range, setRange] = useState<[number, number]>([1, 13])

  return (
    <Card flexibleWidth padding={space['1']}>
      <VStack space={space['0.5']}>
        <Heading fontSize="md">{subject.label}</Heading>
        <Heading fontSize="md">
          Klasse {range[0]}-{range[1]}
        </Heading>

        <Slider
          animateTransitions
          minimumValue={1}
          maximumValue={13}
          minimumTrackTintColor={colors['primary']['500']}
          thumbTintColor={colors['primary']['900']}
          value={range}
          step={1}
          onValueChange={(value: number | number[]) => {
            setRange(value as [number, number])
            onClassChanged(value as [number, number])
          }}
        />
      </VStack>
    </Card>
  )
}
