import { Text, Row, Column, Avatar, useTheme, Box } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  name: string
  usernamesize?: string
  usernameweight?: string
  avatar?: string
  avatarsize?: string 
  align?: 'row' | 'column'
}

const CommunityUser: React.FC<Props> = ({ align = 'row', name, avatar, avatarsize, usernamesize, usernameweight }) => {
  const { space } = useTheme()

  const View = align === 'row' ? Row : Column

  return (
    <View alignItems={'center'} marginTop={space['1.5']} space={space['0.5']}>
      <Avatar 
        size={ avatarsize? avatarsize : 'xs' } 
        source={{
          uri: avatar
        }} 
      />
      <Text maxW="140" textAlign="center" fontWeight={ usernameweight ? usernameweight : '' } fontSize={ usernamesize ? usernamesize : 'sm'}>{name}</Text>
    </View>
  )
}
export default CommunityUser
