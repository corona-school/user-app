import { View, Row, Heading, AddIcon, Link } from 'native-base'
import { ReactNode } from 'react'

import EditIcon from '../assets/icons/lernfair/lf-edit.svg'

type Props = {
  title?: string
  children: ReactNode
  border?: boolean
  isIcon?: boolean
  isHeaderspace?: boolean
  href?: string
}

const ProfileSettingItem: React.FC<Props> = ({
  title,
  children,
  border = true,
  isIcon = true,
  isHeaderspace = true,
  href
}) => {
  return (
    <View
      paddingY="4"
      borderBottomColor={border === true ? 'primary.grey' : ''}
      borderBottomWidth={border === false ? 0 : 1}>
      <Heading fontSize="md">
        {title}
        {isIcon && (
          <Link marginLeft="1" marginTop="-1" href={href}>
            <EditIcon fill="primary.700" />
          </Link>
        )}
      </Heading>
      <Row paddingY={isHeaderspace ? '3' : ''}>{children}</Row>
    </View>
  )
}
export default ProfileSettingItem
