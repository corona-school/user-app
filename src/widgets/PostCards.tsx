import { View, Text, Box, Row, useTheme, Link, AspectRatio, Image } from 'native-base'

import Card from '../components/Card'

type Props = {
    title?: string
    content?: string
    link?: string
    image?: string  
}

const PostCards: React.FC<Props> = ( { title, content, link, image  }) => {
  return (
    <View>
       <Card>
            <Box h="100">
                <AspectRatio w="100%" ratio={16 / 9}>
                    <Image 
                        source={{
                            uri: image
                        }} 
                        alt={ title }
                    />
                </AspectRatio>
            </Box>
            <Box padding="3">
                <Text bold fontSize={'md'} marginBottom="2">
                    { title }
                </Text>
                <Text fontSize={'sm'} marginBottom="3">
                    { content }
                </Text>
                <Link href={ link } marginBottom="2">
                    Artikel lesen
                </Link>
            </Box>
        </Card>
    </View>
  )
}
export default PostCards
