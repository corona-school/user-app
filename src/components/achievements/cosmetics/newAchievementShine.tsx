import { Box } from 'native-base';
import AnimatedShine from '../cosmetics/AnimatedShine';
import { ShineSize } from '../types';

type NewAchievementShineProps = {
    size: ShineSize;
};

const NewAchievementShine: React.FC<NewAchievementShineProps> = ({ size }) => {
    const shineElementProps = [
        { initialSize: 47, positionLeft: 167, positionTop: 19, animationStart: 5 },
        { initialSize: 33, positionLeft: 50, positionTop: 65, animationStart: 8 },
        { initialSize: 15, positionLeft: 35, positionTop: 77, animationStart: 4 },
        { initialSize: 37, positionLeft: 58, positionTop: 113, animationStart: 3 },
        { initialSize: 15, positionLeft: 184, positionTop: 104, animationStart: 0 },
        { initialSize: 18, positionLeft: 177, positionTop: 43, animationStart: 10 },
        { initialSize: 47, positionLeft: 147, positionTop: 100, animationStart: 2 },
    ];
    const shineElements = shineElementProps.map((props) => <AnimatedShine key={props.positionLeft} size={size} {...props} />);

    return (
        <Box zIndex={1} position="absolute" height="inherit" width="inherit" backgroundColor="transparent">
            {shineElements}
        </Box>
    );
};

export default NewAchievementShine;
