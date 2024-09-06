import { Stack, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import useApollo from '../../hooks/useApollo';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import DisableableButton from '../DisablebleButton';

type AvatarsProps = {
    onPress: () => void;
    onEditPress: () => void;
    canceled: boolean;
    isOver: boolean;
    isLast: boolean;
};
const Buttons: React.FC<AvatarsProps> = ({ onPress, onEditPress, canceled, isOver, isLast }) => {
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
                        <DisableableButton
                            isDisabled={isOver || isLast}
                            reasonDisabled={
                                isOver ? t('appointment.detail.reasonDisabled.deleteBtn.isOver') : t('appointment.detail.reasonDisabled.deleteBtn.isLast')
                            }
                            _text={{ color: 'white' }}
                            onPress={onPress}
                            bgColor="danger.100"
                            width={buttonWidth}
                        >
                            {t('appointment.detail.deleteButton')}
                        </DisableableButton>
                        <DisableableButton
                            isDisabled={isOver}
                            reasonDisabled={t('appointment.detail.reasonDisabled.editBtn.isOver')}
                            variant={'outline'}
                            width={buttonWidth}
                            onPress={onEditPress}
                        >
                            {t('appointment.detail.editButton')}
                        </DisableableButton>
                    </>
                )}
                {user?.pupil && (
                    <DisableableButton
                        isDisabled={canceled || isOver}
                        reasonDisabled={
                            isOver ? t('appointment.detail.reasonDisabled.cancelBtn.isOver') : t('appointment.detail.reasonDisabled.cancelBtn.isCancelled')
                        }
                        _text={{ color: 'white' }}
                        onPress={onPress}
                        bgColor="danger.100"
                        width={buttonWidth}
                    >
                        {t('appointment.detail.cancelButton')}
                    </DisableableButton>
                )}
            </Stack>
        </>
    );
};

export default Buttons;
