import { PresenceTransition, Stack, VStack } from 'native-base';
import ShimmerIcon from '../../../assets/icons/icon_shimmer.svg';
import { useState } from 'react';
import { ShineSize } from '../../../types/achievement';
import useInterval from '../../../hooks/useInterval';

type AnimatedShineProps = {
    initialSize: number;
    positionLeft: number;
    positionTop: number;
    animationSpeed: number;
    size: ShineSize;
};

const AnimatedShine: React.FC<AnimatedShineProps> = ({ initialSize, positionLeft, positionTop, animationSpeed, size }) => {
    const relativeSize = initialSize * size;
    const thresholdY = -(size * 10);
    const maxPositionY = size === ShineSize.XSMALL ? 80 - thresholdY : 200 - thresholdY;

    const [firstRender, setFirstRender] = useState(true);
    const [positionY, setPositionY] = useState(positionTop);
    const [startAnimation, setStartAnimation] = useState(true);
    const intervalSpeed = (2000 / maxPositionY) * positionY * animationSpeed;

    useInterval(() => {
        if (firstRender) {
            setPositionY(maxPositionY);
            setFirstRender(false);
        }
        setStartAnimation(!startAnimation);
    }, intervalSpeed);
    return (
        <Stack position="absolute" left={`calc(${positionLeft}% - ${relativeSize * 0.5}px)`} justifyContent="center" alignItems="center" top={thresholdY}>
            <PresenceTransition
                style={{
                    position: 'absolute',
                    opacity: startAnimation ? 1 : 0,
                }}
                visible={startAnimation}
                initial={{
                    translateY: positionY,
                }}
                animate={{
                    translateY: thresholdY,
                    transition: {
                        easing: (value: number) => value * 1,
                        duration: intervalSpeed,
                    },
                }}
            >
                <VStack width={relativeSize * 1.05} height={relativeSize * 1.05}>
                    <ShimmerIcon />
                </VStack>
            </PresenceTransition>
            <PresenceTransition
                style={{
                    position: 'absolute',
                    opacity: startAnimation ? 0 : 1,
                }}
                visible={!startAnimation}
                initial={{
                    translateY: positionY,
                }}
                animate={{
                    translateY: thresholdY,
                    transition: {
                        easing: (value: number) => value * 1,
                        duration: intervalSpeed,
                    },
                }}
            >
                <VStack width={relativeSize * 1.05} height={relativeSize * 1.05}>
                    <ShimmerIcon />
                </VStack>
            </PresenceTransition>
        </Stack>
    );
};

export default AnimatedShine;

export type { AnimatedShineProps };
