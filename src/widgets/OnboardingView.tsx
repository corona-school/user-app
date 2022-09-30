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
import Bullet from '../components/Bullet'

type Props = {
  title: string
  content?: string
  contentEnd?: string
  image: string
  // itemCount?: number
  // currentIndex?: number
  // setCurrentIndex: (i: number) => any
}

const OnboardingView: React.FC<Props> = ({
  title,
  content,
  contentEnd,
  image
  // itemCount,
  // currentIndex,
  // setCurrentIndex
}) => {
  const { space } = useTheme()
  // const isMultiple = Array.isArray(itemCount)

  return (
    <>
      <Box width="100%">
        <View
          paddingX={space['1']}
          paddingBottom={space['1']}
          marginBottom={space['1']}
          color="lightText"
          alignItems="center"
          borderBottomRadius="15px"
          backgroundColor="primary.700">
          {title && (
            <Heading
              fontSize="xl"
              color="lightText"
              textAlign="center"
              paddingY={space['1']}
              maxWidth="278px">
              {title}
            </Heading>
          )}
          {content && (
            <Text
              color="lightText"
              textAlign="center"
              maxWidth="278px"
              paddingBottom={space['1']}>
              {content}
            </Text>
          )}

          {contentEnd && (
            <Text
              color="lightText"
              textAlign="center"
              maxWidth="278px"
              paddingBottom={space['1']}>
              {contentEnd}
            </Text>
          )}
        </View>
      </Box>
      {image && (
        <Box flex={1} justifyContent="center">
          <Image
            width="100%"
            height="350px"
            alt="Matching"
            resizeMode="contain"
            source={{ uri: image }}
          />
          {/* <Row space={space['0.5']} justifyContent="center" alignItems="center">
            {new Array((isMultiple && itemCount) || 0).fill(0).map((_, i) => (
              <Pressable onPress={() => setCurrentIndex(i)}>
                <Bullet isActive={i === currentIndex ? true : false} />
              </Pressable>
            ))}
          </Row> */}
        </Box>
      )}
    </>
  )
}
export default OnboardingView
