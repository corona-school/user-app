import { View, Box, Link, Row, Column, Icon, Text } from 'native-base'
import { useState } from 'react'

type Props = {
  icon?: string
  text: string
  link?: string
  variant?: 'normal' | 'full' | 'center'
  space?: number
  onPress?: () => any
  isDisabled?: boolean
}

const IconTagList: React.FC<Props> = ({
  icon,
  text,
  link,
  variant = 'normal',
  space,
  onPress,
  isDisabled
}) => {
  const [active, setActive] = useState<boolean>(false)

  return (
    <View width={variant === 'full' ? '100%' : ''} paddingY={space}>
      <Link
        onPress={() => {
          if (isDisabled) return
          setActive(prev => !prev)
          onPress && onPress()
        }}
        display={variant === 'full' ? 'block' : ''}
        href={link}>
        <Box
          backgroundColor={active ? 'primary.900' : 'primary.100'}
          borderRadius="5px"
          padding={variant === 'center' ? '30px 20px' : '10px 30px'}>
          <Row flexDirection={variant === 'center' ? 'column' : 'row'}>
            <Column
              marginRight={2}
              marginBottom={variant === 'center' ? 2 : ''}>
              <Icon name={icon} />
            </Column>
            <Column>
              <Text
                textAlign={variant === 'center' ? 'center' : 'left'}
                color={active ? 'lightText' : 'darkText'}>
                {text}
              </Text>
            </Column>
          </Row>
        </Box>
      </Link>
    </View>
  )
}
export default IconTagList
