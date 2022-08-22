import { View, Text, Box, Link, AspectRatio, Image } from 'native-base'

import Card from '../components/Card'

type Props = {
  title?: string
  content?: string
  onPressLink?: () => any
  image?: string
}

const PostCards: React.FC<Props> = ({ title, content, onPressLink, image }) => {
  return (
    <View>
      <Card>
        <Box h="100">
          <AspectRatio w="100%" ratio={16 / 9}>
            <Image
              source={{
                uri: image
              }}
              alt={title}
            />
          </AspectRatio>
        </Box>
        <Box padding="3">
          <Text bold fontSize={'md'} marginBottom="2">
            {title}
          </Text>
          <Text fontSize={'sm'} marginBottom="3">
            {content}
          </Text>
          <Link onPress={onPressLink} marginBottom="2">
            Artikel lesen
          </Link>
        </Box>
      </Card>
    </View>
  )
}
export default PostCards
