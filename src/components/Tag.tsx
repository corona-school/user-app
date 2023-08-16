import { View, Text, useTheme, Row, Box } from 'native-base';
import { ReactNode, useMemo } from 'react';

type Props = {
    text: string;
    borderRadius?: number;
    padding?: number | string;
    paddingX?: number | string;
    paddingY?: number | string;
    borderColor?: string;
    variant?: 'normal' | 'outline' | 'rating' | 'secondary' | 'secondary-light' | 'orange';
    beforeElement?: ReactNode | ReactNode[];
    afterElement?: ReactNode | ReactNode[];
    isReview?: boolean;
    marginBottom?: number;
};

const Tag: React.FC<Props> = ({
    text,
    borderRadius,
    padding,
    paddingX,
    paddingY,
    borderColor,
    variant = 'normal',
    beforeElement,
    afterElement,
    isReview,
    marginBottom,
}) => {
    const { colors, space } = useTheme();

    const pad = useMemo(() => [padding || paddingX || '1', padding || paddingY || '1'], [padding, paddingX, paddingY]);

    const bg = useMemo(() => {
        switch (variant) {
            case 'normal':
                return 'primary.700';
            case 'outline':
                return 'transparent';
            case 'rating':
                return colors.text['50'];
            case 'secondary':
            case 'secondary-light':
                return 'primary.500';
            case 'orange':
                return 'yellow.500';
            default:
                return colors.text['50'];
        }
    }, [colors.text, variant]);

    const color = useMemo(() => {
        switch (variant) {
            case 'secondary':
            case 'outline':
            case 'rating':
            case 'orange':
                return 'darkText';
            case 'normal':
            case 'secondary-light':
                return 'lightText';
            default:
                return 'darkText';
        }
    }, [variant]);

    return (
        <Box
            paddingX={pad[0]}
            paddingY={pad[1]}
            marginBottom={marginBottom !== undefined ? marginBottom : space['0.5']}
            bg={bg}
            borderRadius={borderRadius || 4}
            borderWidth={1}
            borderColor={borderColor || 'transparent'}
        >
            <Row space={space['0.5']}>
                {beforeElement && <View testID="beforeElement">{beforeElement}</View>}
                <Text fontSize={'xs'} color={color} bold={isReview ? true : false}>
                    {text}
                </Text>
                {afterElement && <View testID="afterElement">{afterElement}</View>}
            </Row>
        </Box>
    );
};
export default Tag;
