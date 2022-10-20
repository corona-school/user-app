import {
  View,
  useTheme,
  Row,
  VStack,
  Heading,
  Button,
  Box,
  Link,
  useBreakpointValue
} from 'native-base'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  variant?: 'dark' | 'light'
  icon?: ReactNode
  title?: string
  content?: ReactNode

  isOutlineButtonLink?: boolean
  outlineButtonText?: string
  outlinebuttonLink?: () => any

  isdefaultButtonFirst?: boolean
  defaultButtonText?: string
  defaultbuttonLink?: () => any
}

const InfoScreen: React.FC<Props> = ({
  variant = 'dark',
  isOutlineButtonLink = false,
  isdefaultButtonFirst = false,
  icon,
  title,
  content,
  outlineButtonText,
  outlinebuttonLink,
  defaultButtonText,
  defaultbuttonLink
}) => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  const buttonWidth = useBreakpointValue({
    base: '80%',
    lg: sizes['desktopbuttonWidth']
  })

  return (
    <View
      width="100vw"
      height="100vh"
      backgroundColor={variant === 'dark' ? 'primary.900' : 'white'}>
      <VStack>
        <Row
          width={ContentContainerWidth}
          marginX="auto"
          flexDirection="column"
          paddingY={space['4']}
          justifyContent="center"
          alignItems="center">
          {icon && (
            <Box width="100%" alignItems="center" textAlign="center">
              {icon}
            </Box>
          )}
          {title && (
            <Heading
              maxWidth="220"
              textAlign="center"
              paddingTop={space['1.5']}
              paddingBottom={space['0.5']}
              color={variant === 'dark' ? 'lightText' : 'primary.700'}>
              {t(title)}
            </Heading>
          )}
          {content && (
            <Box
              maxWidth="300"
              paddingBottom={space['2']}
              color={variant === 'dark' ? 'lightText' : 'primary.700'}
              textAlign="center">
              {content}
            </Box>
          )}
          {outlineButtonText && isOutlineButtonLink === false && (
            <Box marginBottom={3} width={buttonWidth}>
              <Button
                variant={variant === 'dark' ? 'outlinelight' : 'outline'}
                marginX="auto"
                // width={buttonWidth}
                onPress={outlinebuttonLink}>
                {t(outlineButtonText)}
              </Button>
            </Box>
          )}

          {isdefaultButtonFirst && defaultButtonText && (
            <Box width={buttonWidth}>
              <Button
                marginX="auto"
                // width={buttonWidth}
                onPress={defaultbuttonLink}>
                {t(defaultButtonText)}
              </Button>
            </Box>
          )}
          {defaultButtonText && !isdefaultButtonFirst && (
            <Box width={buttonWidth}>
              <Button
                // width={buttonWidth}
                onPress={defaultbuttonLink}>
                {t(defaultButtonText)}
              </Button>
            </Box>
          )}
          {isOutlineButtonLink && (
            <Box marginY={space['1']} color="lightText">
              <Link
                _text={{
                  fontWeight: 600,
                  color: variant === 'dark' ? 'primary.400' : 'primary.800'
                }}
                onPress={outlinebuttonLink}>
                {outlineButtonText}
              </Link>
            </Box>
          )}
        </Row>
      </VStack>
    </View>
  )
}
export default InfoScreen
