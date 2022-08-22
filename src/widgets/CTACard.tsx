import {
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
  variant?: 'normal' | 'outline' | 'dark'
  marginBottom?: number
}

const CTACard: React.FC<Props> = ({
  title,
  infotooltip,
  content,
  button,
  icon,
  closeable = false,
  variant = 'normal',
  onClose,
  marginBottom = 0
}) => {
  const { space } = useTheme()

  const Wrapper = variant === 'normal' ? Card : Fragment

  return (
    <Wrapper flexibleWidth>
      <Box
        mb={marginBottom}
        backgroundColor={variant === 'dark' ? 'primary.900' : 'primary.300'}
        padding={variant === 'normal' || variant === 'dark' ? space['1'] : 0}
        borderRadius={15}>
        <Row justifyContent={closeable ? 'space-between' : ''}>
          <Box>{icon}</Box>
          <Container maxWidth="100%">
            <Text
              width="100%"
              maxWidth={250}
              bold
              fontSize={'lg'}
              flex="1"
              marginBottom={space['0.5']}
              marginLeft={icon ? space['1'] : ''}
              color={variant === 'dark' ? 'lightText' : ''}
              display="flex">
              {title}

              {infotooltip && (
                <Tooltip label={infotooltip}>
                  <Box marginLeft="10px" marginRight="10px">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              )}
            </Text>
            <Text
              color={variant === 'dark' ? 'lightText' : ''}
              maxWidth={250}
              marginLeft={icon ? space['1'] : ''}>
              {content}
            </Text>
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
