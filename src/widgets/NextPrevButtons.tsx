import { Box, Row, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import DisablebleButton from '../components/DisablebleButton';

export const NextPrevButtons = ({
    disablingPrev,
    disablingNext,
    onPressPrev,
    onPressNext,
    onlyNext,
    altNextText,
    altPrevText,
}: {
    disablingNext?: { is: boolean; reason: string };
    disablingPrev?: { is: boolean; reason: string };
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
                        <DisablebleButton
                            isDisabled={disablingPrev?.is ?? false}
                            reasonDisabled={disablingPrev?.reason ?? ''}
                            maxW="220px"
                            flex={1}
                            h="100%"
                            variant="outline"
                            onPress={onPressPrev}
                        >
                            {altPrevText ?? t('back')}
                        </DisablebleButton>
                    )}
                    <DisablebleButton
                        isDisabled={disablingNext?.is ?? false}
                        reasonDisabled={disablingNext?.reason ?? ''}
                        maxW="220px"
                        flex={1}
                        onPress={onPressNext}
                    >
                        {altNextText ?? t('next')}
                    </DisablebleButton>
                </Row>
            </Box>
        </>
    );
};
