import {
  View,
  Text,
  Box,
  Row,
  InfoIcon,
  CloseIcon,
  Pressable,
  useTheme,
  Container,
  Tooltip
} from 'native-base'
import Card from '../components/Card'

import { Fragment, ReactNode } from 'react'

type Props = {
  title: string
  infotooltip?: string
  icon?: ReactNode
  onClose?: () => any
  content: ReactNode | ReactNode[]
  button?: ReactNode
  closeable?: boolean
  variant?: 'normal' | 'outline'
}

const CTACard: React.FC<Props> = ({
  title,
  infotooltip,
  content,
  button,
  icon,
  closeable = false,
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
          <Container maxWidth="100%">
            <Text
              width="100%"
              bold
              fontSize={'lg'}
              flex="1"
              marginBottom={space['0.5']}
              marginLeft={icon ? space['1'] : ''}
              display="flex"  
            >
              {title}

              { infotooltip && 
                <Tooltip label={infotooltip}>
                  <Box marginLeft="10px" marginRight="10px">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              }

            </Text>
            <Text marginLeft={icon ? space['1'] : ''}>{content}</Text>
          </Container>
          {closeable && (
            <Pressable onPress={onClose} testID="close">
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
