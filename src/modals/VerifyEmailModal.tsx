import { gql } from './../gql';
import { useMutation } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../assets/icons/lernfair/ic_email.svg';
import { usePageTitle } from '../hooks/usePageTitle';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { IconInfoCircleFilled, IconSettingsFilled } from '@tabler/icons-react';
import { PublicFooter } from '@/components/PublicFooter';
import { Separator } from '@/components/Separator';
import ChangeEmailModal from './ChangeEmailModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/Dropdown';
import { useNavigate } from 'react-router-dom';
import useModal from '@/hooks/useModal';

interface VerifyEmailModalProps {
    email?: string;
    retainPath?: string;
    userType?: string;
}

const VerifyEmailModal = ({ email, retainPath, userType }: VerifyEmailModalProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { hide } = useModal();
    usePageTitle(`Lern-Fair - Registrierung: Bitte Email bestätigen für ${userType === 'pupil' ? 'Schüler:innen' : 'Helfer:innen'}`);

    const [showSendEmailResult, setShowSendEmailResult] = useState<'success' | 'error' | undefined>();
    const [isOpen, setIsOpen] = useState(false);

    const [sendVerification, _sendVerification] = useMutation(
        gql(`
        mutation RequestVerifyEmail($email: String!, $redirectTo: String!) {
        tokenRequest(email: $email, action: "user-verify-email", redirectTo: $redirectTo)
        }
    `)
    );

    const requestEmailVerification = useCallback(async () => {
        const res = await sendVerification({
            variables: {
                email: email!,
                redirectTo: retainPath ?? '/start',
            },
        });

        setShowSendEmailResult(res.data?.tokenRequest ? 'success' : 'error');
    }, [email, sendVerification]);

    const handleOnLogout = () => {
        hide();
        navigate('/logout');
    };

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-primary p-4">
            <div className="flex w-full gap-2 items-center justify-end px-4 pt-2 z-50">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost-light">
                            <IconSettingsFilled />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={handleOnLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex flex-col flex-1 w-full lg:max-w-2xl items-center justify-center gap-y-6">
                <Icon className="size-16" />
                <Typography variant="h4" className="text-center text-white">
                    {t('registration.verifyemail.title')} ✉️
                </Typography>
                {email && (
                    <>
                        <Typography className="text-white text-center">
                            {t('registration.verifyemail.mailsendto')}
                            <br />
                            <b>{email}</b>
                        </Typography>
                    </>
                )}
                <Typography className="text-white text-center">{t('registration.verifyemail.description')}</Typography>
                <Separator />
                <Typography variant="h5" className="text-white text-center font-bold">
                    {t('registration.verifyemail.notreceived.title')}
                </Typography>
                <Typography className="text-white text-center">{t('registration.verifyemail.notreceived.description')}</Typography>
                <Button variant="outline-light" onClick={() => setIsOpen(true)}>
                    {t('login.changeEmail')}
                </Button>
                <Button
                    disabled={_sendVerification?.loading}
                    isLoading={_sendVerification?.loading}
                    reasonDisabled={t('reasonsDisabled.loading')}
                    onClick={requestEmailVerification}
                    variant="link"
                    className="text-white underline"
                >
                    {t('registration.verifyemail.resend.button')}
                </Button>
                {showSendEmailResult && (
                    <div className="w-full max-w-[500px]">
                        <Alert title={showSendEmailResult === 'success' ? t('done') : t('error')} icon={<IconInfoCircleFilled />}>
                            {showSendEmailResult === 'success'
                                ? t('registration.verifyemail.resend.successAlert')
                                : t('registration.verifyemail.resend.failedAlert')}
                        </Alert>
                    </div>
                )}
            </div>
            <div className="mt-4">
                <PublicFooter />
            </div>
            <ChangeEmailModal isOpen={isOpen} onOpenChange={setIsOpen} currentEmail={email!} />
        </div>
    );
};
export default VerifyEmailModal;
