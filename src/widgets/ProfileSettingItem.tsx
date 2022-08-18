import { View, Row, Column, Heading, AddIcon, Link } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  title?: string
  children: ReactNode
  border?: boolean
  isIcon?: boolean
  isHeaderspace?: boolean
}

const ProfileSettingItem: React.FC<Props> = ({
  title,
  children,
  border = true,
  isIcon = true,
  isHeaderspace = true
}) => {
  return (
    <View
      paddingY="4"
      borderBottomColor={border === true ? 'primary.grey' : ''}
      borderBottomWidth={border === false ? 0 : 1}>
      <Heading fontSize="md">
        {title}
        {isIcon && (
          <Link marginLeft="1" marginTop="-1" href="">
            <AddIcon size="3" color="primary.700" />
          </Link>
        )}
      </Heading>
      <Row paddingY={isHeaderspace ? '3' : ''}>{children}</Row>
    </View>
  )
}
export default ProfileSettingItem
