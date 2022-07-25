import {
  View,
  Text,
  Box,
  Row,
  Image,
  CloseIcon,
  Pressable,
  useTheme
} from 'native-base'
import Card from '../components/Card'

import { ReactNode } from 'react'

type Props = {
  title: string
  onClose?: () => any
  content: ReactNode | ReactNode[]
  button?: ReactNode
}

const CTACard: React.FC<Props> = ({ title, content, button }) => {
  const { space } = useTheme()

  return (
    <Card flexibleWidth>
      <Box padding={space['1']}>
        <Row>
          <Text fontSize={'lg'} flex="1">
            {title}
          </Text>
          <Pressable onPress={() => alert('test')}>
            <CloseIcon />
          </Pressable>
        </Row>
        {content}
        {button && <Box marginTop={space['1']}>{button}</Box>}
      </Box>
    </Card>
  )
}
export default CTACard
