import {
  Text,
  Box,
  Row,
  InfoIcon,
  CloseIcon,
  Pressable,
  useTheme,
  Container,
  Tooltip,
  useBreakpointValue
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
  width?: number | string
}

const CTACard: React.FC<Props> = ({
  width,
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
  const { space, sizes } = useTheme()

  const Wrapper = variant === 'normal' ? Card : Fragment

  const CardMobileDirection = useBreakpointValue({
    base: 'column',
    lg: 'row'
  })

  const CardMobileJContent = useBreakpointValue({
    base: 'stretch',
    lg: 'space-between'
  })

  const CardMobileAlignItems = useBreakpointValue({
    base: 'stretch',
    lg: 'center'
  })

  return (
    <Wrapper flexibleWidth width={width}>
      <Box
        flexDirection={CardMobileDirection}
        justifyContent={CardMobileJContent}
        alignItems={CardMobileAlignItems}
        mb={marginBottom}
        backgroundColor={variant === 'dark' ? 'primary.900' : 'primary.300'}
        padding={variant === 'normal' || variant === 'dark' ? space['1'] : 0}
        borderRadius={15}>
        <Row justifyContent={closeable ? 'space-between' : ''}>
          <Box>{icon}</Box>
          <Container>
            <Text
              maxWidth={250}
              bold
              fontSize={'lg'}
              flex="1"
              marginBottom={space['0.5']}
              marginLeft={icon ? space['1'] : ''}
              color={variant === 'dark' ? 'lightText' : 'primary.800'}
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
              color={variant === 'dark' ? 'lightText' : 'primary.800'}
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
