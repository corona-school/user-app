import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import isEmail from 'validator/es/lib/isEmail';

interface ChangeEmailModalProps extends BaseModalProps {
    currentEmail: string;
}

const CHANGE_EMAIL_MUTATION = gql(`
        mutation ChangeEmail($email: String!) {
            meChangeEmail(email: $email)
        }
`);

const IS_EMAIL_AVAILABLE_MUTATION = gql(`
    mutation isEmailAvailable($email: String!) {
        isEmailAvailable(email: $email)
    }
`);

const ChangeEmailModal = ({ isOpen, onOpenChange, currentEmail }: ChangeEmailModalProps) => {
    const { t } = useTranslation();
    const [newEmail, setNewEmail] = useState('');
    const [changeEmail, { loading: isUpdating }] = useMutation(CHANGE_EMAIL_MUTATION);
    const [isEmailAvailable] = useMutation(IS_EMAIL_AVAILABLE_MUTATION);
    const [error, setError] = useState('');

    const handleOnChangeEmail = async () => {
        if (!isEmail(newEmail)) {
            setError(t('registration.hint.email.invalid'));
            return;
        }
        const res = await isEmailAvailable({ variables: { email: newEmail } });

        if (!res.data?.isEmailAvailable) {
            setError(t('registration.hint.email.unavailable'));
            return;
        }
        await changeEmail({ variables: { email: newEmail } });
        toast.success(t('login.changeEmailConfirmation'), { duration: 8000 });
        setNewEmail('');
        setError('');
        onOpenChange(false);
    };

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{t('login.changeEmail')}</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4 py-4">
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="email">{t('login.currentEmail')}</Label>
                    <Input className="w-full" value={currentEmail} readOnly />
                </div>
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="email">{t('login.newEmail')}</Label>
                    <Input className="w-full" value={newEmail} autoFocus onChange={(e) => setNewEmail(e.target.value)} />
                    {error && (
                        <Typography variant="sm" className="text-red-500">
                            {error}
                        </Typography>
                    )}
                </div>
            </div>

            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" isLoading={isUpdating} onClick={handleOnChangeEmail}>
                    {t('login.changeEmail')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ChangeEmailModal;
