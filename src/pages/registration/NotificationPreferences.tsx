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
            <RegistrationStepTitle className="md:mb-4 mb-4">{t('registration.steps.notifications.title')}</RegistrationStepTitle>
            <Typography variant="body-lg" className="text-center mb-10 md:whitespace-pre-line text-balance">
                {t('registration.steps.notifications.description')}
            </Typography>
            <div className="flex flex-col gap-y-2 w-full">
                <div className="w-full bg-white p-4 gap-x-4 flex items-center rounded-md">
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
                <div className="w-full bg-white p-4 gap-x-4 flex items-center rounded-md">
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
