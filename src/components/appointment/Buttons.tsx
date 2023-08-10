import { Button, Stack, Tooltip, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import useApollo from '../../hooks/useApollo';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';

type AvatarsProps = {
    onPress: () => void;
    onEditPress: () => void;
    canceled: boolean;
    declined: boolean;
    canEdit: boolean;
    isOver: boolean;
    isLast: boolean;
};
const Buttons: React.FC<AvatarsProps> = ({ onPress, onEditPress, canceled, declined, canEdit, isOver, isLast }) => {
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
                        <Tooltip label={t('appointment.detail.deleteTooltip')} isDisabled={!isLast}>
                            <Button
                                _text={{ color: 'white' }}
                                onPress={onPress}
                                bgColor="danger.100"
                                width={buttonWidth}
                                isDisabled={canEdit || isOver || isLast}
                            >
                                {t('appointment.detail.deleteButton')}
                            </Button>
                        </Tooltip>
                        <Button variant="outline" width={buttonWidth} onPress={onEditPress} isDisabled={canEdit || isOver}>
                            {t('appointment.detail.editButton')}
                        </Button>
                    </>
                )}
                {user?.pupil && (
                    <Button _text={{ color: 'white' }} bgColor="danger.100" width={buttonWidth} onPress={onPress} isDisabled={canceled || declined || isOver}>
                        {t('appointment.detail.cancelButton')}
                    </Button>
                )}
            </Stack>
        </>
    );
};

export default Buttons;
