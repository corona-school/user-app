import { Button, Stack, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import useApollo from '../../hooks/useApollo';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';

type AvatarsProps = {
    onPress: () => void;
    onEditPress: () => void;
    canceled: boolean;
    declined: boolean;
    canEdit: boolean;
};
const Buttons: React.FC<AvatarsProps> = ({ onPress, onEditPress, canceled, declined, canEdit }) => {
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
                        <Button _text={{ color: 'white' }} onPress={onPress} bgColor="danger.100" width={buttonWidth} isDisabled={!canEdit}>
                            {t('appointment.detail.deleteButton')}
                        </Button>
                        <Button variant="outline" width={buttonWidth} onPress={onEditPress} isDisabled={!canEdit}>
                            {t('appointment.detail.editButton')}
                        </Button>
                    </>
                )}
                {user?.pupil && (
                    <Button _text={{ color: 'white' }} bgColor="danger.100" width={buttonWidth} onPress={onPress} isDisabled={canceled || declined}>
                        {t('appointment.detail.cancelButton')}
                    </Button>
                )}
            </Stack>
        </>
    );
};

export default Buttons;
