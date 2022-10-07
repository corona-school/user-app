import { Text, Heading, useTheme, VStack, Input, Link } from 'native-base'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import WithNavigation from '../../components/WithNavigation'
import NotificationAlert from '../../components/NotificationAlert'
import AppointmentCard from '../../widgets/AppointmentCard'

type Props = {}

const StudentGroupSupport: React.FC<Props> = () => {
  const { space } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <WithNavigation
      headerTitle={t('matching.group.helper.support.header')}
      headerLeft={<NotificationAlert />}>
      <VStack paddingX={space['1']}>
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
            {new Array(8).fill(0).map(({}, index) => (
              <AppointmentCard
                key={index}
                variant="horizontal"
                description="Lorem Ipsum"
                tags={[{ name: 'Mathematik' }, { name: 'Gruppenkurs' }]}
                date={new Date()}
                countCourse={4}
                onPressToCourse={() => alert('YES')}
                image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                title="Diskussionen in Mathe!? – Die Kurvendiskussion"
              />
            ))}
          </VStack>
        </VStack>
      </VStack>
    </WithNavigation>
  )
}
export default StudentGroupSupport
