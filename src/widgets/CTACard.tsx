import {
  View,
  Text,
  Box,
  Row,
  Image,
  CloseIcon,
  Pressable,
  useTheme,
  Container
} from 'native-base'
import Card from '../components/Card'

import { Fragment, ReactNode } from 'react'

type Props = {
  title: string
  icon?: ReactNode
  onClose?: () => any
  content: ReactNode | ReactNode[]
  button?: ReactNode
  closeable?: boolean
  variant?: 'normal' | 'outline'
}

const CTACard: React.FC<Props> = ({
  title,
  content,
  button,
  icon,
  closeable = true,
  variant = 'normal',
  onClose
}) => {
  const { space } = useTheme()

  const Wrapper = variant === 'normal' ? Card : Fragment

  return (
    <Wrapper flexibleWidth>
      <Box padding={(variant === 'normal' && space['1']) || 0}>
        <Row justifyContent={closeable ? 'space-between' : ''}>
          {icon && icon}
          <Container>
            <Text
              width="100%"
              bold
              fontSize={'lg'}
              flex="1"
              marginBottom={space['0.5']}
              marginLeft={icon ? space['1'] : ''}>
              {title}
            </Text>
            <Text marginLeft={icon ? space['1'] : ''}>{content}</Text>
          </Container>
          {closeable && (
            <Pressable onPress={onClose}>
              <CloseIcon />
            </Pressable>
          )}
        </Row>
        {button && <Box marginTop={space['1']}>{button}</Box>}
      </Box>
    </Wrapper>
  )
}
export default CTACard
