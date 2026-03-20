import { Trans, useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { RegistrationStep, RegistrationStepTitle } from './RegistrationStep';
import { Typography } from '@/components/Typography';

interface UniCooperationConfirmationProps {
    onBack?: () => void;
}

export const UniCooperationConfirmation = ({ onBack }: UniCooperationConfirmationProps) => {
    usePageTitle(`Registrierung: Uni-Kooperation - (Helfer:in)`);
    const { t } = useTranslation();

    return (
        <RegistrationStep onBack={onBack}>
            <RegistrationStepTitle>{t('registration.steps.uniCooperationConfirmation.title')}</RegistrationStepTitle>
            <div className="text-3xl my-4">🥳</div>
            <Typography className="text-center md:whitespace-pre-line">
                <Trans
                    i18nKey="registration.steps.uniCooperationConfirmation.description"
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
