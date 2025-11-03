import { useTranslation } from 'react-i18next';
import { OptionalBadge, RegistrationStep, RegistrationStepDescription, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { Typography } from '@/components/Typography';
import { Checkbox, CheckedState } from '@/components/Checkbox';
import { Label } from '@/components/Label';
import { useUserPreferences } from '@/hooks/useNotificationPreferences';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useRegistrationForm } from './useRegistrationForm';

interface NotificationPreferencesProps extends RegistrationStepProps {}

export const NotificationPreferences = ({ onBack, onNext }: NotificationPreferencesProps) => {
    const { hasMarketingPreferencesEnabled, hasSystemPreferencesEnabled, toggleMarketingNotifications, toggleSystemNotifications } = useUserPreferences();
    const { t } = useTranslation();
    const { form } = useRegistrationForm();
    usePageTitle(`Registrierung: Benachrichtigungen (${form.userType === 'pupil' ? 'Schüler:in' : 'Helfer:in'})`);

    const makeOnChangeHandler = (key: 'importantInformation' | 'recommendations') => {
        const onChange = (checked: CheckedState) => {
            if (key === 'importantInformation') {
                toggleSystemNotifications(!!checked);
            } else {
                toggleMarketingNotifications(!!checked);
            }
        };
        return onChange;
    };

    return (
        <RegistrationStep onBack={onBack} onNext={onNext}>
            <OptionalBadge />
            <RegistrationStepTitle className="md:mb-4 mb-4">
                <span className="md:hidden">{t('registration.steps.notifications.titleShort')}</span>
                <span className="hidden md:block">{t('registration.steps.notifications.title')}</span>
            </RegistrationStepTitle>
            <RegistrationStepDescription className="mb-10 md:whitespace-pre-line text-balance">
                {t('registration.steps.notifications.description')}
            </RegistrationStepDescription>
            <div className="flex flex-col gap-y-5 w-full">
                <div className="w-full bg-white p-4 gap-x-4 flex items-center rounded-md relative">
                    <div className="absolute -top-3 left-4 bg-green-500 p-2 rounded-sm flex items-center justify-center h-6">
                        <Typography variant="sm" className="text-white">
                            {t('registration.steps.notifications.importantInformationBadge')}
                        </Typography>
                    </div>
                    <Checkbox
                        checked={hasSystemPreferencesEnabled}
                        onCheckedChange={makeOnChangeHandler('importantInformation')}
                        className="size-4"
                        id="importantInformation"
                    />{' '}
                    <Label htmlFor="importantInformation" className="text-base font-normal w-full cursor-pointer">
                        {t('registration.steps.notifications.importantInformationDescription')}
                    </Label>
                </div>
                <div className="w-full bg-white p-4 gap-x-4 flex items-center rounded-md relative">
                    <div className="absolute -top-3 left-4 bg-green-500 p-2 rounded-sm flex items-center justify-center h-6">
                        <Typography variant="sm" className="text-white">
                            {t('registration.steps.notifications.recommendationsBadge')}
                        </Typography>
                    </div>
                    <Checkbox
                        checked={hasMarketingPreferencesEnabled}
                        onCheckedChange={makeOnChangeHandler('recommendations')}
                        className="size-4"
                        id="recommendations"
                    />{' '}
                    <Label htmlFor="recommendations" className="text-base font-normal w-full cursor-pointer">
                        {t('registration.steps.notifications.recommendationsDescription')}
                    </Label>
                </div>
            </div>
        </RegistrationStep>
    );
};
