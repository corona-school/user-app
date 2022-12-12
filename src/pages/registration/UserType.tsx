import {
  Box,
  Button,
  Column,
  Heading,
  Row,
  Text,
  useBreakpointValue,
  useTheme,
  VStack
} from 'native-base'
import { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useModal from '../../hooks/useModal'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'
import WarningIcon from '../../assets/icons/lernfair/ic_warning.svg'
import { RegistrationContext } from '../Registration'

const UserType: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { userType, setUserType, setCurrentIndex } =
    useContext(RegistrationContext)
  const { space, sizes } = useTheme()
  const { setContent, setShow, setVariant } = useModal()

  const ModalContainerWidth = useBreakpointValue({
    base: '93%',
    lg: sizes['formsWidth']
  })
  const overflowBar = useBreakpointValue({
    base: 'scroll',
    lg: 'none'
  })

  const onBarrierSolved = useCallback(
    (isUserFit: boolean) => {
      if (isUserFit) {
        setCurrentIndex(1)
      } else {
        navigate('/registration-rejected')
      }
      setShow(false)
    },
    [navigate, setShow, setCurrentIndex]
  )

  const showBarrier = useCallback(() => {
    setVariant('dark')
    setContent(() => (
      <VStack
        space={space['1']}
        p={space['1']}
        flex="1"
        alignItems="center"
        justifyContent="center"
        marginX="auto"
        width={ModalContainerWidth}>
        <Box
          alignItems="center"
          marginY={space['4']}
          overflowY={overflowBar}
          height="100vh">
          <Box marginTop={space['3']} marginBottom={space['1']}>
            <WarningIcon />
          </Box>
          <Heading color={'lightText'} marginBottom={space['1']}>
            {t('registration.barrier.title')}
          </Heading>
          <Text fontSize={'md'} color={'lightText'} textAlign="center">
            {t(`registration.barrier.text`)}
          </Text>
          <VStack paddingBottom={space['2']}>
            {new Array(3).fill(0).map((_, i) => (
              <Text fontSize={'md'} color={'lightText'} textAlign="center">
                {t(`registration.barrier.point_${i}`)}
              </Text>
            ))}
          </VStack>
          <VStack
            width={ModalContainerWidth}
            space={space['1']}
            marginBottom={space['2']}>
            <Button onPress={() => onBarrierSolved(true)} flex="1">
              {t('registration.barrier.btn.yes')}
            </Button>
            <Button
              onPress={() => {
                onBarrierSolved(false)
              }}
              flex="1">
              {t('registration.barrier.btn.no')}
            </Button>
          </VStack>
        </Box>
      </VStack>
    ))
    setShow(true)
  }, [
    ModalContainerWidth,
    onBarrierSolved,
    overflowBar,
    setContent,
    setShow,
    setVariant,
    space,
    t
  ])

  return (
    <VStack w="100%">
      <Heading>Ich bin:</Heading>

      <Box>
        <TwoColGrid>
          <IconTagList
            initial={userType === 'pupil'}
            variant="selection"
            text={t('registration.pupil.label')}
            onPress={() => setUserType('pupil')}
            iconPath={'ic_student.svg'}
          />
          <IconTagList
            initial={userType === 'student'}
            variant="selection"
            text="Helfer:in"
            onPress={() => setUserType('student')}
            iconPath={'ic_tutor.svg'}
          />
        </TwoColGrid>
        <Box alignItems="center" marginTop={space['2']}>
          <Row space={space['1']} justifyContent="center">
            <Column width="100%">
              <Button
                width="100%"
                height="100%"
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  navigate('/welcome')
                }}>
                {t('lernfair.buttons.prev')}
              </Button>
            </Column>
            <Column width="100%">
              <Button
                width="100%"
                onPress={() => {
                  userType === 'pupil' ? showBarrier() : setCurrentIndex(1)
                }}>
                {t('lernfair.buttons.next')}
              </Button>
            </Column>
          </Row>
        </Box>
      </Box>
    </VStack>
  )
}
export default UserType
