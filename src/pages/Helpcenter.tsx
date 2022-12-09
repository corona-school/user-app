import {
  Box,
  Heading,
  useTheme,
  Text,
  Row,
  FormControl,
  TextArea,
  Checkbox,
  Button,
  InfoIcon,
  useBreakpointValue,
  View,
  Input
} from 'native-base'
import Tabs from '../components/Tabs'
import WithNavigation from '../components/WithNavigation'
import { useCallback, useEffect, useState } from 'react'
import InfoScreen from '../widgets/InfoScreen'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TextInput from '../components/TextInput'
import { gql, useMutation } from '@apollo/client'
import useModal from '../hooks/useModal'
import IFrame from '../components/IFrame'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import AsNavigationItem from '../components/AsNavigationItem'
import Hello from '../widgets/Hello'
import AlertMessage from '../widgets/AlertMessage'
import { useUserType } from '../hooks/useApollo'

type Props = {}

type MentorCategory =
  | 'LANGUAGE'
  | 'SUBJECTS'
  | 'DIDACTIC'
  | 'TECH'
  | 'SELFORGA'
  | 'OTHER'

const HelpCenter: React.FC<Props> = () => {
  const userType = useUserType()
  const { space, sizes } = useTheme()
  const [dsgvo, setDSGVO] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mentorCategory, setMentorCategory] = useState<MentorCategory>()
  const [subject, setSubject] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const [messageSent, setMessageSent] = useState<boolean>()
  const [showError, setShowError] = useState<boolean>()

  const { show, setShow, setContent, setVariant } = useModal()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [contactMentor, { data }] = useMutation(gql`
    mutation contactMentor(
      $cat: MentorCategory!
      $sub: String!
      $msg: String!
    ) {
      mentoringContact(data: { category: $cat, subject: $sub, message: $msg })
    }
  `)

  const sendContactMessage = useCallback(async () => {
    const res = (await contactMentor({
      variables: {
        cat: mentorCategory,
        sub: subject,
        msg: message
      }
    })) as { data: { mentoringContact: boolean } }

    if (res.data?.mentoringContact) {
      setMessageSent(true)
    } else {
      setShowError(true)
    }
  }, [contactMentor, mentorCategory, message, subject])

  useEffect(() => {
    if (!show && data) {
      setVariant('light')
      setContent(
        <InfoScreen
          title={t('helpcenter.contact.popupTitle')}
          icon={<InfoIcon />}
          content={t('helpcenter.contact.popupContent')}
          defaultButtonText={t('helpcenter.contact.popupBtn')}
          defaultbuttonLink={() => {
            setShow(false)
            navigate('/start')
          }}
        />
      )
      setShow(true)
    }
  }, [show, data, setContent, setShow, setVariant, t, navigate])

  // Breakpoints
  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  const buttonWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const backArrow = useBreakpointValue({
    base: true,
    lg: false
  })

  // const formControlWidth = useBreakpointValue({
  //   base: '100%',
  //   lg: sizes['containerWidth']
  // })

  const { trackEvent, trackPageView } = useMatomo()

  const onboardingCheck = useCallback(() => {
    navigate('/onboarding-list')

    trackEvent({
      category: 'hilfebereich',
      action: 'click-event',
      name: 'Hilebereich',
      documentTitle: 'Hilfebereich',
      href: '/onboarding-list'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  useEffect(() => {
    trackPageView({
      documentTitle: 'Hilfebereich'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AsNavigationItem path="hilfebereich">
      <WithNavigation headerTitle="Hilfebereich" headerContent={<Hello />}>
        <Box maxWidth={ContainerWidth} width="100%" marginX="auto">
          <Box
            maxWidth={ContentContainerWidth}
            paddingBottom={space['1.5']}
            paddingX={space['1.5']}>
            <Heading paddingBottom={1.5}>{t('helpcenter.title')}</Heading>
            <Text>{t('helpcenter.subtitle')}</Text>
          </Box>
          {/* <Box
            maxWidth={ContentContainerWidth}
            paddingBottom={space['2.5']}
            paddingX={space['1.5']}>
            <Heading paddingBottom={space['0.5']}>
              {t('helpcenter.onboarding.title')}
            </Heading>
            <Text paddingBottom={space['1.5']}>
              {t('helpcenter.onboarding.content')}
            </Text>
            <Button width={buttonWidth} onPress={() => onboardingCheck()}>
              {t('helpcenter.onboarding.button')}
            </Button>
          </Box> */}
        </Box>
        <Box width="100%" maxWidth={ContainerWidth} marginX="auto">
          <Tabs
            tabInset={space['1.5']}
            tabs={[
              {
                title: t('helpcenter.faq.tabName'),
                content: (
                  <IFrame
                    src="https://www.lern-fair.de/iframe/faq"
                    title="faq"
                    width="100%"
                    height="596px"
                  />
                )
              },

              {
                hide: userType === 'pupil',
                title: t('helpcenter.assistance.title'),
                content: (
                  <IFrame
                    src="https://www.lern-fair.de/iframe/hilfestellungen"
                    title="hilfestellungen"
                    width="100%"
                    height="596px"
                  />
                )
              },
              {
                title: t('helpcenter.contact.tabName'),
                content: (
                  <View paddingLeft={space['1.5']}>
                    <Heading paddingBottom={space['0.5']}>
                      {t('helpcenter.contact.title')}
                    </Heading>
                    <Text paddingBottom={space['1.5']}>
                      {t('helpcenter.contact.content')}
                    </Text>

                    <FormControl maxWidth={ContentContainerWidth}>
                      <Row flexDirection="column" paddingY={space['0.5']}>
                        <FormControl.Label>
                          {t('helpcenter.contact.subject.label')}
                        </FormControl.Label>
                        <Input onChangeText={setSubject} />
                      </Row>
                      <Row flexDirection="column" paddingY={space['0.5']}>
                        <FormControl.Label>
                          {t('helpcenter.contact.message.label')}
                        </FormControl.Label>
                        <TextArea
                          onChangeText={setMessage}
                          h={20}
                          placeholder={t(
                            'helpcenter.contact.message.placeholder'
                          )}
                          autoCompleteType={{}}
                        />
                      </Row>
                      <Row flexDirection="column" paddingY={space['1.5']}>
                        <Checkbox value="dsgvo" onChange={val => setDSGVO(val)}>
                          {t('helpcenter.contact.datapolicy.label')}
                        </Checkbox>
                      </Row>
                      <Row flexDirection="column" paddingY={space['0.5']}>
                        {messageSent && (
                          <AlertMessage
                            content={t('helpcenter.contact.success')}
                          />
                        )}
                        {showError && (
                          <AlertMessage
                            content={t('helpcenter.contact.error')}
                          />
                        )}
                        <Button
                          marginX="auto"
                          width={buttonWidth}
                          isDisabled={
                            !dsgvo || message?.length < 5 || subject?.length < 5
                          }
                          onPress={sendContactMessage}>
                          {t('helpcenter.btn.formsubmit')}
                        </Button>
                      </Row>
                    </FormControl>
                  </View>
                )
              }
            ]}
          />
        </Box>
      </WithNavigation>
    </AsNavigationItem>
  )
}
export default HelpCenter
