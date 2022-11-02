import {
  Box,
  Heading,
  useTheme,
  Text,
  Row,
  FormControl,
  Select,
  TextArea,
  Checkbox,
  Link,
  Button,
  CheckCircleIcon,
  VStack,
  Stagger,
  InfoIcon,
  Alert,
  HStack,
  useBreakpointValue,
  View
} from 'native-base'
import Accordion from '../components/Accordion'
import BackButton from '../components/BackButton'
import Tabs from '../components/Tabs'
import WithNavigation from '../components/WithNavigation'
import CTACard from '../widgets/CTACard'
import { useCallback, useEffect, useState } from 'react'
import InfoScreen from '../widgets/InfoScreen'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TextInput from '../components/TextInput'
import { gql, useMutation } from '@apollo/client'
import useModal from '../hooks/useModal'
import IFrame from '../components/IFrame'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

type Props = {}

type MentorCategory =
  | 'LANGUAGE'
  | 'SUBJECTS'
  | 'DIDACTIC'
  | 'TECH'
  | 'SELFORGA'
  | 'OTHER'

const HelpCenter: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const [dsgvo, setDSGVO] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mentorCategory, setMentorCategory] = useState<MentorCategory>()
  const [subject, setSubject] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const [messageSent, setMessageSent] = useState<boolean>()
  const [showError, setShowError] = useState<boolean>()

  const { setShow, setContent, setVariant } = useModal()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [contactMentor, { data, error, loading }] = useMutation(gql`
    mutation contactMentor(
      $cat: MentorCategory!
      $sub: String!
      $msg: String!
    ) {
      mentoringContact(data: { category: $cat, subject: $sub, message: $msg })
    }
  `)

  const sendContactMessage = useCallback(() => {
    contactMentor({
      variables: {
        cat: mentorCategory,
        sub: subject,
        msg: message
      }
    })
  }, [contactMentor, mentorCategory, message, subject])

  useEffect(() => {
    if (data) {
      setVariant('light')
      setContent(
        <InfoScreen
          title={t('helpcenter.contact.popupTitle')}
          icon={<InfoIcon />}
          content={t('helpcenter.contact.popupContent')}
          defaultButtonText={t('helpcenter.contact.popupBtn')}
          defaultbuttonLink={() => setShow(false)}
        />
      )
      setShow(true)
    }
  }, [data, setContent, setShow, setVariant, t])

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

  const formControlWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const { trackEvent, trackPageView } = useMatomo()

  const onboardingCheck = () => {
    navigate('/onboarding-list')

    trackEvent({
      category: 'hilfebereich',
      action: 'click-event',
      name: 'Hilebereich',
      documentTitle: 'Hilfebereich',
      href: '/onboarding-list'
    })
  }

  useEffect(() => {
    trackPageView({
      documentTitle: 'Hilfebereich'
    })
  }, [])

  return (
    <WithNavigation headerTitle="Hilfebereich">
      <Box maxWidth={ContainerWidth} width="100%" marginX="auto">
        <Box
          maxWidth={ContentContainerWidth}
          paddingBottom={space['1.5']}
          paddingX={space['1.5']}>
          <Heading paddingBottom={1.5}>{t('helpcenter.title')}</Heading>
          <Text>{t('helpcenter.subtitle')}</Text>
        </Box>
        <Box
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
        </Box>
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
                // <>
                //   <Heading paddingBottom={space['2']}>
                //     {t('helpcenter.faq.tabName')}
                //   </Heading>

                //   {new Array(10).fill(0).map(index => (
                //     <Accordion
                //       title={t(`helpcenter.faq.accordion${index}.title`)}
                //       key={`accordion-${index}`}>
                //       <Text>
                //         {t(`helpcenter.faq.accordion${index}.content`)}
                //       </Text>
                //     </Accordion>
                //   ))}

                //   <Box paddingY={space['1.5']}>
                //     <Button onPress={() => navigate('/alle-faqs')}>
                //       {t('helpcenter.btn.allfaq')}
                //     </Button>
                //   </Box>
                // </>
              )
            },
            {
              title: t('helpcenter.assistance.title'),
              content: (
                <IFrame
                  src="https://www.lern-fair.de/iframe/hilfestellungen"
                  title="hilfestellungen"
                  width="100%"
                  height="596px"
                />
                // <>
                //   <Heading paddingBottom={1.5}>
                //     {t('helpcenter.assistance.title')}
                //   </Heading>
                //   <Text paddingBottom={space['1']}>
                //     {t('helpcenter.assistance.content')}
                //   </Text>
                //   <VStack paddingX={0} paddingBottom={space['2']}>
                //     <Stagger
                //       initial={{ opacity: 0, translateY: 20 }}
                //       animate={{
                //         opacity: 1,
                //         translateY: 0,
                //         transition: { stagger: { offset: 60 }, duration: 500 }
                //       }}
                //       visible>
                //       {new Array(6).fill(0).map((_, index) => (
                //         <Box
                //           key={'helpcard-' + index}
                //           marginBottom={space['1.5']}>
                //           <Link
                //             display="block"
                //             href={t(`helpcenter.assistance.card${index}.url`)}>
                //             <CTACard
                //               title={t(
                //                 `helpcenter.assistance.card${index}.title`
                //               )}
                //               closeable={false}
                //               content={
                //                 <Text>
                //                   {t(
                //                     `helpcenter.assistance.card${index}.content`
                //                   )}
                //                 </Text>
                //               }
                //               button={
                //                 <Box flexDirection="row">
                //                   <Text bold marginRight={space['0.5']}>
                //                     {t('helpcenter.assistance.contenslabel')}
                //                   </Text>
                //                   <Text>
                //                     {' '}
                //                     {t(
                //                       `helpcenter.assistance.card${index}.contentsContent`
                //                     )}
                //                   </Text>
                //                 </Box>
                //               }
                //               icon={<CheckCircleIcon size="10" />}
                //             />
                //           </Link>
                //         </Box>
                //       ))}
                //     </Stagger>
                //   </VStack>
                // </>
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
                        {t('helpcenter.contact.topic.label')}
                      </FormControl.Label>
                      <Select
                        accessibilityLabel={t(
                          'helpcenter.contact.topic.options.placeholder'
                        )}
                        placeholder={t(
                          'helpcenter.contact.topic.options.placeholder'
                        )}
                        onValueChange={val =>
                          setMentorCategory(val as MentorCategory)
                        }
                        mt="1">
                        <Select.Item
                          label={t(
                            'helpcenter.contact.topic.options.optionLabel1'
                          )}
                          value={
                            // t('helpcenter.contact.topic.options.optionLabel1')
                            'LANGUAGE'
                          }
                        />
                        <Select.Item
                          label={t(
                            'helpcenter.contact.topic.options.optionLabel2'
                          )}
                          value={
                            // t('helpcenter.contact.topic.options.optionLabel2')
                            'TECH'
                          }
                        />
                        <Select.Item
                          label={t(
                            'helpcenter.contact.topic.options.optionLabel3'
                          )}
                          value={
                            // t('helpcenter.contact.topic.options.optionLabel3')
                            'SUBJECTS'
                          }
                        />
                        <Select.Item
                          label={t(
                            'helpcenter.contact.topic.options.optionLabel4'
                          )}
                          value={
                            // t('helpcenter.contact.topic.options.optionLabel4')
                            'DIDACTIC'
                          }
                        />
                        <Select.Item
                          label={t(
                            'helpcenter.contact.topic.options.optionLabel5'
                          )}
                          value={
                            // t('helpcenter.contact.topic.options.optionLabel5')
                            'SELFORGA'
                          }
                        />
                        <Select.Item
                          label={t(
                            'helpcenter.contact.topic.options.optionLabel6'
                          )}
                          value={
                            // t('helpcenter.contact.topic.options.optionLabel6')
                            'OTHER'
                          }
                        />
                      </Select>
                    </Row>
                    {/* <Row flexDirection="column" paddingY={space['0.5']}>
                      <FormControl.Label>
                        {t('helpcenter.contact.message.label')}
                      </FormControl.Label>
                      <TextInput
                        onChangeText={setSubject}
                        placeholder={t(
                          'helpcenter.contact.message.placeholder'
                        )}
                      />
                    </Row> */}
                    <Row flexDirection="column" paddingY={space['0.5']}>
                      <FormControl.Label>
                        {t('helpcenter.contact.subject.label')}
                      </FormControl.Label>
                      <TextInput
                        onChangeText={setSubject}
                        placeholder={t(
                          'helpcenter.contact.subject.placeholder'
                        )}
                      />
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
                        <Alert
                          width="max-content"
                          marginY={3}
                          colorScheme="success"
                          status="success">
                          <VStack space={2} flexShrink={1} w="100%">
                            <HStack
                              flexShrink={1}
                              space={2}
                              alignItems="center"
                              justifyContent="space-between">
                              <HStack
                                space={2}
                                flexShrink={1}
                                alignItems="center">
                                <Alert.Icon color="danger.100" />
                                <Text>{t('helpcenter.contact.success')}</Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </Alert>
                      )}
                      {showError && (
                        <Alert marginY={3} bgColor="danger.500">
                          <VStack space={2} flexShrink={1} w="100%">
                            <HStack
                              flexShrink={1}
                              space={2}
                              alignItems="center"
                              justifyContent="space-between">
                              <HStack
                                space={2}
                                flexShrink={1}
                                alignItems="center">
                                <Alert.Icon color={'lightText'} />
                                <Text color="lightText">
                                  {t('helpcenter.contact.error')}
                                </Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </Alert>
                      )}
                      <Button
                        marginX="auto"
                        width={buttonWidth}
                        isDisabled={
                          !dsgvo ||
                          message?.length < 5 ||
                          subject?.length < 5 ||
                          !mentorCategory
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
  )
}
export default HelpCenter
