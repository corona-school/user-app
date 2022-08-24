import {
  View,
  useTheme,
  Row,
  VStack,
  Heading,
  Text,
  Button,
  Box
} from 'native-base'
import { ReactNode } from 'react'

type Props = {
  variant?: 'dark' | 'light'
  icon?: ReactNode
  title: string
  content?: string
  outlineButtonText?: string
  outlinebuttonLink?: () => any

  defaultButtonText?: string
  defaultbuttonLink?: () => any
}

const InfoScreen: React.FC<Props> = ({
  variant = 'dark',
  icon,
  title,
  content,
  outlineButtonText,
  outlinebuttonLink,
  defaultButtonText,
  defaultbuttonLink
}) => {
  const { space } = useTheme()

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
          {icon && <Box>{icon}</Box>}
          <Heading
            maxWidth="220"
            textAlign="center"
            paddingTop={space['1.5']}
            paddingBottom={space['0.5']}
            color={variant === 'dark' ? 'lightText' : 'primary.700'}>
            {title}
          </Heading>
          <Text
            paddingBottom={space['2']}
            color={variant === 'dark' ? 'lightText' : 'primary.700'}
            textAlign="center"
            maxWidth="300">
            {content}
          </Text>
          {outlineButtonText && (
            <Box marginX="90px" marginBottom={3} display="block" width="80%">
              <Button
                variant={variant === 'dark' ? 'outlinelight' : 'outline'}
                width="100%"
                onPress={outlinebuttonLink}>
                {outlineButtonText}
              </Button>
            </Box>
          )}
          {defaultButtonText && (
            <Box marginX="90px" display="block" width="80%">
              <Button width="100%" onPress={defaultbuttonLink}>
                {defaultButtonText}
              </Button>
            </Box>
          )}
        </Row>
      </VStack>
    </View>
  )
}
export default InfoScreen
