import { ReactNode } from 'react'
import { View, Text, Row, useTheme, Box, Flex, Button, Link } from 'native-base'
import Card from '../components/Card'
import Tag from '../components/Tag'
import CommunityUser from './CommunityUser'

type Props = {
  tags: string[]
  date: Date
  title: string
  child: string
  avatar?: string
  avatarname?: string
  button?: ReactNode
  buttonlink?: string
  variant?: 'card' | 'horizontal'
}

const AppointmentCard: React.FC<Props> = ({ tags, date, title, child, variant = 'card', avatar, avatarname, button, buttonlink}) => {
  const { space } = useTheme()

  return (
    <View>
    { variant === "card" ? 

      <Card flexibleWidth>
        <Box bg="gray.500" h="120" padding={space['0.5']}>
          <Row space={space['0.5']}>
            {tags.map((t, i) => (
              <Tag key={`tag-${i}`} text={t} />
            ))}
          </Row>
        </Box>
        <Box padding={space['0.5']}>
          <Row paddingTop={space['1']} space={1}>
            <Text>{date.toLocaleDateString()}</Text>
            <Text>•</Text>
            <Text>{date.toLocaleTimeString().slice(0, -3)}</Text>
          </Row>
          <Text bold fontSize={'md'}>
            {title}
          </Text>
          {child && <CommunityUser name={child} />}
            
          { button &&
            <Link href={buttonlink}>
              <Button marginTop={space['1']} marginBottom={ space['0.5'] }>
                { button }
              </Button>
            </Link>
          }

        </Box>
      </Card>
      : 
      <Flex 
        direction="row" 
        borderBottomColor="gray.300"
        borderBottomWidth="1"
        paddingLeft={space['0.5']}
        paddingRight={space['0.5']}
        paddingTop={space['1.5']} 
        paddingBottom={space['1.5']} 
      >
        <Box marginRight={space['1']}>
          <CommunityUser
            spacingTop={false}
            align="column"
            avatar={avatar}
            avatarsize="md"
            name={ avatarname }
            usernameweight="400"
          /> 
        </Box>     
        <Box>
          <Row space={1}>
            <Text>{date.toLocaleDateString()}</Text>
            <Text>•</Text>
            <Text>{date.toLocaleTimeString().slice(0, -3)}</Text>
          </Row>
          <Text bold fontSize={'md'} mb={space['0.5']}>
            {title}
          </Text> 
          <Row space={space['0.5']}>
              {tags.map((t, i) => (
                <Tag key={`tag-${i}`} text={t} />
            ))}
          </Row>
        </Box>     
      </Flex>
    }    
    </View>
  )
}
export default AppointmentCard
