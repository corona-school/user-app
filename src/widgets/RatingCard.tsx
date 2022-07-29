import { View, Flex, Avatar, Text, Row, useTheme } from 'native-base'
import Card from '../components/Card'

type Props = {
  variant?: 'normal' | 'bigger'
  name: string
  content?: string
  avatar: string
  rating: number
}

const RatingCard: React.FC<Props> = ({
  variant = 'normal',
  name,
  content,
  avatar
}) => {
  const { space } = useTheme()
  const isBigger = variant === 'bigger'

  return (
    <View>
      <Card>
        <Row
          paddingTop={space['1']}
          paddingLeft={space['1']}
          paddingRight={space['1']}
          flexDir={isBigger ? 'column' : 'row'}
          alignItems={isBigger ? 'center' : ''}>
          <Avatar
            size={isBigger ? 'md' : 'xs'}
            marginRight={space['0.5']}
            marginBottom={isBigger ? space['0.5'] : ''}
            source={{
              uri: avatar
            }}
          />
          <Text bold fontSize={'lg'}>
            {name}
          </Text>
        </Row>
        {content && (
          <Row
            paddingTop={space['0.5']}
            paddingBottom={space['0.5']}
            paddingLeft={space['1']}
            paddingRight={space['1']}>
            <Text textAlign={isBigger ? 'center' : 'left'}>{content}</Text>
          </Row>
        )}
      </Card>
    </View>
  )
}
export default RatingCard
