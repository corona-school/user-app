import { Button, useBreakpointValue, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';

type Props = {
    onClick: () => void;
};

const PromoteButton: React.FC<Props> = ({ onClick }) => {
    const { sizes } = useTheme();
    const { t } = useTranslation();

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });
    return (
        <Button width={ButtonContainer} onPress={onClick}>
            {t('single.buttonPromote.button')}
        </Button>
    );
};

export default PromoteButton;
