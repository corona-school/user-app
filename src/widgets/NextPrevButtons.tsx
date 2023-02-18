import { Box, Button, Column, Row, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';

export const NextPrevButtons = ({
    isDisabledPrev,
    isDisabledNext,
    onPressPrev,
    onPressNext,
}: {
    isDisabledPrev?: boolean;
    isDisabledNext?: boolean;
    onPressPrev?: () => void;
    onPressNext?: () => void;
}) => {
    const { t } = useTranslation();
    const { space } = useTheme();

    return (
        <Box alignItems="center" marginTop={space['0.5']}>
            <Row w="100%" space={space['1']} justifyContent="center">
                <Button maxW="220px" flex={1} h="100%" isDisabled={isDisabledPrev} variant="outline" onPress={onPressPrev}>
                    {t('lernfair.buttons.prev')}
                </Button>
                <Button maxW="220px" flex={1} isDisabled={isDisabledNext} onPress={onPressNext}>
                    {t('lernfair.buttons.next')}
                </Button>
            </Row>
        </Box>
    );
};
