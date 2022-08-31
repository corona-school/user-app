import { View, Box, Link, Row, Column, Text, CircleIcon } from 'native-base'
import { useMemo, useState } from 'react'

type Props = {
  iconPath?: string
  textIcon?: string
  text: string
  link?: string
  variant?: 'normal' | 'full' | 'center'
  space?: number
  onPress?: () => any
  isDisabled?: boolean
}

const IconTagList: React.FC<Props> = ({
  iconPath,
  textIcon,
  text,
  link,
  variant = 'normal',
  space,
  onPress,
  isDisabled
}) => {
  const [active, setActive] = useState<boolean>(false)

  const renderIcon = useMemo(() => {
    if (!iconPath) return
    try {
      const Res = require(`../assets/icons/lernfair/${iconPath}`).default
      return <Res />
    } catch (e) {}
    return <CircleIcon size="30px" color="lightText" />
  }, [iconPath])

  const renderText = useMemo(() => {
    if (iconPath) return

    return (
      <Box
        size={'7'}
        position={'relative'}
        justifyContent="center"
        alignItems="center">
        <CircleIcon
          color="lightText"
          position="absolute"
          size="7"
          top="0"
          left="0"
          zIndex="-1"
        />
        <Text bold fontSize="20px" textAlign={'center'}>
          {textIcon}
        </Text>
      </Box>
    )
  }, [iconPath, textIcon])

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
              {(iconPath && renderIcon) || renderText}
            </Column>
            <Column alignItems="center" justifyContent="center">
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
