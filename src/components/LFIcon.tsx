import { Box, Circle, useTheme } from 'native-base';

type Props = {
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    circleBG?: boolean;
    circleSize?: '1' | '2' | '3';
    iconSize?: number | string;
    iconFill?: string;
    circleFill?: string;
};

const LFIcon: React.FC<Props> = ({ Icon, circleBG, circleSize = '3', iconSize = 24, iconFill = '#fff', circleFill = '#000000' }) => {
    const { sizes } = useTheme();
    return (
        <Box position="relative" w={sizes[circleSize]} h={sizes[circleSize]} justifyContent="center" alignItems="center">
            {circleBG && <Circle h={sizes[circleSize]} w={sizes[circleSize]} position="absolute" zIndex={-1} bgColor={circleFill} />}
            <Icon width={iconSize} height={iconSize} fill={iconFill} />
        </Box>
    );
};
export default LFIcon;
