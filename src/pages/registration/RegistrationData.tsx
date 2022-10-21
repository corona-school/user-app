import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  Text,
  useBreakpointValue,
  useTheme,
  VStack
} from 'native-base'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Questionnaire, {
  Answer,
  ObjectAnswer,
  Question,
  QuestionnaireContext,
  SelectionQuestion
} from '../../components/Questionnaire'
import { pupilQuestions, studentQuestions } from './questions'
import EventIcon from '../../assets/icons/lernfair/ic_event.svg'
import useModal from '../../hooks/useModal'
import { gql, useMutation } from '@apollo/client'
import useRegistration from '../../hooks/useRegistration'
import { useTranslation } from 'react-i18next'
import ToggleButton from '../../components/ToggleButton'
import { ISelectionItem } from '../../components/questionnaire/SelectionItem'
import Utility from '../../Utility'
import { LFSubject } from '../../types/lernfair/Subject'

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
  $subjects: [SubjectInput!]
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
const mutStudent = `mutation register(
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
  const { space, sizes } = useTheme()
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
      ${userType === 'pupil' ? mutPupil : mutStudent}
    `
  )

  useEffect(() => {
    // go to next slide if data is provided
    // TODO validate email
    if (!firstname && !lastname) navigate('/registration/2')
  }, [email, firstname, lastname, navigate, password])

  // at the end register the pupil with all data
  const registerPupil = useCallback(
    async (answers: { [key: string]: ObjectAnswer }) => {
      const state = Object.keys(answers.state)[0]
      const schooltype = Object.keys(answers.schooltype)[0]

      const gradeAsInt = parseInt(Object.keys(answers.schoolclass)[0])
      // const subjects = Object.keys(answers.subjects)
      const subjects = answers.subjects

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
    for (let [sub, isSelected] of Object.entries(answers.subjects)) {
      const grades = Utility.intToClassRange(classes[sub])
      if (isSelected && grades.min > 0 && grades.max > 0) {
        subjects.push({ name: sub, grade: grades })
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
  }, [
    answers.subjects,
    classes,
    email,
    firstname,
    lastname,
    password,
    register
  ])

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

  const ModalContainerWidth = useBreakpointValue({
    base: '90%',
    lg: '500px'
  })

  // registration went through without error
  useEffect(() => {
    if (data && !error) {
      setVariant('dark')
      setContent(
        <VStack
          space={space['1']}
          p={space['1']}
          flex="1"
          width={ModalContainerWidth}
          marginX="auto"
          alignItems="center"
          justifyContent="center">
          <Box justifyContent="center" marginLeft="40px">
            <EventIcon />
          </Box>
          <Heading
            textAlign="center"
            marginX="auto"
            width={ModalContainerWidth}
            color="lightText">
            {t('registration.result.success.title')}
          </Heading>
          <Text
            textAlign="center"
            marginX="auto"
            width={ModalContainerWidth}
            color="lightText"
            fontSize={'lg'}>
            {t('registration.result.success.text')}
          </Text>
          <Button
            marginX="auto"
            width={ModalContainerWidth}
            onPress={() => {
              setShow(false)
              navigate('/login')
            }}>
            {t('registration.result.success.btn')}
          </Button>
        </VStack>
      )
      setShow(true)
    }
  }, [navigate, data, error, setContent, setShow, setVariant, space, t])

  // registration has an error
  useEffect(() => {
    if (error) {
      setVariant('dark')
      setContent(
        <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
          <Text color="lightText">
            {t(`registration.error.message.${error.message}`, {
              defaultValue: error.message
            })}
          </Text>
          <Button onPress={() => setShow(false)}>
            {t('registration.result.error.btn')}
          </Button>
        </VStack>
      )
      setShow(true)
    }
  }, [answers, error, setContent, setShow, setVariant, space, t])

  // if item is pressed, ask for school class for subject
  const askSchoolClassForSelection = useCallback(
    (item: ISelectionItem) => {
      if (answers?.subjects && answers?.subjects[item.key]) return
      setFocusedSelection(item)
      setShowFocusSelection(true)
    },
    [answers?.subjects]
  )

  // populate questions depending on userType
  useEffect(() => {
    setQuestions(userType === 'pupil' ? pupilQuestions : studentQuestions)
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
      if (question.id === 'schoolclass') {
        // change displayed classes based on selected schoolform
        const answer = answers.schooltype

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
  const modifyQuestionBeforeNext = useCallback(() => {
    const currentQuestion = questions[currentIndex]
    // is question about language?
    if (currentQuestion.id === 'language') {
      if (!answers['language']) return
      const answer = Object.keys(answers['language'])

      if (!answer) return

      // if answer does not include "deutsch" ask for more information
      if (!answer.includes('deutsch')) {
        const q: SelectionQuestion = {
          id: 'deutsch',
          type: 'selection',
          imgRootPath: 'text',
          options: [
            { key: '<1', label: t('registration.questions.deutsch2.lower') },
            { key: '>1', label: t('registration.questions.deutsch2.higher') }
          ]
        }

        const qs = [...questions]
        qs.splice(currentIndex + 1, 0, q)
        setQuestions && setQuestions(qs)
      }
    }
    // if question is followup question to "Sprache"/language
    // react to answer and add new question to questionnaire
    if (currentQuestion.id === 'deutsch') {
      if (Object.keys(answers['deutsch']).includes('<1')) {
        const qs = [...questions]
        qs.splice(currentIndex + 1, 1)
        setQuestions && setQuestions(qs)
      }
    }
  }, [answers, currentIndex, questions, t])

  // modify the answer object before moving on to the next question
  const modifyAnswerBeforeNext = useCallback(
    (answer: ObjectAnswer, question: Question) => {
      if (userType === 'pupil') {
        if (question.id === 'subjects') {
          const newAnswer: LFSubject[] = []
          Object.entries(answer).forEach(
            ([key, val]: [key: string, val: Answer]) => {
              !!val && newAnswer.push({ name: val.label })
            }
          )

          setAnswers(prev => ({
            ...prev,
            [question.id]: newAnswer
          }))
        }
      }
    },
    [userType]
  )

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
          modifyAnswerBeforeNext={modifyAnswerBeforeNext}
          onPressItem={(item: ISelectionItem) => {
            if (userType === 'student') {
              if (currentModifiedQuestion?.id === 'subjects') {
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
            <Heading>{t('registration.student.classSelection.title')}</Heading>
          </Modal.Header>
          <Modal.Body>
            <ToggleButton
              label={t('registration.student.classSelection.range1')}
              dataKey="1"
              isActive={classes[focusedSelection.key] === 1}
              onPress={key => answerFocusSelection(1)}
            />
            <ToggleButton
              label={t('registration.student.classSelection.range2')}
              dataKey="2"
              isActive={classes[focusedSelection.key] === 2}
              onPress={key => answerFocusSelection(2)}
            />
            <ToggleButton
              label={t('registration.student.classSelection.range3')}
              dataKey="3"
              isActive={classes[focusedSelection.key] === 3}
              onPress={key => answerFocusSelection(3)}
            />
            <ToggleButton
              label={t('registration.student.classSelection.range4')}
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
              {t('registration.student.classSelection.btn')}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </QuestionnaireContext.Provider>
  )
}
export default RegistrationData
