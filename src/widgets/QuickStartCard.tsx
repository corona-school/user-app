import { View, Text, Row, useTheme, Box, Link, Image, Heading, Column, PlayIcon } from 'native-base';
import Card from '../components/Card';

type Props = {
    title: string;
    description: string;
    image: string;
    url: string;
    posttype: string;
    readingtime: number;
};

const QuickStartCard: React.FC<Props> = ({ title, description, image, url, posttype, readingtime }) => {
    const { space } = useTheme();

    return (
        <View>
            <Link display="block" href={url}>
                <Card flexibleWidth={true}>
                    <Box padding={space['1']} minHeight={173}>
                        <Image
                            position="absolute"
                            left={0}
                            right={0}
                            top={0}
                            width="100%"
                            height="100%"
                            alt={title}
                            source={{
                                uri: image,
                            }}
                        />
                    </Box>
                    <Box padding={space['1']} backgroundColor="primary.900">
                        {title && (
                            <Heading fontSize="md" color="lightText" marginBottom={space['0.5']}>
                                {title}
                            </Heading>
                        )}
                        {description && (
                            <Text marginBottom={space['0.5']} color="lightText">
                                {description}
                            </Text>
                        )}
                        <Row marginY={space['0.5']} width="100%" justifyContent="space-between">
                            <Column flexDirection="row">
                                <Box marginRight={space['0.5']}>
                                    <PlayIcon color="white" />
                                </Box>
                                <Text bold color="white">
                                    {posttype}
                                </Text>
                            </Column>
                            <Column flexDirection="row">
                                <Box marginRight={space['0.5']}>
                                    <PlayIcon color="white" />
                                </Box>
                                <Text bold color="white">
                                    {readingtime} Min.
                                </Text>
                            </Column>
                        </Row>
                    </Box>
                </Card>
            </Link>
        </View>
    );
};
export default QuickStartCard;
