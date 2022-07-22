import { Text, Row, Column, Avatar, useTheme, Box } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  name: string
  align?: 'row' | 'column'
}

const CommunityUser: React.FC<Props> = ({ align = 'row', name }) => {
  const { space } = useTheme()

  const View = align === 'row' ? Row : Column

  return (
    <View alignItems={'center'} marginTop={space['1.5']} space={space['0.5']}>
      <Avatar size={'xs'} />
      <Text>{name}</Text>
    </View>
  )
}
export default CommunityUser
