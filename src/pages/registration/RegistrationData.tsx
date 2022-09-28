import {
  Button,
  Flex,
  Heading,
  Modal,
  Text,
  useTheme,
  VStack
} from 'native-base'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Questionnaire, {
  Answer,
  Question,
  QuestionnaireContext,
  SelectionQuestion
} from '../../components/Questionnaire'
import { pupilQuestions, tutorQuestions } from './questions'
import EventIcon from '../../assets/icons/lernfair/ic_event.svg'
import useModal from '../../hooks/useModal'
import { gql, useMutation } from '@apollo/client'
import useRegistration from '../../hooks/useRegistration'
import { useTranslation } from 'react-i18next'
import ToggleButton from '../../components/ToggleButton'
import { ISelectionItem } from '../../components/questionnaire/SelectionItem'

type Props = {}

// GraqhQL pupil mutation
const mutPupil = `mutation register(
  $firstname: String!
  $lastname: String!
  $email: String!
  $schooltype: SchoolType!
  $state: State!
  $password: String!
  $gradeAsInt: Int!
  $subjects: [String!]
) {
  meRegisterPupil(
    data: {
      firstname: $firstname
      lastname: $lastname
      email: $email
      newsletter: false
      registrationSource: normal
      redirectTo: null
      schooltype: $schooltype
      state: $state
    }
  ) {
    id
  }
  passwordCreate(password: $password)
  meUpdate(
    update: { pupil: { gradeAsInt: $gradeAsInt, subjects: $subjects } }
  )
}
`

// GraphQL student mutation
const mutTutor = `mutation register(
  $firstname: String!
  $lastname: String!
  $email: String!
  $password: String!
  $subjects: [SubjectInput!]

) {
  meRegisterStudent(
    data: {
      firstname: $firstname
      lastname: $lastname
      email: $email
      newsletter: false
      registrationSource: normal
      redirectTo: null
    }
  ) {
    id
  }
  passwordCreate(password: $password)
  meUpdate(update: {student:{subjects: $subjects}})
}
`

const RegistrationData: React.FC<Props> = () => {
  const { space } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [questions, setQuestions] = useState<Question[]>([])

  // questionnaire answers
  const [answers, setAnswers] = useState<{ [key: string]: Answer }>({})
  // answers reset to true instead of number
  // have to track classes seperately can't find the bug
  const [classes, setClasses] = useState<{ [key: string]: number }>({})

  // show global modal
  const { setShow, setContent, setVariant } = useModal()

  // data provided by previous slides
  const { firstname, lastname, email, password, userType } = useRegistration()

  // focused selection is pressed selectable item
  const [showFocusSelection, setShowFocusSelection] = useState<boolean>(false)
  const [focusedSelection, setFocusedSelection] = useState<ISelectionItem>({
    key: '',
    label: ''
  })

  // use different string depending on userType
  const [register, { data, error, loading }] = useMutation(
    gql`
      ${userType === 'pupil' ? mutPupil : mutTutor}
    `
  )

  useEffect(() => {
    // go to next slide if data is provided
    // TODO validate email
    if (!firstname && !lastname) navigate('/registration/2')
  }, [email, firstname, lastname, navigate, password])

  // at the end register the pupil with all data
  const registerPupil = useCallback(
    async (answers: { [key: string]: Answer }) => {
      const state = Object.keys(answers.Bundesland)[0]
      const schooltype = Object.keys(answers.Schulform)[0]

      const gradeAsInt = parseInt(Object.keys(answers.Klasse)[0])
      const subjects = Object.keys(answers.Fächer)

      await register({
        variables: {
          firstname,
          lastname,
          email,
          state,
          schooltype,
          password,
          gradeAsInt,
          subjects
        }
      })
    },
    [email, firstname, lastname, password, register]
  )

  // at the end register the student with all data
  const registerStudent = useCallback(async () => {
    const subjects = []
    for (let [sub, isSelected] of Object.entries(answers.Fächer)) {
      // assosiate subject with selected class range
      let minClass = 0
      let maxClass = 0

      switch (classes[sub]) {
        case 1:
          minClass = 1
          maxClass = 4
          break
        case 2:
          minClass = 5
          maxClass = 8
          break
        case 3:
          minClass = 9
          maxClass = 10
          break
        case 4:
          minClass = 11
          maxClass = 13
          break
      }

      if (isSelected && minClass > 0 && maxClass > 0) {
        subjects.push({ name: sub, grade: { min: minClass, max: maxClass } })
      }
    }

    await register({
      variables: {
        firstname,
        lastname,
        email,
        password,
        subjects
      }
    })
  }, [answers.Fächer, classes, email, firstname, lastname, password, register])

  // when all questions are answered, register
  const onQuestionnaireFinished = useCallback(
    async (answers: { [key: string]: Answer }) => {
      if (userType === 'pupil') {
        await registerPupil(answers)
      } else {
        await registerStudent()
      }
    },
    [registerPupil, registerStudent, userType]
  )

  // registration went through without error
  useEffect(() => {
    if (data && !error) {
      setVariant('dark')
      setContent(
        <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
          <EventIcon />
          <Heading color="lightText">Erledigt!</Heading>
          <Text color="lightText" fontSize={'lg'}>
            Dein Account wurde erfolgreich erstellt. Du kannst nun das Angebot
            von Lern-Fair nutzen!
          </Text>
          <Button
            w="100%"
            onPress={() => {
              setShow(false)
              navigate('/login')
            }}>
            Zur Anwendung
          </Button>
        </VStack>
      )
      setShow(true)
    }
  }, [navigate, data, error, setContent, setShow, setVariant, space])

  // registration has an error
  useEffect(() => {
    if (error) {
      setVariant('dark')
      setContent(
        <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
          <Text color="lightText">{error.message}</Text>
          <Button onPress={() => setShow(false)}>Zurück</Button>
        </VStack>
      )
      setShow(true)
    }
  }, [answers, error, setContent, setShow, setVariant, space])

  // if item is pressed, ask for school class for subject
  const askSchoolClassForSelection = useCallback(
    (item: ISelectionItem) => {
      if (answers?.Fächer && answers?.Fächer[item.key]) return
      setFocusedSelection(item)
      setShowFocusSelection(true)
    },
    [answers?.Fächer]
  )

  // populate questions depending on userType
  useEffect(() => {
    setQuestions(userType === 'pupil' ? pupilQuestions : tutorQuestions)
  }, [userType])

  // set state => class range for corresponding subject
  const answerFocusSelection = useCallback(
    (val: number) => {
      setClasses(prev => ({
        ...prev,
        [focusedSelection.key]: val
      }))
    },
    [focusedSelection.key]
  )

  // modify selection question based on answers etc
  const modifySelectionQuestionBeforeRender = useCallback(
    (question: SelectionQuestion) => {
      // is question about schoolclass?
      if (question.label === 'Klasse') {
        // change displayed classes based on selected schoolform
        const answer = answers['Schulform']

        if (!answer) {
          question.options = new Array(8).fill(0).map((_, i) => ({
            key: `${i + 5}`,
            label: t('lernfair.schoolclass', { class: i + 5 })
          }))
          return question
        }

        if (answer['grundschule']) {
          question.options = new Array(4).fill(0).map((_, i) => ({
            key: `${i + 1}`,
            label: t('lernfair.schoolclass', { class: i + 1 })
          }))
        } else {
          question.options = new Array(6).fill(0).map((_, i) => ({
            key: `${i + 5}`,
            label: t('lernfair.schoolclass', { class: i + 5 })
          }))
        }
        if (answer['gymnasium']) {
          question.options = new Array(8).fill(0).map((_, i) => ({
            key: `${i + 5}`,
            label: t('lernfair.schoolclass', { class: i + 5 })
          }))
        }
      }
      return question
    },
    [answers, t]
  )

  // modify questions based on answers etc
  const modifyQuestionBeforeRender = useCallback(
    (question: Question) => {
      if (question.type === 'selection') {
        modifySelectionQuestionBeforeRender(question as SelectionQuestion)
      }
    },
    [modifySelectionQuestionBeforeRender]
  )

  // get the current question in modified state
  const currentModifiedQuestion = useMemo(() => {
    const question = { ...questions[currentIndex] }
    modifyQuestionBeforeRender(question)
    return question
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
  }, [questions, currentIndex, modifyQuestionBeforeRender])

  // modify question before moving on to the next
  const modifyQuestionBeforeNext = () => {
    const currentQuestion = questions[currentIndex]
    // is question about language?
    if (currentQuestion.label === 'Sprache') {
      if (!answers['Sprache']) return
      const answer = Object.keys(answers['Sprache'])

      if (!answer) return

      // if answer does not include "deutsch" ask for more information
      if (!answer.includes('deutsch')) {
        const q: SelectionQuestion = {
          type: 'selection',
          imgRootPath: 'text',
          options: [
            { key: '<1', label: 'Weniger als 1 Jahr' },
            { key: '>1', label: 'Mehr als 1 Jahr' }
          ],
          label: 'Deutsch',
          question: 'Seit wann lernst du Deutsch?'
        }

        const qs = [...questions]
        qs.splice(currentIndex + 1, 0, q)
        setQuestions && setQuestions(qs)
      }
    }
    // if question is followup question to "Sprache"/language
    // react to answer and add new question to questionnaire
    if (currentQuestion.label === 'Deutsch') {
      if (Object.keys(answers['Deutsch']).includes('<1')) {
        const qs = [...questions]
        qs.splice(currentIndex + 1, 1)
        setQuestions && setQuestions(qs)
      }
    }
  }

  return (
    <QuestionnaireContext.Provider
      value={{
        currentIndex,
        questions,
        answers,
        currentQuestion: currentModifiedQuestion,
        setAnswers,
        setQuestions,
        setCurrentIndex
      }}>
      <Flex flex="1">
        <Questionnaire
          disableNavigation={loading}
          onQuestionnaireFinished={onQuestionnaireFinished}
          onPressItem={(item: ISelectionItem) => {
            if (userType === 'tutor') {
              if (currentModifiedQuestion?.label === 'Fächer') {
                askSchoolClassForSelection(item)
              }
            }
          }}
          modifyQuestionBeforeNext={modifyQuestionBeforeNext}
        />
      </Flex>

      <Modal isOpen={showFocusSelection}>
        <Modal.Content>
          <Modal.Header>
            <Heading>In welchen Klassen kannst du unterstützen?</Heading>
          </Modal.Header>
          <Modal.Body>
            <ToggleButton
              label={'1-4 Klasse'}
              dataKey="1"
              isActive={classes[focusedSelection.key] === 1}
              onPress={key => answerFocusSelection(1)}
            />
            <ToggleButton
              label={'5-8 Klasse'}
              dataKey="2"
              isActive={classes[focusedSelection.key] === 2}
              onPress={key => answerFocusSelection(2)}
            />
            <ToggleButton
              label={'9-10 Klasse'}
              dataKey="3"
              isActive={classes[focusedSelection.key] === 3}
              onPress={key => answerFocusSelection(3)}
            />
            <ToggleButton
              label={'11-13 Klasse'}
              dataKey="4"
              isActive={classes[focusedSelection.key] === 4}
              onPress={key => answerFocusSelection(4)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onPress={() => {
                setShowFocusSelection(false)
              }}>
              Speichern
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </QuestionnaireContext.Provider>
  )
}
export default RegistrationData
