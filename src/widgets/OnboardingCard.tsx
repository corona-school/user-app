import { Box, Container, Image, View, useTheme } from 'native-base';
import { Button, Card, Heading, Stack, Text, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import RequestInstructorTutorBanner from './RequestInstructorTutorBanner';

type CardProps = {
    headline: string;
    Description: React.FC;
    cardImage: string;
    mobileCardImage: string;
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    showRequestButton: boolean;
    showRequestBanner: boolean;
    requestButtonText: string;
    imageText: string;
    bannerHeadline: string;
    onRequest: () => void;
    onTalkToTeam: () => void;
    onMoreInfos: () => void;
};

const OnboardingCard: React.FC<CardProps> = ({
    headline,
    Description,
    cardImage,
    mobileCardImage,
    Icon,
    showRequestButton,
    showRequestBanner,
    requestButtonText,
    imageText,
    bannerHeadline,
    onRequest,
    onTalkToTeam,
    onMoreInfos,
}) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const isMobile = useBreakpointValue({ base: true, lg: false });

    return (
        <View px="10" maxW="1450px">
            <Card bgColor="primary.100">
                {!isMobile ? (
                    <Stack space="2" direction="row">
                        <Stack maxW="50%" px="5" space={space['1']}>
                            <Icon />
                            <Heading>{headline}</Heading>
                            <Text ellipsizeMode="tail" numberOfLines={2}>
                                {t('introduction.courseTypes')}
                            </Text>
                            <Box>
                                <Description />
                            </Box>

                            <Stack space={space['0.5']}>
                                {showRequestButton && <Button onPress={onRequest}>{requestButtonText}</Button>}
                                {showRequestBanner && <RequestInstructorTutorBanner headline={bannerHeadline} />}
                                <Button variant="outline" onPress={onTalkToTeam}>
                                    {t('introduction.talkWithTeam')}
                                </Button>
                                <Button variant="outline" onPress={onMoreInfos}>
                                    {t('introduction.moreInfos')}
                                </Button>
                            </Stack>
                        </Stack>

                        <Container w="700px" height="full" mt={-5} position="relative">
                            <Image
                                resizeMode="cover"
                                width="100%"
                                height="110%"
                                bgColor="gray.300"
                                alt={'group'}
                                source={{
                                    uri: cardImage,
                                }}
                            />
                            <View position="absolute" bottom={0} right={0} w="350px">
                                <Text italic textAlign="end" color="primary.900" pr={10}>
                                    {imageText}
                                </Text>
                            </View>
                        </Container>
                    </Stack>
                ) : (
                    <Stack space={space['0.5']} direction="column">
                        <Container minW="115%" height="150px" ml={-5} mt={-5} position="relative" bgColor="violet.500">
                            <Image height="100%" w="100%" bgColor="gray.300" alt={'group'} source={{ uri: mobileCardImage }} />

                            <View position="absolute" bottom={0} right={0} w="200px" pr={5} pb={3}>
                                <Text italic textAlign="end" fontSize="8px" color="primary.900">
                                    {imageText}
                                </Text>
                            </View>
                        </Container>
                        <Stack maxW="full" px="2" space={space['1']}>
                            <Icon />
                            <Heading>{headline}</Heading>
                            <Text ellipsizeMode="tail" numberOfLines={10}>
                                {t('introduction.courseTypes')}
                            </Text>
                            <Description />

                            <Stack space={space['0.5']}>
                                {showRequestButton && <Button onPress={onRequest}>{requestButtonText}</Button>}
                                {showRequestBanner && <RequestInstructorTutorBanner headline={bannerHeadline} />}
                                <Button variant="outline" onPress={onTalkToTeam}>
                                    {t('introduction.talkWithTeam')}
                                </Button>
                                <Button variant="outline" onPress={onMoreInfos}>
                                    {t('introduction.moreInfos')}
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                )}
            </Card>
        </View>
    );
};

export default OnboardingCard;
