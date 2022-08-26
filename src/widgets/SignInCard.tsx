import { Text, Box, Row, useTheme, Button, Image, Link } from 'native-base'
import Card from '../components/Card'
import Tag from '../components/Tag'

type Props = {
  tags: string[]
  date: Date
  numAppointments: number
  title: string
  image: string
  onClickSignIn?: () => any
  href?: string
}

const SignInCard: React.FC<Props> = ({
  tags,
  date,
  numAppointments,
  title,
  image,
  onClickSignIn,
  href
}) => {
  const { space } = useTheme()
  return (
    <Link href={href}>
      <Card isFullHeight={false}>
        <Box bg="primary.500" h="120" padding={space['0.5']}>
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
        </Box>
        <Box padding={space['0.5']}>
          <Row space={space['0.5']} paddingY={space['0.5']} flexWrap="wrap">
            {tags.map((t, i) => (
              <Tag key={`tag-${i}`} text={t} />
            ))}
          </Row>
          <Row space={1.5}>
            <Text>Ab {date.toLocaleDateString()}</Text>
            <Text>•</Text>
            <Text>{numAppointments} Termine</Text>
          </Row>
          <Text
            bold
            fontSize={'md'}
            paddingTop={space['0.5']}
            paddingBottom={space['0.5']}>
            {title}
          </Text>
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
