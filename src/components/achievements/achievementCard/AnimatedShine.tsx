import { Box, PresenceTransition, useBreakpointValue } from 'native-base';
import ShimmerIcon from '../../../assets/icons/icon_shimmer.svg';
import { useState } from 'react';
import useInterval from '../../../hooks/useInterval';

type AnimatedShineProps = {
    initialSize: number;
    positionLeft: number;
    positionTop: number;
    animationStart: number;
};

const AnimatedShine: React.FC<AnimatedShineProps> = ({ initialSize, positionLeft, positionTop, animationStart }) => {
    const thresholdY = useBreakpointValue({ base: -35, md: -75 });
    const maxPositionY = useBreakpointValue({ base: 30, md: 100 });
    const intervalSpeed = useBreakpointValue({ base: 25, md: 10 });

    const [size, setSize] = useState(initialSize);
    const [positionY, setPositionY] = useState(positionTop);
    const [opacity, setOpacity] = useState(1);

    const [scaleUp, setScaleUp] = useState(true);
    const [count, setCount] = useState(animationStart);

    useInterval(() => {
        if (scaleUp) {
            setSize((prevSize) => prevSize - 1);
        } else {
            setSize((prevSize) => prevSize + 1);
        }
        setCount((prevCount) => prevCount + 1);

        if (count >= 5) {
            setScaleUp((prevScaleUp) => !prevScaleUp);
            setCount(0);
        }
    }, intervalSpeed * 5);

    useInterval(() => {
        if (positionY > thresholdY) {
            setPositionY((prevPositionY) => prevPositionY - 1);
        } else {
            setPositionY(maxPositionY);
            setOpacity(1);
        }

        if (positionY < thresholdY / 3) {
            setOpacity((prevOpacity) => prevOpacity - 0.02);
        }
    }, intervalSpeed);

    return (
        <Box position="absolute" top={`${positionTop}px`} left={`${positionLeft}px`}>
            <PresenceTransition
                visible
                initial={{
                    scale: size / 50,
                    translateY: positionTop,
                    opacity: 1,
                }}
                animate={{
                    scale: size / 50,
                    translateY: positionY,
                    opacity: opacity,
                    transition: {
                        duration: 50,
                    },
                }}
            >
                <ShimmerIcon />
            </PresenceTransition>
        </Box>
    );
};

export default AnimatedShine;

export type { AnimatedShineProps };
