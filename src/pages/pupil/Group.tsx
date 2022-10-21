import {
  Text,
  Heading,
  useTheme,
  VStack,
  Input,
  useBreakpointValue,
  Row,
  Column,
  HStack,
  Flex
} from 'native-base'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import WithNavigation from '../../components/WithNavigation'
import NotificationAlert from '../../components/NotificationAlert'
import AppointmentCard from '../../widgets/AppointmentCard'
import Tabs from '../../components/Tabs'

type Props = {}

const PupilGroup: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '48%'
  })

  return (
    <WithNavigation
      headerTitle={t('matching.group.pupil.header')}
      headerLeft={<NotificationAlert />}>
      <VStack paddingX={space['1']} maxWidth={ContainerWidth}>
        <VStack space={space['1']}>
          <VStack space={space['0.5']}>
            <Heading>{t('matching.group.pupil.title')}</Heading>
            <Text maxWidth={ContentContainerWidth}>
              {t('matching.group.pupil.content')}
            </Text>
          </VStack>
          <Input
            size="lg"
            placeholder={t('matching.group.pupil.searchplaceholder')}
          />
          <Tabs
            tabs={[
              {
                title: t('matching.group.pupil.tabs.tab1.title'),
                content: (
                  <>
                    <Text marginBottom={space['1.5']}>
                      {t('matching.group.pupil.tabs.tab1.content')}
                    </Text>

                    <Flex direction="row" flexWrap="wrap">
                      {new Array(5).fill(0).map(
                        ({}, index) =>
                          (
                            <Column width={CardGrid} marginRight="15px">
                              <AppointmentCard
                                variant="horizontal"
                                description="Lorem Ipsum"
                                tags={[
                                  { name: 'Mathematik' },
                                  { name: 'Gruppenkurs' }
                                ]}
                                date={new Date().toDateString()}
                                countCourse={4}
                                onPressToCourse={() => alert('YES')}
                                image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                                title="Diskussionen in Mathe!? – Die Kurvendiskussion"
                              />
                            </Column>
                          ) || <Text>Es wurden keine Kurse gefunden.</Text>
                      )}
                    </Flex>
                  </>
                )
              },
              {
                title: t('matching.group.pupil.tabs.tab2.title'),
                content: (
                  <>
                    <Text marginBottom={space['1.5']}>
                      {t('matching.group.pupil.tabs.tab2.content')}
                    </Text>

                    <Flex direction="row" flexWrap="wrap">
                      {new Array(1).fill(0).map(
                        ({}, index) =>
                          (
                            <Column width={CardGrid} marginRight="15px">
                              <AppointmentCard
                                variant="horizontal"
                                description="Lorem Ipsum"
                                tags={[
                                  { name: 'Mathematik' },
                                  { name: 'Gruppenkurs' }
                                ]}
                                date={new Date().toDateString()}
                                countCourse={4}
                                onPressToCourse={() => alert('YES')}
                                image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                                title="Diskussionen in Mathe!? – Die Kurvendiskussion"
                              />
                            </Column>
                          ) || <Text>Es wurden keine Kurse gefunden.</Text>
                      )}
                    </Flex>
                  </>
                )
              },
              {
                title: t('matching.group.pupil.tabs.tab3.title'),
                content: (
                  <>
                    <Text marginBottom={space['1.5']}>
                      {t('matching.group.pupil.tabs.tab3.content')}
                    </Text>
                    <Flex direction="row" flexWrap="wrap">
                      {new Array(9).fill(0).map(
                        ({}, index) =>
                          (
                            <Column width={CardGrid} marginRight="15px">
                              <AppointmentCard
                                key={index}
                                variant="horizontal"
                                description="Lorem Ipsum"
                                tags={[
                                  { name: 'Mathematik' },
                                  { name: 'Gruppenkurs' }
                                ]}
                                date={new Date().toDateString()}
                                countCourse={4}
                                onPressToCourse={() => alert('YES')}
                                image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                                title="Diskussionen in Mathe!? – Die Kurvendiskussion"
                              />
                            </Column>
                          ) || <Text>Es wurden keine Angebote gefunden.</Text>
                      )}
                    </Flex>
                  </>
                )
              }
            ]}
          />
        </VStack>
      </VStack>
    </WithNavigation>
  )
}
export default PupilGroup
