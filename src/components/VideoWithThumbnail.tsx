import { Box, useBreakpointValue } from 'native-base';
import { useEffect, useState } from 'react';

type VideoWithThumbnailProps = {
    video: string;
    thumbnail: string;
    space: number;
};

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
};
function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const VideoWithThumbnail: React.FC<VideoWithThumbnailProps> = ({ video, thumbnail, space }) => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        const debouncedHandleResize = debounce(handleResize, 250);
        window.addEventListener('resize', debouncedHandleResize);
        return () => window.removeEventListener('resize', debouncedHandleResize);
    }, []);

    const windowWidth: number = useBreakpointValue({
        base: windowDimensions.width - 32,
        lg: windowDimensions.width - 240 - 108 - space,
    });
    const resolution = useBreakpointValue({
        base: { w: windowWidth, h: `calc(${windowWidth} * 0.5625px)` },
        lg: { w: windowWidth / 2, h: `calc((${windowWidth} / 2) * 0.5625px)` },
    });
    return (
        <Box width={resolution.w} maxWidth="600px" height={resolution.h} maxHeight="337.5px">
            <video controls muted controlsList="nodownload" poster={thumbnail}>
                <source src={video} type="video/mp4" />
            </video>
        </Box>
    );
};

export default VideoWithThumbnail;
