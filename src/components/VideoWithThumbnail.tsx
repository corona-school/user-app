import { Box, VStack, Image, useBreakpointValue } from 'native-base';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import PlayButton from '../assets/icons/play-button.svg';

type VideoWithThumbnailProps = {
    video: string;
    thumbnail: string;
    space: number;
};

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
};

const VideoWithThumbnail: React.FC<VideoWithThumbnailProps> = ({ video, thumbnail, space }) => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [open, setOpen] = useState(false);
    const windowWidth = useBreakpointValue({
        base: windowDimensions.width - 32,
        lg: windowDimensions.width - 240 - 108 - space,
    });
    const resolution = useBreakpointValue({
        base: { w: windowWidth, h: windowWidth * 0.5625 },
        lg: { w: windowWidth / 2, h: (windowWidth / 2) * 0.5625 },
    });
    return (
        <Box width={resolution.w} maxWidth="600px" height={resolution.h} maxHeight="337.5px">
            <video hidden={open ? false : true} controls muted controlsList="nodownload">
                <source src={video} type="video/mp4" />
            </video>
            <Box display={open ? 'none' : 'block'}>
                <Pressable onPress={() => setOpen(true)}>
                    <VStack
                        position="relative"
                        width={resolution.w}
                        height={resolution.h}
                        maxWidth="600px"
                        maxHeight="337.5px"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Image
                            source={{ uri: thumbnail }}
                            alt="certificate of conduct video"
                            resizeMode="cover"
                            width={resolution.w}
                            height={resolution.h}
                            maxWidth="600px"
                            maxHeight="337.5px"
                        />
                        <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            marginTop={`calc(${resolution.h} / -6)`}
                            marginLeft={`calc(${resolution.h} / -6)`}
                            width={`calc(${resolution.h} / 3)`}
                            height={`calc(${resolution.h} / 3)`}
                            maxWidth="600px"
                            maxHeight="337.5px"
                        >
                            <PlayButton />
                        </Box>
                    </VStack>
                </Pressable>
            </Box>
        </Box>
    );
};

export default VideoWithThumbnail;
