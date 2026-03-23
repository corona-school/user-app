import { Trans, useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { RegistrationStep, RegistrationStepTitle } from './RegistrationStep';
import { Typography } from '@/components/Typography';
import { useRegistrationForm } from './useRegistrationForm';
import { RegistrationStep as RegistrationStepEnum } from './util';

interface UniCooperationConfirmationProps {
    onBack?: () => void;
}

export const UniCooperationConfirmation = ({ onBack }: UniCooperationConfirmationProps) => {
    usePageTitle(`Registrierung: Uni-Kooperation - (Helfer:in)`);
    const { t } = useTranslation();
    const { onFormChange } = useRegistrationForm();

    return (
        <RegistrationStep onBack={onBack}>
            <RegistrationStepTitle>{t('registration.steps.uniCooperationConfirmation.title')}</RegistrationStepTitle>
            <div className="text-3xl my-4">🥳</div>
            <Typography className="text-center md:whitespace-pre-line">{t('registration.steps.uniCooperationConfirmation.description')}</Typography>
            <Typography className="text-center md:whitespace-pre-line my-4">
                <Trans
                    i18nKey="registration.steps.uniCooperationConfirmation.notUniCooperation"
                    components={{
                        navigate: (
                            <span
                                className="inline underline text-primary cursor-pointer"
                                onClick={() => onFormChange({ isFromUniCooperation: false, currentStep: RegistrationStepEnum.uniCooperation })}
                            >
                                hier
                            </span>
                        ),
                    }}
                ></Trans>
            </Typography>
            <Typography className="text-center md:whitespace-pre-line">
                <Trans
                    i18nKey="registration.steps.uniCooperationConfirmation.support"
                    components={{
                        supportEmail: (
                            <a className="inline underline text-primary" href="mailto:support@lern-fair.de">
                                support@lern-fair.de
                            </a>
                        ),
                    }}
                ></Trans>
            </Typography>
        </RegistrationStep>
    );
};
