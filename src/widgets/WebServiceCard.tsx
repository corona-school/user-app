import { View, Text, Row, useTheme, Box, Link, Image, Heading, Column, Container, Button, InfoIcon, CloseIcon } from 'native-base';
import { ReactNode, useContext } from 'react';
import { Pressable } from 'react-native';
import Card from '../components/Card';
import Tag from '../components/Tag';
import useModal from '../hooks/useModal';

type Props = {
    title: string;
    description: ReactNode;
    image: string;
    url: string;
    tags: string[];
    pros: string[];
    contra: string[];
    buttontext?: string;
};

const WebServiceCard: React.FC<Props> = ({ title, description, image, tags, url, pros, contra, buttontext = 'Zur Website' }) => {
    const { space } = useTheme();
    const { show, hide } = useModal();

    return (
        <View>
            <Pressable
                onPress={() => {
                    show(
                        { variant: 'light' },
                        <Container maxWidth="100%" padding={space['1']}>
                            <Box marginBottom={space['2']}>
                                <Pressable onPress={hide}>
                                    <CloseIcon color="primary.800" />
                                </Pressable>
                            </Box>
                            <Box flexDirection="row" alignItems="center" marginBottom={3}>
                                <InfoIcon marginRight={3} size="30" color="danger.100" />
                                {title && <Heading>{title}</Heading>}
                            </Box>
                            <Box paddingY={space['0.5']}>{description && <Text marginBottom={space['0.5']}>{description}</Text>}</Box>
                            <Box paddingY={space['0.5']} width="100%" flexDirection="row">
                                {url && (
                                    <Link href={url} isExternal width="100%" display="block" marginBottom={space['0.5']}>
                                        <Button>{buttontext}</Button>
                                    </Link>
                                )}
                            </Box>

                            {pros && (
                                <Box marginY={space['1']} padding={space['1.5']} backgroundColor="primary.200" borderRadius="8px" width="100%">
                                    <Heading fontSize="md" marginBottom={space['0.5']}>
                                        Pro
                                    </Heading>
                                    <Box>
                                        {pros.map((t, i) => (
                                            <Text key={i}>{`• ${t}`}</Text>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {contra && (
                                <Box marginY={space['1']} padding={space['1.5']} backgroundColor="primary.200" borderRadius="8px" width="100%">
                                    <Heading fontSize="md" marginBottom={space['0.5']}>
                                        Contra
                                    </Heading>
                                    <Box>
                                        {pros.map((t, i) => (
                                            <Text key={i}>{`• ${t}`}</Text>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Container>
                    );
                }}
            >
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
                    <Box padding={space['1']} backgroundColor="primary.200">
                        {title && (
                            <Box flexDirection="row" alignItems="center" marginBottom={space['0.5']}>
                                <Heading fontSize="md" marginRight={space['0.5']}>
                                    {title}
                                </Heading>
                                <InfoIcon marginRight={3} size="5" color="danger.100" />
                            </Box>
                        )}
                        <Row marginY={space['0.5']} width="100%" justifyContent="space-between">
                            <Column flexDirection="row">
                                <Box flexDirection="row">
                                    {tags.map((t, i) => (
                                        <Box marginRight={space['0.5']}>
                                            <Tag key={i} text={t} />
                                        </Box>
                                    ))}
                                </Box>
                            </Column>
                        </Row>
                    </Box>
                </Card>
            </Pressable>
        </View>
    );
};
export default WebServiceCard;
