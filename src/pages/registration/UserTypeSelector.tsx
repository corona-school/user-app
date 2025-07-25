import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import useApollo from '@/hooks/useApollo';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { Toggle } from '@/components/Toggle';
import { IconBackpack, IconSchool } from '@tabler/icons-react';
import { useRegistrationForm } from './useRegistrationForm';

interface UserTypeSelectorProps extends RegistrationStepProps {}

export const UserTypeSelector = ({ onBack, onNext }: UserTypeSelectorProps) => {
    usePageTitle('Lern-Fair: Nachhilfe für benachteiligte Schüler:innen - Registrierung: Jetzt kostenlos anmelden');
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    const { roles, logout } = useApollo();

    const handleOnBack = async () => {
        // If user was trying to register with SSO but cancels, logout
        if (roles.includes('SSO_REGISTERING_USER')) {
            await logout();
        }
        onBack && onBack();
    };

    return (
        <RegistrationStep onBack={handleOnBack} onNext={onNext} isNextDisabled={!form.userType}>
            <RegistrationStepTitle>{t('registration.steps.userType.title')}</RegistrationStepTitle>
            <div className="flex flex-col md:flex-row gap-y-4 gap-x-4">
                <Toggle size="2xl" variant="white-primary" pressed={form.userType === 'pupil'} onPressedChange={() => onFormChange({ userType: 'pupil' })}>
                    <IconBackpack size={32} />
                    {t('registration.pupil.label')}
                </Toggle>
                <Toggle size="2xl" variant="white-primary" pressed={form.userType === 'student'} onPressedChange={() => onFormChange({ userType: 'student' })}>
                    <IconSchool size={32} />
                    {t('registration.student.label')}
                </Toggle>
            </div>
        </RegistrationStep>
    );
};
