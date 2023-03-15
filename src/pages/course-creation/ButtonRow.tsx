import { Button, Row, useBreakpointValue, useTheme } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';

type ButtonProps = {
    onCancel?: () => any;
    onBack?: () => any;
    onNext: () => any;
    isDisabled?: boolean;
};
const ButtonRow: React.FC<ButtonProps> = ({ onCancel, onBack, onNext, isDisabled }) => {
    const ButtonContainerDirection = useBreakpointValue({
        base: 'column',
        lg: 'row',
    });

    const { space, sizes } = useTheme();
    const { t } = useTranslation();

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });
    return (
        <>
            <Row space={space['1']} alignItems="center" flexDirection={ButtonContainerDirection}>
                <Button width={ButtonContainer} isDisabled={isDisabled} marginBottom={space['1']} onPress={onNext}>
                    {t('next')}
                </Button>

                <Button marginBottom={space['1']} width={ButtonContainer} variant={'outline'} onPress={onBack ? onBack : onCancel}>
                    {onBack ? t('back') : t('cancel')}
                </Button>
            </Row>
        </>
    );
};

export default ButtonRow;
