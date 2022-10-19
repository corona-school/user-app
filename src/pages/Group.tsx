import { Text, Heading, useTheme, VStack, Input } from 'native-base'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import WithNavigation from '../components/WithNavigation'
import NotificationAlert from '../components/NotificationAlert'
import AppointmentCard from '../widgets/AppointmentCard'
import Tabs from '../components/Tabs'

type Props = {}

const Group: React.FC<Props> = () => {
  const { space } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <WithNavigation
      headerTitle={t('matching.group.header')}
      headerLeft={<NotificationAlert />}>
      <VStack paddingX={space['1']}>
        <VStack space={space['1']}>
          <VStack space={space['0.5']}>
            <Heading>{t('matching.group.title')}</Heading>
            <Text>{t('matching.group.content')}</Text>
          </VStack>
          <Input
            size="lg"
            placeholder={t('matching.group.searchplaceholder')}
          />
          <Tabs
            tabs={[
              {
                title: t('matching.group.tabs.tab1.title'),
                content: (
                  <>
                    <Text marginBottom={space['1.5']}>
                      {t('matching.group.tabs.tab1.content')}
                    </Text>
                    {new Array(5)
                      .fill(0)
                      .map(
                        ({}, index) =>
                          (
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
                          ) || <Text>Es wurden keine Kurse gefunden.</Text>
                      )}
                  </>
                )
              },
              {
                title: t('matching.group.tabs.tab2.title'),
                content: (
                  <>
                    <Text marginBottom={space['1.5']}>
                      {t('matching.group.tabs.tab2.content')}
                    </Text>
                    {new Array(1)
                      .fill(0)
                      .map(
                        ({}, index) =>
                          (
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
                          ) || <Text>Es wurden keine Kurse gefunden.</Text>
                      )}
                  </>
                )
              },
              {
                title: t('matching.group.tabs.tab3.title'),
                content: (
                  <>
                    <Text marginBottom={space['1.5']}>
                      {t('matching.group.tabs.tab3.content')}
                    </Text>
                    {new Array(9)
                      .fill(0)
                      .map(
                        ({}, index) =>
                          (
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
                          ) || <Text>Es wurden keine Angebote gefunden.</Text>
                      )}
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
export default Group
