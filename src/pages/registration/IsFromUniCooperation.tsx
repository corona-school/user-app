import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { Toggle } from '@/components/Toggle';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { useRegistrationForm } from './useRegistrationForm';

interface IsFromUniCooperationProps extends RegistrationStepProps {}

export const IsFromUniCooperation = ({ onNext }: IsFromUniCooperationProps) => {
    usePageTitle(`Registrierung: Uni-Kooperation - (Helfer:in)`);
    const { form, onFormChange } = useRegistrationForm();

    const { t } = useTranslation();

    return (
        <RegistrationStep onNext={onNext}>
            <RegistrationStepTitle className="mb-10">{t('registration.steps.isFromUniCooperation.title')}</RegistrationStepTitle>
            <div className="flex flex-col md:flex-row gap-y-4 gap-x-4">
                <Toggle
                    size="2xl"
                    variant="white-primary"
                    pressed={form.isFromUniCooperation}
                    onPressedChange={() => onFormChange({ isFromUniCooperation: !form.isFromUniCooperation })}
                >
                    <IconThumbUp size={32} />
                    {t('yes')}
                </Toggle>
                <Toggle
                    size="2xl"
                    variant="white-primary"
                    pressed={form.isFromUniCooperation === false}
                    onPressedChange={() => onFormChange({ isFromUniCooperation: !form.isFromUniCooperation, uniCooperation: '' })}
                >
                    <IconThumbDown size={32} />
                    {t('no')}
                </Toggle>
            </div>
        </RegistrationStep>
    );
};
