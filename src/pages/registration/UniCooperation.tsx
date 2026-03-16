import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Input } from '@/components/Input';
import { usePageTitle } from '@/hooks/usePageTitle';
import { IsFromUniCooperation } from './IsFromUniCooperation';
import { useState } from 'react';

interface UniCooperationProps extends RegistrationStepProps {}

export const UniCooperation = ({ onNext }: UniCooperationProps) => {
    const { form, onFormChange } = useRegistrationForm();
    usePageTitle(`Registrierung: Uni-Kooperation - (Helfer:in)`);
    const { t } = useTranslation();
    const [showConfirmation, setShowConfirmation] = useState(!form.isFromUniCooperation);

    const handleOnIsFromUniCooperationNext = () => {
        if (form.isFromUniCooperation === false && onNext) {
            onNext();
        } else {
            setShowConfirmation(false);
        }
    };

    const handleOnBack = () => {
        setShowConfirmation(true);
    };

    if (form.isFromUniCooperation === undefined || showConfirmation) {
        return <IsFromUniCooperation onNext={handleOnIsFromUniCooperationNext} />;
    }

    return (
        <RegistrationStep onBack={handleOnBack} onNext={onNext} isNextDisabled={!form.uniCooperation}>
            <RegistrationStepTitle className="mb-10">{t('registration.steps.uniCooperation.title')}</RegistrationStepTitle>
            <div className="flex flex-col items-center gap-y-3 w-full pb-32 md:pb-0">
                <div className="w-full flex flex-col items-center justify-center gap-y-1 max-w-[300px] text-center">
                    <Input
                        autoFocus={!form.uniCooperation}
                        variant="white"
                        className="w-full h-12 max-w-[396px]"
                        value={form.uniCooperation || ''}
                        onChangeText={(value) => onFormChange({ uniCooperation: value })}
                        errorMessageClassName="min-h-10"
                    />
                </div>
            </div>
        </RegistrationStep>
    );
};
