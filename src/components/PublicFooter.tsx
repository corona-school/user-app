import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import SwitchLanguageButton from './SwitchLanguageButton';
import { Typography } from './Typography';

interface PublicFooterProps {
    helpText?: string;
}

export const PublicFooter = ({ helpText }: PublicFooterProps) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center flex-1">
            <Typography className="text-center text-white mb-2 max-w-[500px]">{helpText ? helpText : t('welcome.needHelp')}</Typography>
            <Button
                onClick={() => (window.location.href = 'mailto:support@lern-fair.de?subject=Probleme%20bei%20der%20Anmeldung%20im%20neuen%20Userbereich')}
                variant="outline-light"
            >
                {t('welcome.contactSupport')}
            </Button>
            <div className="flex pt-5 text-center">
                <Button onClick={() => window.open('/datenschutz', '_blank')} variant="link" className="text-primary-light">
                    {t('settings.legal.datapolicy')}
                </Button>
                <Button onClick={() => window.open('/impressum', '_blank')} variant="link" className="text-primary-light">
                    {t('settings.legal.imprint')}
                </Button>
                <SwitchLanguageButton className="hover:bg-primary" />
            </div>
        </div>
    );
};
