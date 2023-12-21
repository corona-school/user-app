import { Box, Row, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import DisablebleButton from '../components/DisablebleButton';

export const NextPrevButtons = ({
    isDisabledPrev,
    isDisabledNext,
    disablingPrev,
    disablingNext,
    onPressPrev,
    onPressNext,
    onlyNext,
    altNextText,
    altPrevText,
}: {
    isDisabledPrev?: boolean;
    isDisabledNext?: boolean;
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
                            isDisabled={disablingPrev?.is ?? isDisabledPrev ?? false}
                            reasonDisabled={disablingPrev?.reason ?? ''}
                            buttonProps={{
                                maxW: '220px',
                                flex: 1,
                                h: '100%',
                                variant: 'outline',
                                onPress: onPressPrev,
                            }}
                        >
                            {altPrevText ?? t('back')}
                        </DisablebleButton>
                    )}
                    <DisablebleButton
                        isDisabled={disablingNext?.is ?? isDisabledNext ?? false}
                        reasonDisabled={disablingNext?.reason ?? ''}
                        buttonProps={{
                            maxW: '220px',
                            flex: 1,
                            onPress: onPressNext,
                        }}
                    >
                        {altNextText ?? t('next')}
                    </DisablebleButton>
                </Row>
            </Box>
        </>
    );
};
