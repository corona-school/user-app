import { ReactNode, useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  Row,
  useTheme,
  Box,
  Flex,
  Button,
  Link,
  Image,
  Column,
  useBreakpointValue,
  Pressable
} from 'native-base'
import Card from '../components/Card'
import Tag from '../components/Tag'
import CommunityUser from './CommunityUser'
import { toTimerString } from '../Utility'
import useInterval from '../hooks/useInterval'
import { LFTag } from '../types/lernfair/Course'
import { DateTime } from 'luxon'

type Props = {
  tags?: LFTag[]
  date?: string
  title: string
  description: string
  child?: string
  avatar?: string
  avatarname?: string
  button?: ReactNode
  buttonlink?: string
  variant?: 'card' | 'horizontal'
  isTeaser?: boolean
  image?: string
  onPressToCourse?: () => any
  countCourse?: number
}

const AppointmentCard: React.FC<Props> = ({
  tags,
  date: _date,
  title,
  countCourse,
  description,
  child,
  variant = 'card',
  avatar,
  avatarname,
  button,
  buttonlink,
  isTeaser = false,
  image,
  onPressToCourse
}) => {
  const { space, sizes } = useTheme()
  const [remainingTime, setRemainingTime] = useState<string>('00:00')

  const date = _date && DateTime.fromISO(_date)

  useEffect(() => {
    date && setRemainingTime(toTimerString(date.toMillis(), Date.now()))
  }, [date])

  useInterval(() => {
    date && setRemainingTime(toTimerString(date.toMillis(), Date.now()))
  }, 1000)

  const textColor = useMemo(
    () => (isTeaser ? 'lightText' : 'darkText'),
    [isTeaser]
  )

  const CardMobileDirection = useBreakpointValue({
    base: 'column',
    lg: 'row'
  })

  const CardMobileImage = useBreakpointValue({
    base: '100%',
    lg: '300px'
  })

  const CardMobilePadding = useBreakpointValue({
    base: space['1'],
    lg: '30px'
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  return (
    <View>
      {variant === 'card' ? (
        <Card
          flexibleWidth={isTeaser ? true : false}
          variant={isTeaser ? 'dark' : 'normal'}>
          <Pressable onPress={onPressToCourse}>
            <Column
              w="100%"
              flexDirection={isTeaser ? CardMobileDirection : 'column'}>
              <Box
                w={isTeaser ? CardMobileImage : 'auto'}
                h={isTeaser ? '200' : '120'}
                padding={space['1']}>
                <Image
                  position="absolute"
                  left={0}
                  right={0}
                  top={0}
                  width="100%"
                  bgColor="gray.300"
                  height="100%"
                  alt={title}
                  source={{
                    uri: image
                  }}
                />
                <Row space={space['0.5']} flexWrap="wrap" maxWidth="280px">
                  {tags?.map((tag, i) => (
                    <Tag key={`tag-${i}`} text={tag.name} />
                  ))}
                </Row>
              </Box>

              <Box padding={isTeaser ? CardMobilePadding : space['1']}>
                {!isTeaser && date && (
                  <Row paddingTop={space['1']} space={1}>
                    <Text color={textColor}>{date.toFormat('dd.MM.yyyy')}</Text>
                    <Text color={textColor}>•</Text>
                    <Text color={textColor}>{date.toFormat('HH:mm')}</Text>
                  </Row>
                )}
                {date && isTeaser && (
                  <Row paddingBottom={space['0.5']}>
                    <Text color={textColor}>Startet in: </Text>
                    <Text bold color="primary.400">
                      {remainingTime}
                    </Text>
                  </Row>
                )}

                <Text color={textColor} bold fontSize={'md'} mb={space['0.5']}>
                  {title}
                </Text>

                {isTeaser && (
                  <>
                    <Text paddingBottom={space['1']} color={textColor}>
                      {description?.length > 56
                        ? description.substring(0, 56) + '...'
                        : description}
                    </Text>
                    <Button width={ButtonContainer} onPress={onPressToCourse}>
                      Zum Kurs
                    </Button>
                  </>
                )}
                {child && <CommunityUser name={child} />}

                {button && (
                  <Link href={buttonlink}>
                    <Button
                      width={ButtonContainer}
                      paddingTop={space['1.5']}
                      paddingBottom={space['1.5']}>
                      {button}
                    </Button>
                  </Link>
                )}
              </Box>
            </Column>
          </Pressable>
        </Card>
      ) : (
        <Pressable onPress={onPressToCourse} width="100%" height="100%">
          <Flex
            flexDirection="row"
            borderRadius="15px"
            backgroundColor="primary.100"
            marginBottom={space['1']}>
            <Box display="block" marginRight={space['1']}>
              <Image
                width="110px"
                height="100%"
                borderTopLeftRadius="15px"
                borderBottomLeftRadius="15px"
                bgColor="gray.300"
                source={{
                  uri: image
                }}
              />
            </Box>

            <Box paddingX="10px" paddingY={space['1.5']}>
              <Row space={space['0.5']} flexWrap="wrap" maxWidth="250px">
                {tags?.map((tag, i) => (
                  <Tag key={`tag-${i}`} text={tag.name} />
                ))}
              </Row>
              <Row space={1} marginY={space['0.5']}>
                {date && (
                  <Text>
                    {'Ab'} {date.toFormat('dd.MM.yyyy')}
                  </Text>
                )}
                {date && countCourse && (
                  <>
                    <Text>•</Text>
                    <Text>
                      {countCourse} {'Termine'}
                    </Text>
                  </>
                )}
              </Row>
              <Text bold fontSize={'md'} mb={space['0.5']} maxWidth="200px">
                {title}
              </Text>
            </Box>
          </Flex>
        </Pressable>
      )}
    </View>
  )
}
export default AppointmentCard
