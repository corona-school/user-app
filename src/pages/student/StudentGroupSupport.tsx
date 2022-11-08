import {
  Text,
  Heading,
  useTheme,
  VStack,
  Input,
  Link,
  useBreakpointValue,
  Flex,
  Column
} from 'native-base'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import WithNavigation from '../../components/WithNavigation'
import NotificationAlert from '../../components/NotificationAlert'
import AppointmentCard from '../../widgets/AppointmentCard'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { useEffect } from 'react'

type Props = {}

const StudentGroupSupport: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '47%'
  })

  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Helfer Gruppe Unterstützung'
    })
  }, [])

  return (
    <WithNavigation
      headerTitle={t('matching.group.helper.support.header')}
      headerLeft={<NotificationAlert />}>
      <VStack paddingX={space['1']} marginX="auto" width={ContainerWidth}>
        <VStack space={space['1']}>
          <VStack space={space['0.5']}>
            <Heading>{t('matching.group.helper.support.title')}</Heading>
            <Text>
              {t('matching.group.helper.support.contentFirstPart') + ' '}
              <Link>{t('matching.group.helper.support.contentLinkText')}</Link>
              {' ' + t('matching.group.helper.support.contendLastPart')}
            </Text>
          </VStack>
          <VStack paddingY={space['1']}>
            <Input
              size="lg"
              placeholder={t('matching.group.helper.support.search')}
            />
          </VStack>
          <VStack space={space['1']}>
            <Heading>{t('matching.group.helper.support.offers.title')}</Heading>
            <Text>{t('matching.group.helper.support.offers.content')}</Text>
          </VStack>
          <VStack>
            <Flex direction="row" flexWrap="wrap">
              {new Array(8).fill(0).map(({}, index) => (
                <Column width={CardGrid} marginRight="15px">
                  <AppointmentCard
                    isFullHeight
                    key={index}
                    variant="horizontal"
                    description="Lorem Ipsum"
                    tags={[{ name: 'Mathematik' }, { name: 'Gruppenkurs' }]}
                    date={new Date().toString()}
                    countCourse={4}
                    onPressToCourse={() => alert('YES')}
                    image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                    title="Diskussionen in Mathe!? – Die Kurvendiskussion"
                  />
                </Column>
              ))}
            </Flex>
          </VStack>
        </VStack>
      </VStack>
    </WithNavigation>
  )
}
export default StudentGroupSupport
