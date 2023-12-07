import { Box } from 'native-base';
import AnimatedShine from './AnimatedShine';
import { ShineSize } from '../../../types/achievement';

type NewAchievementShineProps = {
    size: ShineSize;
    isLarge?: boolean;
};

const NewAchievementShine: React.FC<NewAchievementShineProps> = ({ size, isLarge }) => {
    const shineElementProps = [
        { initialSize: 47, positionLeft: 84, positionTop: size === ShineSize.XSMALL ? 4 : size === ShineSize.MEDIUM ? 9 : 12, animationSpeed: 1.05 },
        { initialSize: 33, positionLeft: 1, positionTop: size === ShineSize.XSMALL ? 64 : size === ShineSize.MEDIUM ? 79 : 135, animationSpeed: 0.87 },
        { initialSize: 15, positionLeft: 18, positionTop: size === ShineSize.XSMALL ? 51 : size === ShineSize.MEDIUM ? 70 : 109, animationSpeed: 1 },
        { initialSize: 37, positionLeft: 29, positionTop: size === ShineSize.XSMALL ? 96 : size === ShineSize.MEDIUM ? 135 : 187, animationSpeed: 1.3 },
        { initialSize: 15, positionLeft: 95, positionTop: size === ShineSize.XSMALL ? 27 : size === ShineSize.MEDIUM ? 54 : 52, animationSpeed: 0.98 },
        { initialSize: 18, positionLeft: 88, positionTop: size === ShineSize.XSMALL ? 41 : size === ShineSize.MEDIUM ? 108 : 87, animationSpeed: 0.9 },
        { initialSize: 47, positionLeft: 73, positionTop: size === ShineSize.XSMALL ? 83 : size === ShineSize.MEDIUM ? 115 : 165, animationSpeed: 1.12 },
    ];
    const shineElements = shineElementProps.map((props) => <AnimatedShine key={props.positionLeft} size={size} {...props} isLarge={isLarge} />);

    return (
        <Box
            zIndex={5}
            position="absolute"
            height={size === ShineSize.XSMALL ? 80 - size * 10 : isLarge ? 290 : 200 - size * 10}
            width="100%"
            backgroundColor="transparent"
        >
            {shineElements}
        </Box>
    );
};

export default NewAchievementShine;
