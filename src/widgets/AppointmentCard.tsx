import { ReactNode, useEffect, useMemo, useState } from 'react'
import { View, Text, Row, useTheme, Box, Flex, Button, Link } from 'native-base'
import Card from '../components/Card'
import Tag from '../components/Tag'
import CommunityUser from './CommunityUser'
import { toTimerString, TIME_THRESHOLD } from '../Utility'
import useInterval from '../hooks/useInterval'

type Props = {
  isCourse?: boolean
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
  isCourse = true,
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

  return (
    <View>
      {variant === 'card' ? (
        <Card flexibleWidth>
          <Box bg="primary.100" h="120" padding={space['1']}>
            <Row space={space['0.5']}>
              {tags.map((t, i) => (
                <Tag key={`tag-${i}`} text={t} />
              ))}
            </Row>
          </Box>
          <Box padding={space['1']}>
            {!isStartingSoon && (
              <Row paddingTop={space['1']} space={1}>
                <Text>{date.toLocaleDateString()}</Text>
                <Text>•</Text>
                <Text>{date.toLocaleTimeString().slice(0, -3)}</Text>
              </Row>
            )}
            {isStartingSoon && (
              <Row paddingBottom={space['0.5']}>
                <Text>Startet in: </Text>
                <Text bold>{remainingTime}</Text>
              </Row>
            )}
            <Text bold fontSize={'md'}>
              {title}
            </Text>
            {isStartingSoon && (
              <>
                <Text paddingBottom={space['0.5']}>{description}</Text>
                {isCourse && (
                  <Button onPress={onPressToCourse}>Zum Kurs</Button>
                )}
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
