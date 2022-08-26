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
  Image
} from 'native-base'
import Card from '../components/Card'
import Tag from '../components/Tag'
import CommunityUser from './CommunityUser'
import { toTimerString, TIME_THRESHOLD } from '../Utility'
import useInterval from '../hooks/useInterval'

type Props = {
  tags: string[]
  date: Date
  title: string
  description: string
  child?: string
  avatar?: string
  avatarname?: string
  button?: ReactNode
  buttonlink?: string
  variant?: 'card' | 'horizontal'
  isTeaser?: boolean
  image: string
  onPressToCourse?: () => any
}

const AppointmentCard: React.FC<Props> = ({
  tags,
  date,
  title,
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
  const { space } = useTheme()
  const [remainingTime, setRemainingTime] = useState<string>('00:00')

  useEffect(() => {
    setRemainingTime(toTimerString(date.getTime(), Date.now()))
  }, [date])

  useInterval(() => {
    setRemainingTime(toTimerString(date.getTime(), Date.now()))
  }, 1000)

  const isStartingSoon = useMemo(
    () => date.getTime() - Date.now() < TIME_THRESHOLD,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [date, remainingTime]
  )

  const textColor = useMemo(
    () => (isStartingSoon ? 'lightText' : 'darkText'),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [date, remainingTime]
  )

  return (
    <View>
      {variant === 'card' ? (
        <Card
          flexibleWidth={isTeaser ? true : false}
          variant={isStartingSoon ? 'dark' : 'normal'}>
          <Box h={isTeaser ? '170' : '120'} padding={space['1']}>
            <Image
              position="absolute"
              left={0}
              right={0}
              top={0}
              width="100%"
              height="100%"
              alt={title}
              source={{
                uri: image
              }}
            />
            <Row space={space['0.5']} flexWrap="wrap">
              {tags.map((t, i) => (
                <Tag key={`tag-${i}`} text={t} />
              ))}
            </Row>
          </Box>
          <Box padding={space['1']}>
            {!isStartingSoon && (
              <Row paddingTop={space['1']} space={1}>
                <Text color={textColor}>{date.toLocaleDateString()}</Text>
                <Text color={textColor}>•</Text>
                <Text color={textColor}>
                  {date.toLocaleTimeString().slice(0, -3)}
                </Text>
              </Row>
            )}
            {isStartingSoon && (
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
            {isStartingSoon && (
              <>
                <Text paddingBottom={space['1']} color={textColor}>
                  {description}
                </Text>
                <Button onPress={onPressToCourse}>Zum Kurs</Button>
              </>
            )}
            {child && <CommunityUser name={child} />}

            {button && (
              <Link href={buttonlink}>
                <Button paddingTop={space['1.5']} paddingBottom={space['1.5']}>
                  {button}
                </Button>
              </Link>
            )}
          </Box>
        </Card>
      ) : (
        <Flex
          direction="row"
          borderBottomColor="primary.100"
          borderBottomWidth="1"
          paddingLeft={space['0.5']}
          paddingRight={space['0.5']}
          paddingTop={space['1.5']}
          paddingBottom={space['1.5']}>
          <Box marginRight={space['1']}>
            <CommunityUser
              align="column"
              avatar={avatar}
              avatarsize="md"
              name={avatarname || ''}
              usernameweight="400"
            />
          </Box>
          <Box>
            <Row space={1}>
              <Text>{date.toLocaleDateString()}</Text>
              <Text>•</Text>
              <Text>{date.toLocaleTimeString().slice(0, -3)}</Text>
            </Row>
            <Text bold fontSize={'md'} mb={space['0.5']}>
              {title}
            </Text>
            <Row space={space['0.5']}>
              {tags.map((t, i) => (
                <Tag key={`tag-${i}`} text={t} />
              ))}
            </Row>
          </Box>
        </Flex>
      )}
    </View>
  )
}
export default AppointmentCard
