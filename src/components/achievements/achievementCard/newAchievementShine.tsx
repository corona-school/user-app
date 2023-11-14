import { Box, useBreakpointValue } from 'native-base';
import AnimatedShine, { AnimatedShineProps } from './AnimatedShine';

const NewAchievementShine: React.FC = () => {
    const shrinkElement = useBreakpointValue({ base: 2, md: 1 });
    const shineOffset = useBreakpointValue({ base: '-48px', md: 'none' });
    const getShineProps = (index: number): AnimatedShineProps => {
        let animatedShineProps: AnimatedShineProps = {} as AnimatedShineProps;
        switch (index) {
            case 1:
                animatedShineProps = { initialSize: 47, positionLeft: 167, positionTop: 19, animationStart: 5 };
                break;
            case 2:
                animatedShineProps = { initialSize: 33, positionLeft: 50, positionTop: 65, animationStart: 8 };
                break;
            case 3:
                animatedShineProps = { initialSize: 15, positionLeft: 35, positionTop: 77, animationStart: 4 };
                break;
            case 4:
                animatedShineProps = { initialSize: 37, positionLeft: 58, positionTop: 113, animationStart: 3 };
                break;
            case 5:
                animatedShineProps = { initialSize: 15, positionLeft: 184, positionTop: 104, animationStart: 0 };
                break;
            case 6:
                animatedShineProps = { initialSize: 18, positionLeft: 177, positionTop: 43, animationStart: 10 };
                break;
            default:
                animatedShineProps = { initialSize: 47, positionLeft: 147, positionTop: 100, animationStart: 2 };
                break;
        }
        if (shrinkElement) {
            animatedShineProps = {
                ...animatedShineProps,
                initialSize: animatedShineProps.initialSize / 2,
                positionLeft: animatedShineProps.positionLeft / 2,
                positionTop: animatedShineProps.positionTop / 2,
            };
        }
        return animatedShineProps;
    };
    const shineElements = Array.from({ length: 7 }, (_, index) => {
        const shineProps = getShineProps(index);
        return (
            <AnimatedShine
                key={index}
                initialSize={shineProps.initialSize}
                positionLeft={shineProps.positionLeft}
                positionTop={shineProps.positionTop}
                animationStart={shineProps.animationStart}
            />
        );
    });

    return (
        <Box zIndex={1} position="absolute" height="inherit" width="inherit" backgroundColor="transparent" left={shineOffset}>
            {shineElements}
        </Box>
    );
};

export default NewAchievementShine;
