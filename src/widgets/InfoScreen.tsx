import {
  View,
  useTheme,
  Row,
  VStack,
  Heading,
  Button,
  Box,
  Link
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
  const { space } = useTheme()
  const { t } = useTranslation()

  return (
    <View
      width="100vw"
      height="100vh"
      backgroundColor={variant === 'dark' ? 'primary.900' : 'white'}>
      <VStack>
        <Row
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
            <Box marginX="90px" marginBottom={3} display="block" width="80%">
              <Button
                variant={variant === 'dark' ? 'outlinelight' : 'outline'}
                width="100%"
                onPress={outlinebuttonLink}>
                {t(outlineButtonText)}
              </Button>
            </Box>
          )}

          {isdefaultButtonFirst && defaultButtonText && (
            <Box marginX="90px" display="block" width="80%">
              <Button width="100%" onPress={defaultbuttonLink}>
                {t(defaultButtonText)}
              </Button>
            </Box>
          )}
          {defaultButtonText && !isdefaultButtonFirst && (
            <Box marginX="90px" display="block" width="80%">
              <Button width="100%" onPress={defaultbuttonLink}>
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
