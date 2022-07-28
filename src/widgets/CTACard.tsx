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

import { Fragment, ReactNode } from 'react'

type Props = {
  title: string
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
  closeable = false,
  variant = 'normal',
  onClose
}) => {
  const { space } = useTheme()

  const Wrapper = variant === 'normal' ? Card : Fragment

  return (
    <Wrapper flexibleWidth>
      <Box padding={(variant === 'normal' && space['1']) || 0}>
        <Row>
          <Text fontSize={'lg'} flex="1">
            {title}
          </Text>
          {closeable && (
            <Pressable testID="close" onPress={onClose}>
              <CloseIcon />
            </Pressable>
          )}
        </Row>
        {content}
        {button && <Box marginTop={space['1']}>{button}</Box>}
      </Box>
    </Wrapper>
  )
}
export default CTACard
