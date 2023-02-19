import { Box, Button, Column, Row, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';

export const NextPrevButtons = ({
    isDisabledPrev,
    isDisabledNext,
    onPressPrev,
    onPressNext,
    onlyNext,
    altNextText,
    altPrevText,
}: {
    isDisabledPrev?: boolean;
    isDisabledNext?: boolean;
    onPressPrev?: () => void;
    onPressNext?: () => void;
    onlyNext?: boolean;
    altNextText?: string;
    altPrevText?: string;
}) => {
    const { t } = useTranslation();
    const { space } = useTheme();

    return (
        <>
            {/*<Box marginTop={space['1']} borderBottomWidth={1} borderBottomColor="primary.grey" />*/}
            <Box alignItems="center" marginTop={space['0.5']}>
                <Row w="100%" space={space['1']} justifyContent="center">
                    {!onlyNext && (
                        <Button maxW="220px" flex={1} h="100%" isDisabled={isDisabledPrev} variant="outline" onPress={onPressPrev}>
                            {altPrevText ?? t('lernfair.buttons.prev')}
                        </Button>
                    )}
                    <Button maxW="220px" flex={1} isDisabled={isDisabledNext} onPress={onPressNext}>
                        {altNextText ?? t('lernfair.buttons.next')}
                    </Button>
                </Row>
            </Box>
        </>
    );
};
