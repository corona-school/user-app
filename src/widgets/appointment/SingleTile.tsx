import { Box, Card, HStack, Image, VStack, Text, Badge, Tag } from 'native-base';

const SingleTile = () => {
    return (
        <Box>
            <Card>
                <HStack>
                    <Image></Image>
                    <VStack>
                        <Text>Gymnasium • 3. Klasse</Text>
                        <Text>Leon Jackson</Text>
                        <Tag>Englisch</Tag>
                    </VStack>
                </HStack>
            </Card>
        </Box>
    );
};

export default SingleTile;
