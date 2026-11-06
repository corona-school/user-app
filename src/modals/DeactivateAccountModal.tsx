import { gql } from './../gql';
import { useMutation } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUserType } from '../hooks/useApollo';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Label } from '@/components/Label';
import { TextArea } from '@/components/TextArea';
import { toast } from 'sonner';
import { DeactivationReason } from '@/gql/graphql';

const commonReasons = [
    DeactivationReason.NoMoreTime,
    DeactivationReason.NoMoreInterest,
    DeactivationReason.OnlyTestAccount,
    DeactivationReason.ExpectationsDiffered,
    DeactivationReason.DidntMeetRequirements,
];
// corresponding dissolve reason ids in translation file
// for now just loop through 0-5 and 0-6 (+1 in loop)
const pupilReasons = [...commonReasons, DeactivationReason.OtherSupportFound, DeactivationReason.Other];
const studentReasons = [...commonReasons, DeactivationReason.OtherVolunteerWorkFound, DeactivationReason.CouldntAttendMeeting, DeactivationReason.Other];

interface DeactivateAccountModalProps extends BaseModalProps {
    onDeactivated?: () => void;
}

const DeactivateAccountModal = ({ isOpen, onOpenChange, onDeactivated }: DeactivateAccountModalProps) => {
    const [reason, setReason] = useState<DeactivationReason | undefined>(undefined);
    const [other, setOther] = useState('');
    const navigate = useNavigate();
    const { trackEvent } = useMatomo();
    const { t } = useTranslation();
    const userType = useUserType();

    const [deactivateAccount, { loading: loadingDeactivate }] = useMutation(
        gql(`
        mutation deactiveAccount($reason: DeactivationReason, $otherReason: String) {
            meDeactivate(reason: $reason, otherReason: $otherReason)
        }
    `)
    );

    const desc = useMemo(
        () => (userType === 'student' ? t('profile.Deactivate.modal.description.student') : t('profile.Deactivate.modal.description.pupil')),
        [t, userType]
    );

    const reasons = useMemo(() => (userType === 'student' ? studentReasons : pupilReasons), [userType]);

    const isOther = useMemo(() => reason === DeactivationReason.Other, [reason]);

    useEffect(() => {
        !isOther && setOther('');
    }, [isOther, reason, reasons.length]);

    const deactivate = async () => {
        if (reason === undefined) return;
        try {
            const res = await deactivateAccount({
                variables: {
                    reason: !isOther ? reason : DeactivationReason.Other,
                    otherReason: other.length > 0 ? other : undefined,
                },
            });

            onOpenChange(false);
            if (res.data?.meDeactivate) {
                trackEvent({
                    category: 'profil',
                    action: 'click-event',
                    name: 'Account deaktivieren',
                    documentTitle: 'Deactivate',
                });
                navigate('/logout', { state: { deactivated: true } });
                onDeactivated && onDeactivated();
                toast.success(t('profile.Deactivate.success'));
            } else {
                toast.error(t('profile.Deactivate.error'));
            }
        } catch (e) {
            toast.error(t('profile.Deactivate.error'));
        }
    };

    const isValidInput = useMemo(() => {
        if (!reason) return false;

        if (reason === `${reasons.length}`) {
            return other.length > 0;
        } else {
            return true;
        }
    }, [other.length, reason, reasons.length]);

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <div>
                <ModalHeader>
                    <ModalTitle>{t('profile.Deactivate.modal.title')}</ModalTitle>
                </ModalHeader>
                <div className="flex flex-col gap-y-1 pt-4">
                    <Typography className="mb-6 text-pretty">{desc}</Typography>
                    <RadioGroup name="reasons" value={reason} onValueChange={(x) => setReason(x as DeactivationReason)} className="flex flex-col gap-y-4">
                        {reasons.map((r) => (
                            <div className="flex gap-x-2 items-center" key={`content-${r}`}>
                                <RadioGroupItem id={`item-${r}`} value={r} />
                                <Label htmlFor={`item-${r}`} className="cursor-pointer">
                                    {t(`profile.Deactivate.reasons.${r}` as unknown as TemplateStringsArray)}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                    {isOther && (
                        <TextArea className="mt-4" value={other} onChangeText={setOther} placeholder={t('profile.Deactivate.modal.other.placeholder')} />
                    )}
                </div>
                <ModalFooter className="mt-4">
                    <Button variant="destructive" disabled={!isValidInput} className="w-full lg:w-fit" isLoading={loadingDeactivate} onClick={deactivate}>
                        {t('profile.Deactivate.modal.btn')}
                    </Button>
                </ModalFooter>
            </div>
        </Modal>
    );
};
export default DeactivateAccountModal;
