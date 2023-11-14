import { Box, PresenceTransition, Stack } from 'native-base';
import ShimmerIcon from '../../../assets/icons/icon_shimmer.svg';
import { useState } from 'react';
import useInterval from '../../../hooks/useInterval';
import { ShineSize } from '../types';

type AnimatedShineProps = {
    initialSize: number;
    positionLeft: number;
    positionTop: number;
    animationStart: number;
    size: ShineSize;
};

const AnimatedShine: React.FC<AnimatedShineProps> = ({ initialSize, positionLeft, positionTop, animationStart, size }) => {
    const relativeSize = initialSize * size;
    const thresholdY = -(size * 50);
    const maxPositionY = size * 100;
    const intervalSpeed = size * 5;

    const [flicker, setFlicker] = useState(1);
    const [positionY, setPositionY] = useState(positionTop);
    const [opacity, setOpacity] = useState(1);

    const [scaleUp, setScaleUp] = useState(true);
    const [count, setCount] = useState(animationStart);

    useInterval(() => {
        if (scaleUp) {
            setFlicker((prevSize) => prevSize - 0.01 * size);
        } else {
            setFlicker((prevSize) => prevSize + 0.01 * size);
        }
        setCount((prevCount) => prevCount + 1);

        if (count >= 5) {
            setScaleUp((prevScaleUp) => !prevScaleUp);
            setCount(0);
        }
    }, intervalSpeed);

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
    }, intervalSpeed / 2);

    return (
        <Stack
            position="absolute"
            width={relativeSize * 1.05}
            height={relativeSize * 1.05}
            top={`${positionTop}%`}
            left={`calc(${positionLeft}% - ${relativeSize * 0.5}px)`}
            justifyContent="center"
            alignItems="center"
        >
            <Box opacity={opacity} width={relativeSize * flicker} height={relativeSize * flicker}>
                <PresenceTransition
                    visible
                    initial={{
                        translateY: positionTop,
                    }}
                    animate={{
                        translateY: positionY,
                        transition: {
                            duration: intervalSpeed,
                        },
                    }}
                >
                    <ShimmerIcon />
                </PresenceTransition>
            </Box>
        </Stack>
    );
};

export default AnimatedShine;

export type { AnimatedShineProps };
