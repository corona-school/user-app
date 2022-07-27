import { View, Text, Flex, Link, Avatar, Heading, useTheme } from 'native-base'
import { ReactNode } from 'react'

import CommunityUser from '../widgets/CommunityUser'
import Card from '../components/Card'

type Props = {
    variant?: 'normal' | 'card'
    link: string
    username: string
    usernamesize?: string
    usernameweight?: string
    avatar?: string
    avatarsize?: string
}

const PersonListing: React.FC<Props> = ({ variant, link, username, avatar, avatarsize, usernamesize, usernameweight }) => {
  const { space } = useTheme()
  
  const CardVariant = variant === 'card'
  const Wrapper = CardVariant ? Card : View

  return (
    <Wrapper>
       <Link 
            href={link} 
            paddingLeft={ CardVariant ? space['1.5'] : ''} 
            paddingRight={ CardVariant ? space['1.5'] : ''} 
            paddingBottom={ CardVariant ? space['1.5'] : '' } 
            justifyContent={ CardVariant ? 'center' : ''}
        >
            <Flex 
                flexDirection="row"
                alignItems="center"
                marginRight={ variant === 'normal' ?  space['1'] : '' }
            >
                <CommunityUser
                    align={ variant === 'normal' ? 'row' : 'column'}
                    avatar={avatar}
                    avatarsize={avatarsize}
                    name={ username }
                    usernameweight={ usernameweight }
                    usernamesize={ usernamesize }
                /> 
            </Flex>
        </Link>   
    </Wrapper>
  )
}
export default PersonListing
