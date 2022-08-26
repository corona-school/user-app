import {
  View,
  Text,
  Column,
  Row,
  Circle,
  InfoIcon,
  Pressable,
  useTheme,
  Container,
  Box,
  CloseIcon,
  Heading
} from 'native-base'

import { useContext } from 'react'
import { ModalContext } from './FullPageModal'

type Props = {
  status: 'full' | 'last' | 'free'
  infoPopupTitle?: string
  infoPopupContent?: string
  infoPopupLastContent?: string
}

const CourseTrafficLamp: React.FC<Props> = ({
  status = 'free',
  infoPopupTitle,
  infoPopupContent,
  infoPopupLastContent
}) => {
  const { space } = useTheme()
  const { setShow, setContent, setVariant } = useContext(ModalContext)

  return (
    <View>
      <Row paddingY={5}>
        <Column flexDirection="row" alignItems="center">
          <Circle
            backgroundColor={
              status === 'free'
                ? 'primary.900'
                : status === 'last'
                ? 'warning.1000'
                : status === 'full'
                ? 'warning.500'
                : ''
            }
            size="20px"
            marginRight={3}
          />
          <Text marginRight={7} bold>
            {status === 'free'
              ? 'Freie Plätze'
              : status === 'last'
              ? 'Wenige freie Plätze'
              : status === 'full'
              ? 'Ausgebucht'
              : ''}
          </Text>
          {infoPopupTitle && (
            <Pressable
              onPress={() => {
                setVariant('light')
                setContent(
                  <Container maxWidth="100%" padding={space['1']}>
                    <Box marginBottom={space['2']}>
                      <Pressable
                        onPress={() => {
                          setShow(false)
                        }}>
                        <CloseIcon color="primary.800" />
                      </Pressable>
                    </Box>
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      marginBottom={3}>
                      <InfoIcon marginRight={3} size="30" color="danger.100" />
                      {infoPopupTitle && <Heading>{infoPopupTitle}</Heading>}
                    </Box>
                    <Box paddingY={space['0.5']}>
                      {infoPopupContent && (
                        <Text marginBottom={space['0.5']}>
                          {infoPopupContent}
                        </Text>
                      )}
                    </Box>

                    <Box>
                      <Row paddingY={space['0.5']}>
                        <Column flexDirection="row" alignItems="center">
                          <Circle
                            backgroundColor="warning.500"
                            size="20px"
                            marginRight={3}
                          />
                          <Text marginRight={7} bold>
                            Ausgebucht
                          </Text>
                        </Column>
                      </Row>
                      <Row paddingY={space['0.5']}>
                        <Column flexDirection="row" alignItems="center">
                          <Circle
                            backgroundColor="warning.1000"
                            size="20px"
                            marginRight={3}
                          />
                          <Text marginRight={7} bold>
                            Wenige freie Plätze
                          </Text>
                        </Column>
                      </Row>
                      <Row paddingY={space['0.5']}>
                        <Column flexDirection="row" alignItems="center">
                          <Circle
                            backgroundColor="primary.900"
                            size="20px"
                            marginRight={3}
                          />
                          <Text marginRight={7} bold>
                            Freie Plätze
                          </Text>
                        </Column>
                      </Row>
                    </Box>

                    <Box paddingY={space['0.5']}>
                      {infoPopupLastContent && (
                        <Text marginBottom={space['0.5']}>
                          {infoPopupLastContent}
                        </Text>
                      )}
                    </Box>
                  </Container>
                )
                setShow(true)
              }}>
              <InfoIcon marginRight={3} size="5" color="danger.100" />
            </Pressable>
          )}
        </Column>
      </Row>
    </View>
  )
}
export default CourseTrafficLamp
