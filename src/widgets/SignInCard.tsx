import { DateTime } from 'luxon'
import { Text, Box, Row, useTheme, Button, Image, Link } from 'native-base'
import { useCallback, useMemo } from 'react'
import Card from '../components/Card'
import Tag from '../components/Tag'
import { LFLecture, LFSubCourse, LFTag } from '../types/lernfair/Course'
import Utility from '../Utility'

type Props = {
  tags?: LFTag[]
  // date?: Date
  // numAppointments?: number
  // title?: string
  // image?: string
  // href?: string
  data: LFSubCourse
  onClickSignIn?: () => any
  flexibleWidth?: boolean
  onPress?: () => any
}

const SignInCard: React.FC<Props> = ({
  tags,
  // date,
  // numAppointments,
  // title,
  // image,
  // href,
  data,
  onClickSignIn,
  flexibleWidth,
  onPress
}) => {
  const { space } = useTheme()

  return (
    <Link
      height="100%"
      onPress={onPress}
      width={flexibleWidth ? '100%' : undefined}>
      <Card isFullHeight={true} width={'100%'}>
        <Box bg="primary.500" h="120" padding={space['0.5']}>
          <Image
            position="absolute"
            left={0}
            right={0}
            top={0}
            width="100%"
            height="100%"
            alt={data?.course?.name}
            source={{
              uri: data?.image
            }}
          />
        </Box>
        <Box paddingX={space['1']} paddingY={space['1']} maxWidth="300px">
          <Row space={1.5}>
            {data?.lectures && data?.lectures[0] && (
              <Text>
                Ab{' '}
                {DateTime.fromISO(data.lectures[0].start).toFormat(
                  'dd.MM.yyyy'
                )}
              </Text>
            )}
            <Text>•</Text>
            <Text>{data.lectures?.length} Termine</Text>
          </Row>
          <Text
            bold
            maxW={'190px'}
            fontSize={'md'}
            paddingTop={space['0.5']}
            paddingBottom={space['0.5']}>
            {data?.course?.name}
          </Text>
          <Row space={space['0.5']} paddingY={space['0.5']} flexWrap="wrap">
            {tags?.map((tag, i) => (
              <Tag key={`tag-${i}`} text={tag.name} />
            ))}
          </Row>
          <Button
            variant="outline"
            marginTop={space['1']}
            onPress={onClickSignIn}>
            Anmelden
          </Button>
        </Box>
      </Card>
    </Link>
  )
}
export default SignInCard
