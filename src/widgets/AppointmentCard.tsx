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
  Pressable,
  Heading
} from 'native-base'
import Card from '../components/Card'
import Tag from '../components/Tag'
import CommunityUser from './CommunityUser'
import { toTimerString, TIME_THRESHOLD } from '../Utility'
import useInterval from '../hooks/useInterval'
import { LFTag } from '../types/lernfair/Course'
import { DateTime } from 'luxon'

import LFTimerIcon from '../assets/icons/lernfair/lf-timer.svg'

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
  isGrid?: boolean
  isFullHeight?: boolean
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
  isGrid = false,
  isFullHeight = false,
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

  const teaserHeadline = useBreakpointValue({
    base: '15px',
    lg: '16px'
  })

  const teaserImage = useBreakpointValue({
    base: '160px',
    lg: 'auto'
  })

  const headline = useBreakpointValue({
    base: '13px',
    lg: '14px'
  })

  return (
    <View height={isFullHeight ? '100%' : 'auto'}>
      {variant === 'card' ? (
        <Card
          flexibleWidth={isTeaser || isGrid ? true : false}
          variant={isTeaser ? 'dark' : 'normal'}>
          <Pressable onPress={onPressToCourse}>
            <Column
              w="100%"
              flexDirection={isTeaser ? CardMobileDirection : 'column'}>
              <Box
                w={isTeaser ? CardMobileImage : 'auto'}
                h={isTeaser ? teaserImage : '120'}
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

              <Box
                padding={isTeaser ? CardMobilePadding : space['1']}
                maxWidth="731px">
                {!isTeaser && date && (
                  <Row paddingTop={space['1']} space={1}>
                    <Text color={textColor}>{date.toFormat('dd.MM.yyyy')}</Text>
                    <Text color={textColor}>•</Text>
                    <Text color={textColor}>{date.toFormat('HH:mm')}</Text>
                  </Row>
                )}
                {date && isTeaser && (
                  <Row marginBottom={space['1']} alignItems="center">
                    <Column marginRight="10px">
                      <Text>{<LFTimerIcon />}</Text>
                    </Column>
                    <Column>
                      <Row>
                        <Text color={textColor}>Startet in: </Text>
                        <Text bold color="primary.400">
                          {remainingTime}
                        </Text>
                      </Row>
                    </Column>
                  </Row>
                )}

                <Heading
                  color={textColor}
                  bold
                  fontSize={isTeaser ? teaserHeadline : headline}
                  mb={space['0.5']}>
                  {title}
                </Heading>

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
              <Row space={space['0.5']} flexWrap="wrap" maxWidth="260px">
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
                {countCourse && (
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
