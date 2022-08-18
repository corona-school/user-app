import { View, Row, Column, Heading, AddIcon, Link } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
}

const ProfileSettingItem: React.FC<Props> = ({ title, children }) => {
  return (
    <View paddingY="4" borderBottomColor="primary.grey" borderBottomWidth={1}>
      <Heading fontSize="md">
        {title}
        <Link marginLeft="1" marginTop="-1" href="">
          <AddIcon size="3" color="primary.700" />
        </Link>
      </Heading>
      <Row paddingY="3">{children}</Row>
    </View>
  )
}
export default ProfileSettingItem
