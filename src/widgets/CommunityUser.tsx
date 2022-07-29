import { Text, Row, Column, Avatar, useTheme, Box } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  name: string | undefined
  usernamesize?: string
  usernameweight?: string
  avatar?: string
  spacingTop?: Boolean
  avatarsize?: 'xs' | 'md'
  align?: 'row' | 'column'
}

const CommunityUser: React.FC<Props> = ({ align = 'row', name, avatar, avatarsize, usernamesize, usernameweight, spacingTop = true }) => {
  const { space } = useTheme()

  const View = align === 'row' ? Row : Column

  return (
    <View alignItems={'center'} marginTop={ spacingTop ? space['1.5'] : ''} space={space['0.5']}>
      <Avatar 
        size={ avatarsize || 'xs' } 
        source={{
          uri: avatar
        }} 
      />
      <Text maxW="100" textAlign="center" fontWeight={ usernameweight ? usernameweight : '' } fontSize={ usernamesize ? usernamesize : 'sm'}>{name}</Text>
    </View>
  )
}
export default CommunityUser
