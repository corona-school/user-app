import { View, Image, Avatar, Text, Row, useTheme, Column, Link } from 'native-base'
import Card from '../components/Card'

type Props = {
  variant?: 'normal' | 'bigger' | 'horizontal' | 'teaser'
  name: string
  link?: string
  content?: string
  avatar?: string
  rating?: number
}

const RatingCard: React.FC<Props> = ({
  variant = 'normal',
  name,
  link,
  content,
  avatar
}) => {
  const { space } = useTheme()
  const isBigger = variant === 'bigger'

  return (
    <View>
      <Link href={link}>
        <Card flexibleWidth={ variant === 'horizontal' ||  variant === 'teaser' ? true : false }>
          
          { variant === 'horizontal' ||  variant === 'teaser' ?
            <Row
                flexDir={isBigger ? 'column' : 'row'}
                alignItems="center">

                <Column marginRight={4}>
                  <Image source={{
                    uri: avatar
                  }} alt={name} size="lg" />
                </Column>
                <Column>
                  <Text bold fontSize={'lg'} marginBottom={ isBigger ? space['1'] : ''}>
                    {name}
                  </Text>
                </Column>
              </Row>
            : 
            <>
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
                <Text bold fontSize={'lg'} marginBottom={ isBigger ? space['1'] : ''}>
                  {name}
                </Text>
              </Row>

              {content && (
                  <Row
                    paddingTop={space['0.5']}
                    paddingBottom={space['0.5']}
                    paddingLeft={space['1']}
                    paddingRight={space['1']}>
                    <Text marginBottom={ !isBigger ? space['0.5'] : ''} textAlign={isBigger ? 'center' : 'left'}>{content}</Text>
                  </Row>
              )}
            </>
          }
        </Card>
      </Link>
    </View>
  )
}
export default RatingCard
