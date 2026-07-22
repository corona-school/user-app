import { Button } from '@/components/Button';
import { Modal, ModalFooter, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import i18next from '@/I18n';
import { IconArrowRight, IconCheck, IconCircleCheckFilled } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMatchRequestForm } from './useMatchRequestForm';
import { useConfetti } from '@/hooks/useConfetti';

interface MatchRequestSentModalProps {
    isOpen: boolean;
    screeningAppointment?: Date;
}

export const StudentMatchRequestSentModal = ({ isOpen }: Omit<MatchRequestSentModalProps, 'screeningAppointment'>) => {
    const { form } = useMatchRequestForm();
    useConfetti(isOpen && !form.isEdit);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handleOnOpenChange = (open: boolean) => {
        if (open) return;

        navigate('/matching', { state: { tabID: 1 } });
    };

    return (
        <Modal onOpenChange={handleOnOpenChange} isOpen={isOpen} size="md">
            <div className="flex items-center">
                <IconCircleCheckFilled className="text-green-500 inline-block mr-2" size={28} />
                <div>
                    <ModalTitle>{t('matching.wizard.modalSuccess.student.heading')}</ModalTitle>
                </div>
            </div>
            <div>
                <Typography className="whitespace-break-spaces">{t('matching.wizard.modalSuccess.student.text')}</Typography>
            </div>
            <ModalFooter>
                <Button onClick={() => handleOnOpenChange(false)}>{t('done')}</Button>
            </ModalFooter>
        </Modal>
    );
};

export const MatchRequestSentModal = ({ screeningAppointment, isOpen }: MatchRequestSentModalProps) => {
    const { form } = useMatchRequestForm();
    useConfetti(isOpen && !form.isEdit);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const isNewWithAppointment = !form.isEdit && screeningAppointment;
    const isNewWithoutAppointment = !form.isEdit && !screeningAppointment;

    const handleOnOpenChange = (open: boolean) => {
        if (open) return;

        navigate('/matching', { state: { tabID: 1 } });
    };

    return (
        <Modal onOpenChange={handleOnOpenChange} isOpen={isOpen} size="md">
            {isNewWithAppointment && (
                <>
                    <ModalTitle className="sr-only">{t('matching.wizard.modalSuccess.pupil.requestWithAppointment.heading')}</ModalTitle>
                    <div>
                        <div className="bg-green-500 rounded-full w-[75px] h-[75px] flex justify-center items-center mx-auto mb-2">
                            <IconCheck size={30} className="stroke-white !stroke-[2px]" />
                        </div>
                        <Typography variant="h3" className="mb-5 text-center">
                            {t('matching.wizard.modalSuccess.pupil.requestWithAppointment.heading')}
                        </Typography>
                        <Typography variant="h5" className="text-center mb-5 whitespace-pre-line text-balance">
                            {screeningAppointment && DateTime.fromJSDate(screeningAppointment).toFormat('EEEE, dd. MMMM', { locale: i18next.language })} {'\n'}
                            {screeningAppointment && DateTime.fromJSDate(screeningAppointment).toFormat('t', { locale: i18next.language })} {t('clock')}
                        </Typography>
                        <Typography className="text-center max-w-[290px] mx-auto">
                            {t('matching.wizard.modalSuccess.pupil.requestWithAppointment.text')}
                        </Typography>
                    </div>
                    <ModalFooter className="lg:justify-center">
                        <Button className="w-full lg:w-fit" onClick={() => handleOnOpenChange(false)}>
                            {t('matching.wizard.modalSuccess.pupil.requestWithAppointment.button')}
                        </Button>
                    </ModalFooter>
                </>
            )}
            {isNewWithoutAppointment && (
                <>
                    <div className="flex items-center">
                        <IconCircleCheckFilled className="text-green-500 inline-block mr-2" size={28} />
                        <div>
                            <ModalTitle>{t('matching.wizard.modalSuccess.pupil.basicRequest.heading')}</ModalTitle>
                        </div>
                    </div>
                    <Typography>{t('matching.wizard.modalSuccess.pupil.basicRequest.text')}</Typography>
                    <ModalFooter mobileLayout="column">
                        <Button onClick={() => handleOnOpenChange(false)} leftIcon={<IconCheck size={20} />}>
                            {t('done')}
                        </Button>
                    </ModalFooter>
                </>
            )}
            {form.isEdit && (
                <>
                    <div className="flex items-center">
                        <IconCircleCheckFilled className="text-green-500 inline-block mr-2" size={28} />
                        <div>
                            <ModalTitle>{t('matching.wizard.modalSuccess.pupil.editRequest.heading')}</ModalTitle>
                        </div>
                    </div>
                    <Typography>{t('matching.wizard.modalSuccess.pupil.editRequest.text')}</Typography>
                    <ModalFooter>
                        <Button onClick={() => handleOnOpenChange(false)}>{t('done')}</Button>
                    </ModalFooter>
                </>
            )}
        </Modal>
    );
};
