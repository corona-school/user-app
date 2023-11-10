import AnimatedShine, { AnimatedShineProps } from './AnimatedShine';

type NewAchievementShineProps = {
    isMobile?: boolean;
};

const NewAchievementShine: React.FC<NewAchievementShineProps> = ({ isMobile }) => {
    const getShineProps = (index: number): AnimatedShineProps => {
        let animatedShineProps: AnimatedShineProps = {} as AnimatedShineProps;
        switch (index) {
            case 1:
                animatedShineProps.props = { initialSize: 47, positionLeft: 167, positionTop: 19, animationStart: 5 };
                break;
            case 2:
                animatedShineProps.props = { initialSize: 33, positionLeft: 50, positionTop: 65, animationStart: 8 };
                break;
            case 3:
                animatedShineProps.props = { initialSize: 15, positionLeft: 35, positionTop: 77, animationStart: 4 };
                break;
            case 4:
                animatedShineProps.props = { initialSize: 37, positionLeft: 58, positionTop: 113, animationStart: 3 };
                break;
            case 5:
                animatedShineProps.props = { initialSize: 15, positionLeft: 184, positionTop: 104, animationStart: 0 };
                break;
            case 6:
                animatedShineProps.props = { initialSize: 18, positionLeft: 177, positionTop: 43, animationStart: 10 };
                break;
            default:
                animatedShineProps.props = { initialSize: 47, positionLeft: 147, positionTop: 100, animationStart: 2 };
                break;
        }
        if (isMobile) {
            animatedShineProps.props = {
                ...animatedShineProps.props,
                initialSize: animatedShineProps.props.initialSize / 2,
                positionLeft: animatedShineProps.props.positionLeft / 2,
                positionTop: animatedShineProps.props.positionTop / 2,
            };
        }
        return animatedShineProps;
    };
    const shineElements = Array.from({ length: 7 }, (_, index) => <AnimatedShine key={index} props={getShineProps(index).props} isMobile={isMobile} />);

    return (
        <div
            style={{
                zIndex: 1,
                position: 'absolute',
                height: 'inherit',
                width: 'inherit',
                backgroundColor: 'transparent',
                transform: isMobile ? 'translateX(-48px)' : 'none',
            }}
        >
            {shineElements}
        </div>
    );
};

export default NewAchievementShine;
