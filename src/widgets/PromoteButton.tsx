import { Button, Tooltip, useBreakpointValue, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';

type Props = {
    isDisabled: boolean | undefined;
    loading: boolean;
    promote: () => void;
};

const PromoteButton: React.FC<Props> = ({ isDisabled, loading, promote }) => {
    const { sizes } = useTheme();
    const { t } = useTranslation();

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });
    return (
        <>
            <Tooltip label={t('single.buttonPromote.tooltip')} p={3} placement="bottom" hasArrow>
                <Button width={ButtonContainer} isDisabled={loading || isDisabled} onPress={promote}>
                    {t('single.buttonPromote.button')}
                </Button>
            </Tooltip>
        </>
    );
};

export default PromoteButton;
