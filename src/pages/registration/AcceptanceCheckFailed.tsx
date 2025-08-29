import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { RegistrationStep, RegistrationStepTitle } from './RegistrationStep';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';

interface AcceptanceCheckFailedProps {
    onTryAgain: () => void;
}

export const AcceptanceCheckFailed = ({ onTryAgain }: AcceptanceCheckFailedProps) => {
    usePageTitle('Lern-Fair - Registrierung: Registrierung abgelehnt für Schüler:innen');
    const { t } = useTranslation();

    return (
        <RegistrationStep>
            <RegistrationStepTitle className="md:mb-4 mb-4">{t('registration.steps.acceptanceCheckFailed.title')}</RegistrationStepTitle>
            <Typography className="text-center mb-10 md:whitespace-pre-line">{t('registration.steps.acceptanceCheckFailed.description')}</Typography>
            <div className="flex flex-col gap-y-2 w-full justify-center items-center max-w-[250px]">
                <Button className="w-full" onClick={() => window.open('https://digitale-lernangebote.de/', '_blank')}>
                    {t('registration.steps.acceptanceCheckFailed.seeOtherOffers')}
                </Button>
                <Button className="w-full" variant="optional" onClick={onTryAgain}>
                    {t('registration.steps.acceptanceCheckFailed.tryAgain')}
                </Button>
            </div>
        </RegistrationStep>
    );
};
