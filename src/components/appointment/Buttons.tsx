import { Button, Stack, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import useApollo from '../../hooks/useApollo';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';

type AvatarsProps = {
    onPress: () => void;
    canceled: boolean;
};
const Buttons: React.FC<AvatarsProps> = ({ onPress, canceled }) => {
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();
    const { user } = useApollo();

    const buttonWidth = useBreakpointValue({
        base: 'full',
        lg: '300',
    });

    return (
        <>
            <Stack direction={isMobile ? 'column' : 'row'} space={3}>
                {user?.student && (
                    <>
                        <Button _text={{ color: 'white' }} onPress={onPress} bgColor="amber.700" width={buttonWidth}>
                            {t('appointment.detail.deleteButton')}
                        </Button>
                        <Button variant="outline" width={buttonWidth}>
                            {t('appointment.detail.editButton')}
                        </Button>
                    </>
                )}
                {user?.pupil && (
                    <Button _text={{ color: 'white' }} bgColor="amber.700" width={buttonWidth} onPress={onPress} isDisabled={canceled}>
                        {t('appointment.detail.cancelButton')}
                    </Button>
                )}
            </Stack>
        </>
    );
};

export default Buttons;
