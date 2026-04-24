import { Button } from '@/components/Button';
import { Modal, ModalFooter, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import i18next from '@/I18n';
import { IconCheck } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMatchRequestForm } from './useMatchRequestForm';

interface MatchRequestSentModalProps {
    isOpen: boolean;
    screeningAppointment?: Date;
}

export const MatchRequestSentModal = ({ screeningAppointment, isOpen }: MatchRequestSentModalProps) => {
    const { form } = useMatchRequestForm();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const isNewWithAppointment = !form.isEdit && screeningAppointment;
    const isNewWithoutAppointment = !form.isEdit && !screeningAppointment;

    const handleOnOpenChange = (open: boolean) => {
        if (open) return;

        navigate('/matching', { state: { tabID: 1 } });
    };

    return (
        <Modal onOpenChange={handleOnOpenChange} isOpen={isOpen}>
            {isNewWithAppointment && (
                <>
                    <ModalTitle className="sr-only">Match Anfrage erstellt</ModalTitle>
                    <div>
                        <div className="bg-green-500 rounded-full w-[75px] h-[75px] flex justify-center items-center mx-auto mb-2">
                            <IconCheck size={30} className="stroke-white !stroke-[2px]" />
                        </div>
                        <Typography variant="h3" className="mb-5 text-center">
                            {t('registration.steps.appointmentDetails.title')}
                        </Typography>
                        <Typography variant="h5" className="text-center mb-5 whitespace-pre-line text-balance">
                            {screeningAppointment && DateTime.fromJSDate(screeningAppointment).toFormat('EEEE, dd. MMMM', { locale: i18next.language })} {'\n'}
                            {screeningAppointment && DateTime.fromJSDate(screeningAppointment).toFormat('t', { locale: i18next.language })} {t('clock')}
                        </Typography>
                        <Typography className="text-center max-w-[290px] mx-auto mb-8">
                            Nach dem Gespräch geht die Suche nach einem Lernpartner für dich sofort los!
                        </Typography>
                    </div>
                    <ModalFooter className="lg:justify-center">
                        <Button className="w-full lg:w-fit" onClick={() => handleOnOpenChange(false)}>
                            {t('done')}
                        </Button>
                    </ModalFooter>
                </>
            )}
            {isNewWithoutAppointment && (
                <>
                    <ModalTitle>
                        <div className="bg-green-500 rounded-full w-[24px] h-[24px] inline-flex justify-center items-center mx-auto mr-2">
                            <IconCheck size={12} className="stroke-white !stroke-[2px]" />
                        </div>
                        Lernpartner angefragt!
                    </ModalTitle>
                    <Typography>
                        Das kann – je nach Fächerauswahl – schnell gehen oder länger dauern. Schaue regelmäßig nach, ob du eine Nachricht von uns erhalten hast
                        und nutze gerne unsere anderen Angebote (Hausaufgabenhilfe und Gruppenkurse).
                    </Typography>
                    <ModalFooter className="lg:justify-end">
                        <Button className="w-full lg:w-fit" variant="outline" onClick={() => navigate('/hausaufgabenhilfe')}>
                            Hausaufgabenhilfe
                        </Button>
                        <Button className="w-full lg:w-fit" variant="outline" onClick={() => navigate('/group')}>
                            Gruppen-Kurse
                        </Button>
                        <Button className="w-full lg:w-fit" onClick={() => handleOnOpenChange(false)}>
                            {t('done')}
                        </Button>
                    </ModalFooter>
                </>
            )}
            {form.isEdit && (
                <>
                    <ModalTitle>
                        <div className="bg-green-500 rounded-full w-[24px] h-[24px] inline-flex justify-center items-center mx-auto mr-2">
                            <IconCheck size={12} className="stroke-white !stroke-[2px]" />
                        </div>
                        Anfrage geändert
                    </ModalTitle>
                    <Typography>Wir haben deinen Änderungswunsch erhalten und suchen nun nach einem geeigneten Lernpartner für dich.</Typography>
                    <ModalFooter className="lg:justify-end">
                        <Button className="w-full lg:w-fit" onClick={() => handleOnOpenChange(false)}>
                            {t('done')}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </Modal>
    );
};
