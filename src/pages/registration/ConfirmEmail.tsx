import { Trans, useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import ChangeEmailModal from '@/modals/ChangeEmailModal';
import { useState } from 'react';

interface ConfirmEmailProps extends RegistrationStepProps {
    retainPath: string;
}

const SEND_VERIFICATION_MUTATION = gql(`
    mutation RequestVerifyEmail($email: String!, $redirectTo: String!) {
        tokenRequest(email: $email, action: "user-verify-email", redirectTo: $redirectTo)
    }
`);

export const ConfirmEmail = ({ onNext, retainPath }: ConfirmEmailProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    const [sendVerification, { loading: isSendingVerification }] = useMutation(SEND_VERIFICATION_MUTATION);
    const [isOpen, setIsOpen] = useState(false);

    const requestEmailVerification = async () => {
        const res = await sendVerification({
            variables: {
                email: form.email!,
                redirectTo: retainPath ?? '/start',
            },
        });

        if (res.data?.tokenRequest) {
            toast.success(t('registration.verifyemail.resend.successAlert'));
        } else {
            toast.error(t('registration.verifyemail.resend.failedAlert'));
        }
    };

    const onEmailChanged = (email: string) => {
        onFormChange({ email });
    };

    return (
        <RegistrationStep onNext={onNext} isNextDisabled>
            <div className="flex flex-col gap-y-10 justify-center items-center">
                <RegistrationStepTitle className="md:mb-0 mb-0">{t('registration.steps.confirmEmail.title')}</RegistrationStepTitle>
                <Typography variant="body-lg" className="text-center md:whitespace-pre-line text-balance">
                    <Trans t={t} i18nKey="registration.steps.confirmEmail.description" values={{ email: form.email }} components={{ b: <b />, br: <br /> }} />
                </Typography>
                <div className="flex flex-col gap-y-5 w-full items-center justify-center">
                    <Button variant="accent-dark" shape="rounded" onClick={() => setIsOpen(true)}>
                        {t('registration.steps.confirmEmail.changeEmail')}
                    </Button>
                    <Button variant="accent-dark" shape="rounded" onClick={requestEmailVerification} isLoading={isSendingVerification}>
                        {t('registration.steps.confirmEmail.resendConfirmation')}
                    </Button>
                </div>
                <div className="flex flex-col justify-center">
                    <Typography className="text-form mb-1">{t('registration.steps.confirmEmail.doYouHaveProblems')}&nbsp;</Typography>
                    <Button
                        className="font-normal text-form inline size-auto p-0"
                        onClick={() =>
                            (window.location.href = 'mailto:support@lern-fair.de?subject=Probleme%20bei%20der%20Anmeldung%20im%20neuen%20Userbereich')
                        }
                        variant="link"
                    >
                        <span className="underline decoration-1">{t('login.contactSupport')}</span>
                    </Button>
                </div>
            </div>
            <ChangeEmailModal isOpen={isOpen} onOpenChange={setIsOpen} currentEmail={form.email} onChanged={onEmailChanged} />
        </RegistrationStep>
    );
};
