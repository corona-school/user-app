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
import { ISelectionItem } from '../../components/questionnaire/SelectionItem'
import { LFSubject } from '../../types/lernfair/Subject'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Slider } from '@miblanchard/react-native-slider'
import { ClassRange } from '../../types/lernfair/SchoolClass'

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
  const { space, colors } = useTheme()
  const { trackPageView, trackEvent } = useMatomo()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [questions, setQuestions] = useState<Question[]>([])

  // questionnaire answers
  const [answers, setAnswers] = useState<{ [key: string]: Answer }>({})
  // answers reset to true instead of number
  // have to track classes seperately can't find the bug
  const [classes, setClasses] = useState<{
    [key: string]: ClassRange
  }>({})

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

  const ModalContainerWidth = useBreakpointValue({
    base: '90%',
    lg: '500px'
  })

  useEffect(() => {
    // go to next slide if data is provided
    // TODO validate email
    if (!firstname && !lastname) navigate('/registration/2')
  }, [email, firstname, lastname, navigate, password])

  // at the end register the pupil with all data
  const registerPupil = useCallback(
    async (answers: { [key: string]: ObjectAnswer }) => {
      const state = answers.state && Object.keys(answers.state)[0]
      const schooltype =
        answers.schooltype && Object.keys(answers.schooltype)[0]

      const gradeAsInt =
        answers.schoolclass && parseInt(Object.keys(answers.schoolclass)[0])
      // const subjects = Object.keys(answers.subjects)
      const subjects = answers.subjects || []

      const data = {} as {
        state: string
        schooltype: string
        gradeAsInt: number
        subjects: ObjectAnswer<number | boolean>
      }
      state && (data['state'] = state)
      schooltype && (data['schooltype'] = schooltype)
      gradeAsInt && (data['gradeAsInt'] = gradeAsInt)
      subjects?.length > 0 && (data['subjects'] = subjects)

      try {
        await register({
          variables: {
            firstname,
            lastname,
            email,
            password,
            ...data
          }
        })
        return true
      } catch (e) {
        return false
      }
    },
    [email, firstname, lastname, password, register]
  )

  // at the end register the student with all data
  const registerStudent = useCallback(async () => {
    const subjects = []
    for (let [sub, isSelected] of Object.entries(answers.subjects)) {
      // const grades = Utility.intToClassRange(classes[sub])
      const grades = classes[sub]
      if (isSelected && grades.min > 0 && grades.max > 0) {
        subjects.push({ name: sub, grade: grades })
      }
    }

    const data = {} as {
      subjects: LFSubject[]
    }

    subjects?.length && (data.subjects = subjects)

    try {
      await register({
        variables: {
          firstname,
          lastname,
          email,
          password,
          ...data
        }
      })
      return true
    } catch (e) {
      return false
    }
  }, [
    answers.subjects,
    classes,
    email,
    firstname,
    lastname,
    password,
    register
  ])

  const registerError = useCallback(() => {
    setShow(false)
    trackEvent({
      category: 'registrierung',
      action: 'click-event',
      name: 'Registrierung Fehler',
      documentTitle: 'Fehler bei der Registrierung'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showErrorModal = useCallback(
    (error: string) => {
      console.log('show error')
      setVariant('dark')
      setContent(
        <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
          <Text color="lightText">
            {t(`registration.error.message.${error}`, {
              defaultValue: error
            })}
          </Text>
          <Button onPress={() => registerError()}>
            {t('registration.result.error.btn')}
          </Button>
        </VStack>
      )
      setShow(true)
    },
    [registerError, setContent, setShow, setVariant, space, t]
  )

  const showSuccessModal = useCallback(() => {
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
        <Box justifyContent="center" alignItems="center">
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
            trackEvent({
              category: 'registrierung',
              action: 'click-event',
              name: 'Registrierung erfolgreich',
              documentTitle: 'Registrierung war erfolgreich'
            })
          }}>
          {t('registration.result.success.btn')}
        </Button>
      </VStack>
    )
    setShow(true)
  }, [
    ModalContainerWidth,
    navigate,
    setContent,
    setShow,
    setVariant,
    space,
    t,
    trackEvent
  ])

  // when all questions are answered, register
  const onQuestionnaireFinished = useCallback(
    async (answers: { [key: string]: Answer }) => {
      let res: any

      try {
        if (userType === 'pupil') {
          res = await registerPupil(answers)
        } else {
          res = await registerStudent()
        }
      } catch (e: any) {
        console.log(e)
        showErrorModal(e.message)
      }

      if (res) {
        showSuccessModal()
      }
    },
    [registerPupil, registerStudent, showErrorModal, showSuccessModal, userType]
  )

  useEffect(() => {
    trackPageView({
      documentTitle: 'Registrierung – Auswahl-Kacheln'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // // registration went through without error
  // useEffect(() => {
  //   if (data && !error) {
  //     setVariant('dark')
  //     setContent(
  //       <VStack
  //         space={space['1']}
  //         p={space['1']}
  //         flex="1"
  //         width={ModalContainerWidth}
  //         marginX="auto"
  //         alignItems="center"
  //         justifyContent="center">
  //         <Box justifyContent="center" marginLeft="40px">
  //           <EventIcon />
  //         </Box>
  //         <Heading
  //           textAlign="center"
  //           marginX="auto"
  //           width={ModalContainerWidth}
  //           color="lightText">
  //           {t('registration.result.success.title')}
  //         </Heading>
  //         <Text
  //           textAlign="center"
  //           marginX="auto"
  //           width={ModalContainerWidth}
  //           color="lightText"
  //           fontSize={'lg'}>
  //           {t('registration.result.success.text')}
  //         </Text>
  //         <Button
  //           marginX="auto"
  //           width={ModalContainerWidth}
  //           onPress={() => {
  //             setShow(false)
  //             navigate('/login')
  //             trackEvent({
  //               category: 'registrierung',
  //               action: 'click-event',
  //               name: 'Registrierung erfolgreich',
  //               documentTitle: 'Registrierung war erfolgreich'
  //             })
  //           }}>
  //           {t('registration.result.success.btn')}
  //         </Button>
  //       </VStack>
  //     )
  //     setShow(true)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [navigate, data, error, setContent, setShow, setVariant, space, t])

  // // registration has an error
  // useEffect(() => {
  //   if (error) {
  //     setVariant('dark')
  //     setContent(
  //       <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
  //         <Text color="lightText">
  //           {t(`registration.error.message.${error.message}`, {
  //             defaultValue: error.message
  //           })}
  //         </Text>
  //         <Button onPress={() => registerError()}>
  //           {t('registration.result.error.btn')}
  //         </Button>
  //       </VStack>
  //     )
  //     setShow(true)
  //   }
  // }, [answers, error, registerError, setContent, setShow, setVariant, space, t])

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

  // // set state => class range for corresponding subject
  // const answerFocusSelection = useCallback(
  //   (val: number) => {
  //     setClasses(prev => ({
  //       ...prev,
  //       [focusedSelection.key]: val
  //     }))
  //   },
  //   [focusedSelection.key]
  // )

  // modify selection question based on answers etc
  const modifySelectionQuestionBeforeRender: (
    question: SelectionQuestion
  ) => SelectionQuestion = useCallback(
    (question: SelectionQuestion) => {
      // question.options = new Array(13).fill(0).map((_, i) => ({
      //   key: `${i + 1}`,
      //   label: t('lernfair.schoolclass', { class: i + 1 })
      // }))

      // is question about schoolclass?
      if (question.id === 'schoolclass') {
        question.options = new Array(13).fill(0).map((_, i) => ({
          key: `${i + 1}`,
          label: t('lernfair.schoolclass', { class: i + 1 })
        }))
        return question

        // change displayed classes based on selected schoolform
        // if (!answer) {
        //   question.options = new Array(8).fill(0).map((_, i) => ({
        //     key: `${i + 5}`,
        //     label: t('lernfair.schoolclass', { class: i + 5 })
        //   }))
        //   return question
        // }

        // if (answer['grundschule']) {
        //   question.options = new Array(4).fill(0).map((_, i) => ({
        //     key: `${i + 1}`,
        //     label: t('lernfair.schoolclass', { class: i + 1 })
        //   }))
        // } else {
        //   question.options = new Array(6).fill(0).map((_, i) => ({
        //     key: `${i + 5}`,
        //     label: t('lernfair.schoolclass', { class: i + 5 })
        //   }))
        // }
        // if (answer['gymnasium']) {
        //   question.options = new Array(8).fill(0).map((_, i) => ({
        //     key: `${i + 5}`,
        //     label: t('lernfair.schoolclass', { class: i + 5 })
        //   }))
        // }
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
    if (currentQuestion.id === 'languages') {
      if (!answers['languages']) return
      const answer = Object.keys(answers['languages'])

      if (!answer) return

      // if answer does not include "deutsch" ask for more information
      if (!answer.includes('deutsch')) {
        const q: SelectionQuestion = {
          id: 'deutsch',
          type: 'selection',
          imgRootPath: 'text',
          options: [
            {
              key: '<1',
              label: t('registration.questions.pupil.deutsch2.lower')
            },
            {
              key: '>1',
              label: t('registration.questions.pupil.deutsch2.higher')
            }
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
        qs.splice(currentIndex + 1, 1, {
          id: 'subjects',
          imgRootPath: 'subjects',
          type: 'selection',
          options: [{ key: 'deutsch-2', label: 'Deutsch als Zweitsprache' }]
        } as SelectionQuestion)
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
          answer &&
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
            <Heading fontSize="md">
              Klassen{' '}
              {(classes[focusedSelection.key] &&
                classes[focusedSelection.key].min) ||
                1}{' '}
              -{' '}
              {(classes[focusedSelection.key] &&
                classes[focusedSelection.key].max) ||
                13}
            </Heading>
            {/* <ToggleButton
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
            /> */}

            <Slider
              animateTransitions
              minimumValue={1}
              maximumValue={13}
              minimumTrackTintColor={colors['primary']['500']}
              thumbTintColor={colors['primary']['900']}
              value={
                (classes[focusedSelection.key] && [
                  classes[focusedSelection.key]?.min,
                  classes[focusedSelection.key]?.max
                ]) || [1, 13]
              }
              step={1}
              onValueChange={(value: number | number[]) => {
                Array.isArray(value) &&
                  setClasses(prev => ({
                    ...prev,
                    [focusedSelection.key]: { min: value[0], max: value[1] }
                  }))
              }}
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
