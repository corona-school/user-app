import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Typography } from '@/components/Typography';
import { Checkbox } from '@/components/Checkbox';
import { Label } from '@/components/Label';

interface OurRulesProps extends RegistrationStepProps {}

export const OurRules = ({ onNext, onBack }: OurRulesProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();

    const onChange = (hasAcceptedRules: boolean) => {
        onFormChange({ hasAcceptedRules });
    };

    const bullets = t('registration.steps.ourRules.rules', { returnObjects: true });

    return (
        <RegistrationStep onBack={onBack} onNext={onNext} isNextDisabled={!form.hasAcceptedRules}>
            <div className="flex flex-col gap-y-10 justify-center items-center md:max-w-[400px]">
                <div className="flex flex-col gap-y-4 justify-center items-center w-full">
                    <RegistrationStepTitle>{t('registration.steps.ourRules.title')}</RegistrationStepTitle>
                    <Typography variant="body-lg" className="text-center md:whitespace-pre-line text-balance">
                        {t('registration.steps.ourRules.description')}
                    </Typography>
                </div>
                <ol className="flex flex-col gap-y-4 mb-10 list-decimal pl-4 md:pl-6">
                    {bullets.map((bullet, index) => (
                        <li key={index}>
                            <Typography>{bullet}</Typography>
                        </li>
                    ))}
                </ol>
            </div>
            <div className="flex flex-col gap-y-2 w-full">
                <div className="w-full bg-white p-4 gap-x-4 pr-3 flex items-center rounded-md">
                    <Checkbox checked={form.hasAcceptedRules} onCheckedChange={onChange} className="size-4" id="accept" />{' '}
                    <Label htmlFor="accept" className="text-base font-normal w-full cursor-pointer">
                        {t('registration.steps.ourRules.acceptLabel')}
                    </Label>
                </div>
            </div>
        </RegistrationStep>
    );
};
