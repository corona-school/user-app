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
import WithNavigation from '../components/WithNavigation'
import NotificationAlert from '../components/NotificationAlert'
import AppointmentCard from '../widgets/AppointmentCard'

type Props = {}

const CourseArchive: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '47%'
  })

  return (
    <WithNavigation
      headerTitle={t('archive.course.header')}
      headerLeft={<NotificationAlert />}>
      <VStack paddingX={space['1']} width={ContainerWidth}>
        <VStack space={space['1']}>
          <VStack space={space['0.5']}>
            <Heading>{t('archive.course.title')}</Heading>
            <Text>{t('archive.course.content')}</Text>
          </VStack>
          <VStack paddingY={space['1']}>
            <Input
              size="lg"
              placeholder={t('matching.group.helper.support.search')}
            />
          </VStack>
          <VStack space={space['1']}>
            <Heading>{t('archive.course.sectionHeadline')}</Heading>
            <Text>{t('archive.course.sectionContent')}</Text>
          </VStack>
          <VStack>
            <Flex direction="row" flexWrap="wrap">
              {new Array(8).fill(0).map(({}, index) => (
                <Column width={CardGrid} marginRight="15px">
                  <AppointmentCard
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
export default CourseArchive
