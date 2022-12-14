import { View, Box, Link, Row, Column, Text, CircleIcon } from 'native-base'
import { useEffect, useMemo, useState } from 'react'
import { IconLoader } from '../components/IconLoader'


export type IIconTagList = {
  iconPath?: string
  textIcon?: string
  text: string
  link?: string
  variant?: 'normal' | 'full' | 'center' | 'selection'
  space?: number
  onPress?: () => any
  isDisabled?: boolean
  initial?: boolean
}

const IconTagList: React.FC<IIconTagList> = ({
  iconPath,
  textIcon,
  text,
  link,
  variant = 'normal',
  space,
  onPress,
  isDisabled,
  initial
}) => {
  const [active, setActive] = useState<boolean>(false)

  useEffect(() => {
    setActive(!!initial)
  }, [initial])

  const renderIcon = useMemo(() => {
    if (!iconPath) return
    return <IconLoader iconPath={iconPath} />;
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
          size={'7'}
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
    <View
      height={variant === 'selection' ? '100%' : undefined}
      width={variant === 'full' || variant === 'selection' ? '100%' : ''}
      paddingY={space}>
      <Link
        height={variant === 'selection' ? '100%' : undefined}
        onPress={() => {
          if (isDisabled) return
          initial === undefined && setActive(prev => !prev)
          onPress && onPress()
        }}
        display={variant === 'full' || variant === 'selection' ? 'block' : ''}
        href={link}>
        <Box
          w={variant === 'full' || variant === 'selection' ? '100%' : undefined}
          backgroundColor={active ? 'primary.900' : 'primary.100'}
          borderRadius="5px"
          padding={variant === 'center' ? '30px 20px' : '10px 30px'}
          height={variant === 'selection' ? '100%' : undefined}>
          <Row
            flexDirection={
              variant === 'center' || variant === 'selection' ? 'column' : 'row'
            }
            alignItems="center">
            <Column
              marginRight={variant !== 'selection' ? 2 : 0}
              marginBottom={
                variant === 'center' || variant === 'selection' ? 2 : ''
              }>
              {(iconPath && renderIcon) || renderText}
            </Column>
            <Column alignItems="center" justifyContent="center">
              <Text
                fontWeight={variant === 'selection' ? 600 : 400}
                textAlign={
                  variant === 'center' || variant === 'selection'
                    ? 'center'
                    : 'left'
                }
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
