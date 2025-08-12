import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { RegistrationForm, useRegistrationForm } from './useRegistrationForm';
import { Typography } from '@/components/Typography';
import { Checkbox, CheckedState } from '@/components/Checkbox';
import { Label } from '@/components/Label';

interface NotificationPreferencesProps extends RegistrationStepProps {}

export const NotificationPreferences = ({ onBack, onNext }: NotificationPreferencesProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();

    const makeOnChangeHandler = (key: keyof RegistrationForm['notificationPreferences']) => {
        const onChange = (checked: CheckedState) => {
            onFormChange({ notificationPreferences: { ...form.notificationPreferences, [key]: !!checked } });
        };
        return onChange;
    };

    return (
        <RegistrationStep onBack={onBack} onNext={onNext}>
            <RegistrationStepTitle className="md:mb-4 mb-4">
                <span className="md:hidden">{t('registration.steps.notifications.titleShort')}</span>
                <span className="hidden md:block">{t('registration.steps.notifications.title')}</span>
            </RegistrationStepTitle>
            <Typography variant="body-lg" className="text-center mb-10 md:whitespace-pre-line text-balance">
                {t('registration.steps.notifications.description')}
            </Typography>
            <div className="flex flex-col gap-y-5 w-full">
                <div className="w-full bg-white p-4 gap-x-4 flex items-center rounded-md relative">
                    <div className="absolute -top-3 left-4 bg-green-500 p-2 rounded-sm flex items-center justify-center h-6">
                        <Typography variant="sm" className="text-white">
                            {t('registration.steps.notifications.importantInformationBadge')}
                        </Typography>
                    </div>
                    <Checkbox
                        checked={form.notificationPreferences.importantInformation}
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
                        checked={form.notificationPreferences.recommendations}
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
