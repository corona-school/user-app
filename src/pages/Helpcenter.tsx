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
  InfoIcon
} from 'native-base'
import Accordion from '../components/Accordion'
import BackButton from '../components/BackButton'
import NotificationAlert from '../components/NotificationAlert'
import Tabs from '../components/Tabs'
import WithNavigation from '../components/WithNavigation'
import CTACard from '../widgets/CTACard'
import { ModalContext } from '../widgets/FullPageModal'
import { useContext, useState } from 'react'
import InfoScreen from '../widgets/InfoScreen'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type Props = {}

const HelpCenter: React.FC<Props> = () => {
  const { space } = useTheme()
  const [dsgvo, setDSGVO] = useState<boolean>(false)

  const { setShow, setContent, setVariant } = useContext(ModalContext)
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <WithNavigation
      headerTitle="Hilfebereich"
      headerLeft={<BackButton />}
      headerRight={<NotificationAlert />}>
      <Box
        paddingTop={space['4']}
        paddingBottom={space['1.5']}
        paddingX={space['1.5']}>
        <Heading paddingBottom={1.5}>{t('helpcenter.title')}</Heading>
        <Text>{t('helpcenter.subtitle')}</Text>
      </Box>
      <Box paddingBottom={space['2.5']} paddingX={space['1.5']}>
        <Heading paddingBottom={space['0.5']}>Onboarding</Heading>
        <Text paddingBottom={space['1.5']}>Hier geht es zum Onboarding.</Text>
        <Button onPress={() => navigate('/onboarding-list')}>
          zum Onboarding
        </Button>
      </Box>
      <Box width="100%" paddingX={space['1.5']}>
        <Tabs
          tabs={[
            {
              title: t('helpcenter.faq.tabName'),
              content: (
                <>
                  <Heading paddingBottom={space['2']}>
                    {t('helpcenter.faq.tabName')}
                  </Heading>

                  {new Array(10).fill(0).map(index => (
                    <Accordion
                      title={t(`helpcenter.faq.accordion${index}.title`)}
                      key={`accordion-${index}`}>
                      <Text>
                        {t(`helpcenter.faq.accordion${index}.content`)}
                      </Text>
                    </Accordion>
                  ))}

                  <Box paddingY={space['1.5']}>
                    <Button onPress={() => navigate('/alle-faqs')}>
                      {t('helpcenter.btn.allfaq')}
                    </Button>
                  </Box>
                </>
              )
            },
            {
              title: t('helpcenter.assistance.title'),
              content: (
                <>
                  <Heading paddingBottom={1.5}>
                    {t('helpcenter.assistance.title')}
                  </Heading>
                  <Text paddingBottom={space['1']}>
                    {t('helpcenter.assistance.content')}
                  </Text>
                  <VStack paddingX={0} paddingBottom={space['2']}>
                    <Stagger
                      initial={{ opacity: 0, translateY: 20 }}
                      animate={{
                        opacity: 1,
                        translateY: 0,
                        transition: { stagger: { offset: 60 }, duration: 500 }
                      }}
                      visible>
                      {new Array(6).fill(0).map(({}, index) => (
                        <Box
                          key={'helpcard-' + index}
                          marginBottom={space['1.5']}>
                          <Link
                            display="block"
                            href={t(`helpcenter.assistance.card${index}.url`)}>
                            <CTACard
                              title={t(
                                `helpcenter.assistance.card${index}.title`
                              )}
                              closeable={false}
                              content={
                                <Text>
                                  {t(
                                    `helpcenter.assistance.card${index}.content`
                                  )}
                                </Text>
                              }
                              button={
                                <Box flexDirection="row">
                                  <Text bold marginRight={space['0.5']}>
                                    {t('helpcenter.assistance.contenslabel')}
                                  </Text>
                                  <Text>
                                    {' '}
                                    {t(
                                      `helpcenter.assistance.card${index}.contentsContent`
                                    )}
                                  </Text>
                                </Box>
                              }
                              icon={<CheckCircleIcon size="10" />}
                            />
                          </Link>
                        </Box>
                      ))}
                    </Stagger>
                  </VStack>
                </>
              )
            },
            {
              title: t('helpcenter.contact.tabName'),
              content: (
                <>
                  <Heading paddingBottom={space['0.5']}>
                    {t('helpcenter.contact.title')}
                  </Heading>
                  <Text paddingBottom={space['1.5']}>
                    {t('helpcenter.contact.content')}
                  </Text>

                  <FormControl>
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
                        mt="1">
                        <Select.Item
                          label={t(
                            'helpcenter.contact.topic.options.optionLabel1'
                          )}
                          value={t(
                            'helpcenter.contact.topic.options.optionLabel1'
                          )}
                        />
                        <Select.Item
                          label={t(
                            'helpcenter.contact.topic.options.optionLabel2'
                          )}
                          value={t(
                            'helpcenter.contact.topic.options.optionLabel2'
                          )}
                        />
                        <Select.Item
                          label={t(
                            'helpcenter.contact.topic.options.optionLabel3'
                          )}
                          value={t(
                            'helpcenter.contact.topic.options.optionLabel3'
                          )}
                        />
                      </Select>
                    </Row>
                    <Row flexDirection="column" paddingY={space['0.5']}>
                      <FormControl.Label>
                        {t('helpcenter.contact.message.label')}
                      </FormControl.Label>
                      <TextArea
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
                      <Button
                        isDisabled={!dsgvo}
                        onPress={() => {
                          setVariant('light')
                          setContent(
                            <InfoScreen
                              title={t('helpcenter.contact.popupTitle')}
                              icon={<InfoIcon />}
                              content={t('helpcenter.contact.popupContent')}
                              defaultButtonText={t(
                                'helpcenter.contact.popupBtn'
                              )}
                              defaultbuttonLink={() => setShow(false)}
                            />
                          )
                          setShow(true)
                        }}>
                        {t('helpcenter.btn.formsubmit')}
                      </Button>
                    </Row>
                  </FormControl>
                </>
              )
            }
          ]}
        />
      </Box>
    </WithNavigation>
  )
}
export default HelpCenter
