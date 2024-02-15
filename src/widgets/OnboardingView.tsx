import { Text, Box, useTheme, View, Heading, Image, Row, Pressable, useBreakpointValue, Center } from 'native-base';
import { useContext } from 'react';
import Bullet from '../components/Bullet';
import { ViewPagerContext } from '../components/ViewPager';

type Props = {
    title: string;
    content?: string;
    contentEnd?: string;
    image?: string;
    isBigger?: boolean;
    video?: string;
    videoMobile?: string;
};

const OnboardingView: React.FC<Props> = ({ title, content, contentEnd, image, isBigger = false, video }) => {
    const { space, sizes } = useTheme();
    const { currentIndex, setCurrentIndex, itemCount } = useContext(ViewPagerContext);

    const contentWidth = useBreakpointValue({
        base: '300px',
        lg: '570px',
    });

    /* const videoSize = useBreakpointValue({
        base:
    }); */

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
                    backgroundColor="primary.700"
                >
                    <Row flexDirection="column">
                        {title && (
                            <Heading fontSize="xl" color="lightText" textAlign="center" paddingY={space['1']} maxWidth={contentWidth}>
                                {title}
                            </Heading>
                        )}
                        {content && (
                            <Text color="lightText" textAlign="center" maxWidth={contentWidth} paddingBottom={space['1']}>
                                {content}
                            </Text>
                        )}

                        {contentEnd && (
                            <Text color="lightText" textAlign="center" maxWidth={contentWidth} paddingBottom={space['1']}>
                                {contentEnd}
                            </Text>
                        )}
                    </Row>
                </View>
            </Box>
            {video ? (
                <Box
                    /* TBD: Adjust Box dynamically to size of videoplayer */
                    borderRadius="md"
                    bg="primary.400"
                    p={space['1']}
                    mx={space['1']}
                >
                    <Center>
                        <iframe
                            width="100%" /* "576px" */
                            height="100%" /* "324px" */
                            src={`https://www.youtube.com/embed/${video}`} /* TBD: Datenschutzbanner für YouTube ODER Videos selbst hosten */
                            /* allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" */
                            allowFullScreen
                            title="Embedded YouTube Video"
                            style={{
                                border: 'none',
                            }}
                        />
                    </Center>
                </Box>
            ) : (
                image && (
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
                        <Row space={space['0.5']} marginTop={space['1']} marginBottom="6%" justifyContent="center" alignItems="center">
                            {new Array(itemCount).fill(0).map((_, i) => (
                                <Pressable onPress={() => setCurrentIndex(i)}>
                                    <Bullet isActive={i === currentIndex ? true : false} />
                                </Pressable>
                            ))}
                        </Row>
                    </Box>
                )
            )}
        </View>
    );
};
export default OnboardingView;
