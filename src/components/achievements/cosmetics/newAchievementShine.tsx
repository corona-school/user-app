import { Box } from 'native-base';
import AnimatedShine from './AnimatedShine';
import { ShineSize } from '../types';

type NewAchievementShineProps = {
    size: ShineSize;
};

const NewAchievementShine: React.FC<NewAchievementShineProps> = ({ size }) => {
    const shineElementProps = [
        { initialSize: 47, positionLeft: 84, positionTop: 8, animationStart: 5 },
        { initialSize: 33, positionLeft: 1, positionTop: 32, animationStart: 8 },
        { initialSize: 15, positionLeft: 18, positionTop: 39, animationStart: 4 },
        { initialSize: 37, positionLeft: 29, positionTop: 49, animationStart: 3 },
        { initialSize: 15, positionLeft: 95, positionTop: 46, animationStart: 0 },
        { initialSize: 18, positionLeft: 88, positionTop: 21, animationStart: 10 },
        { initialSize: 47, positionLeft: 73, positionTop: 45, animationStart: 2 },
    ];
    const shineElements = shineElementProps.map((props) => <AnimatedShine key={props.positionLeft} size={size} {...props} />);

    return (
        <Box zIndex={1} position="absolute" height="inherit" width="100%" backgroundColor="transparent">
            {shineElements}
        </Box>
    );
};

export default NewAchievementShine;
