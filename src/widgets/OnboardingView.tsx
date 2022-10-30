import {
  Text,
  Box,
  useTheme,
  View,
  Heading,
  Image,
  Row,
  Pressable
} from 'native-base'
import { useContext } from 'react'
import Bullet from '../components/Bullet'
import { ViewPagerContext } from '../components/ViewPager'

type Props = {
  title: string
  content?: string
  contentEnd?: string
  image: string
  isBigger?: boolean
}

const OnboardingView: React.FC<Props> = ({
  title,
  content,
  contentEnd,
  image,
  isBigger = false
}) => {
  const { space } = useTheme()
  const { currentIndex, setCurrentIndex, itemCount } =
    useContext(ViewPagerContext)

  return (
    <View>
      <Box width="100%">
        <View
          paddingX={space['1']}
          paddingBottom={space['1']}
          marginBottom={space['1']}
          color="lightText"
          alignItems="center"
          borderBottomRadius="15px"
          backgroundColor="primary.700">
          <Row flexDirection="column">
            {title && (
              <Heading
                fontSize="xl"
                color="lightText"
                textAlign="center"
                paddingY={space['1']}
                maxWidth="350px">
                {title}
              </Heading>
            )}
            {content && (
              <Text
                color="lightText"
                textAlign="center"
                maxWidth="350px"
                paddingBottom={space['1']}>
                {content}
              </Text>
            )}

            {contentEnd && (
              <Text
                color="lightText"
                textAlign="center"
                maxWidth="350px"
                paddingBottom={space['1']}>
                {contentEnd}
              </Text>
            )}
          </Row>
        </View>
      </Box>
      {image && (
        <Box justifyContent="center" flex="1">
          <Box justifyContent="center">
            <Image
              minWidth="400px"
              maxWidth="500px"
              minHeight="420px"
              maxHeight="500px"
              position="static"
              alt="Matching"
              resizeMode="contain"
              source={{ uri: image }}
            />
          </Box>
          <Row
            space={space['0.5']}
            marginTop={space['1']}
            marginBottom="6%"
            justifyContent="center"
            alignItems="center">
            {new Array(itemCount).fill(0).map((_, i) => (
              <Pressable onPress={() => setCurrentIndex(i)}>
                <Bullet isActive={i === currentIndex ? true : false} />
              </Pressable>
            ))}
          </Row>
        </Box>
      )}
    </View>
  )
}
export default OnboardingView
