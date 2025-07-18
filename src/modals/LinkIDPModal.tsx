import { Button } from '@/components/Button';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import useApollo, { getOrCreateDeviceId, useUser } from '@/hooks/useApollo';
import { IconLogin2 } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LinkIDPModalProps extends BaseModalProps {}

const LinkIDPModal = ({ isOpen, onOpenChange }: LinkIDPModalProps) => {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const user = useUser();
    const navigate = useNavigate();
    const { loginWithPassword, logout } = useApollo();

    const handleOnLogin = async () => {
        setIsAuthenticating(true);
        try {
            const response = await loginWithPassword(user.email, password, getOrCreateDeviceId());

            if (response.errors) {
                toast.error(t('login.error'));
            }
        } catch (error) {
            toast.error(t('error'));
        }
        setIsAuthenticating(false);
    };

    const handleOnOpenChange = async (open: boolean) => {
        onOpenChange(open);
        if (!open) {
            await logout();
            navigate('/');
        }
    };

    return (
        <Modal onOpenChange={handleOnOpenChange} isOpen={isOpen} classes={{ closeIcon: 'hidden' }}>
            <ModalHeader>
                <ModalTitle className="inline-flex gap-x-2 items-center">
                    {t('login.reauthenticate.title')} <IconLogin2 />{' '}
                </ModalTitle>
            </ModalHeader>
            <div className="flex flex-col">
                <Typography className="mb-4">{t('login.reauthenticate.passwordDescription')}</Typography>

                {!user ? (
                    <CenterLoadingSpinner />
                ) : (
                    <div className="flex flex-col gap-y-4">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input id="email" value={user.email} disabled />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="password">{t('password')}</Label>
                            <Input id="password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                )}
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" disabled={isAuthenticating} onClick={() => handleOnOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" isLoading={isAuthenticating} disabled={!password || !user} onClick={handleOnLogin}>
                    {t('signin')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default LinkIDPModal;
