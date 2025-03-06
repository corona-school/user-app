import { useState } from 'react';
import { useUserType } from '../hooks/useApollo';
import { Trans, useTranslation } from 'react-i18next';
import { Dissolve_Reason } from '../gql/graphql';
import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';

type DissolveModalProps = {
    showDissolveModal: boolean | undefined;
    alsoShowWarningModal?: boolean | undefined;
    onPressDissolve: (dissolveReasons: Dissolve_Reason[], otherFreeText: string | undefined) => any;
    onPressBack: () => any;
};

const SupportEmail = () => (
    <a className="inline underline text-primary" href="mailto:support@lern-fair.de">
        support@lern-fair.de
    </a>
);

const DissolveMatchModal: React.FC<DissolveModalProps> = ({ showDissolveModal, alsoShowWarningModal, onPressDissolve, onPressBack }) => {
    const [showedWarning, setShowedWarning] = useState<boolean>(false);
    const { t } = useTranslation();
    const userType = useUserType();
    const [reasons, setReasons] = useState<Dissolve_Reason[]>([]);
    const [otherFreeText, setOtherFreeText] = useState<string>('');
    const availableReasons = [
        Dissolve_Reason.Ghosted,
        Dissolve_Reason.NoMoreHelpNeeded,
        Dissolve_Reason.IsOfNoHelp,
        Dissolve_Reason.NoMoreTime,
        Dissolve_Reason.PersonalIssues,
        Dissolve_Reason.ScheduleIssues,
        Dissolve_Reason.TechnicalIssues,
        Dissolve_Reason.LanguageIssues,
        Dissolve_Reason.Other,
    ];

    return (
        <Modal
            isOpen={!!showDissolveModal}
            onOpenChange={(isOpen) => isOpen && onPressBack()}
            className={cn('w-full lg:w-[820px] max-w-[550px] rounded-none lg:rounded-md', 'bg-white')}
            classes={{
                closeIcon: 'text-primary',
            }}
        >
            <div className="flex flex-col w-full justify-between md:justify-center lg:justify-between">
                {alsoShowWarningModal && !showedWarning ? (
                    <>
                        <ModalHeader>
                            <ModalTitle>{t('matching.dissolve.warningModal.title')}</ModalTitle>
                        </ModalHeader>
                        <Typography className="py-4">
                            <Trans
                                i18nKey={
                                    userType === 'pupil'
                                        ? 'matching.dissolve.warningModal.pupilDescription'
                                        : 'matching.dissolve.warningModal.studentDescription'
                                }
                                components={[<SupportEmail />]}
                                values={{ email: 'support@lern-fair.de' }}
                            ></Trans>
                        </Typography>
                        <ModalFooter variant="default">
                            <Button onClick={onPressBack} variant="ghost">
                                {t('back')}
                            </Button>
                            <Button onClick={() => setShowedWarning(true)}>{t('matching.dissolve.warningModal.btn')}</Button>
                        </ModalFooter>
                    </>
                ) : (
                    <>
                        <ModalHeader>
                            <ModalTitle>{t('matching.dissolve.modal.title')}</ModalTitle>
                        </ModalHeader>
                        <div className="py-4 px-4">
                            <RadioGroup
                                name="dissolve-reason"
                                value={reasons[0]}
                                onValueChange={(key) => {
                                    setReasons([key as unknown as Dissolve_Reason]);
                                }}
                                className="flex flex-col gap-y-4"
                            >
                                {availableReasons.map((key) => (
                                    <div className="flex gap-x-2 items-center" key={key}>
                                        <RadioGroupItem id={key} value={key} />
                                        <Label htmlFor={key} className="cursor-pointer">
                                            {t(`matching.dissolveReasons.${userType}.${key}` as unknown as TemplateStringsArray)}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            {reasons.includes(Dissolve_Reason.Other) && (
                                <Input
                                    placeholder={t('matching.dissolve.modal.otherFreeText')}
                                    value={otherFreeText}
                                    onChange={(e) => setOtherFreeText(e.target.value)}
                                    className="w-full my-2"
                                    autoFocus={true}
                                />
                            )}
                        </div>
                        <ModalFooter variant="default">
                            <Button onClick={onPressBack} variant="ghost">
                                {t('back')}
                            </Button>
                            <Button
                                disabled={reasons.length === 0 || (reasons.includes(Dissolve_Reason.Other) && !otherFreeText)}
                                reasonDisabled={t('matching.dissolve.modal.tooltip')}
                                onClick={() => onPressDissolve(reasons, reasons.includes(Dissolve_Reason.Other) ? otherFreeText : undefined)}
                            >
                                {t('matching.dissolve.modal.btn')}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default DissolveMatchModal;
