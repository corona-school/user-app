import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { RegistrationStep, RegistrationStepDescription, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { RegistrationForm, useRegistrationForm } from './useRegistrationForm';
import { Checkbox, CheckedState } from '@/components/Checkbox';
import { Label } from '@/components/Label';
import { Button } from '@/components/Button';

interface AcceptanceCheckProps extends RegistrationStepProps {
    onFail: () => void;
}

export const AcceptanceCheck = ({ onBack, onNext, onFail }: AcceptanceCheckProps) => {
    usePageTitle('Registrierung: Wichtige Frage');
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();

    const makeOnChangeHandler = (key: keyof RegistrationForm['acceptanceCheck']) => {
        const onChange = (checked: CheckedState) => {
            onFormChange({ acceptanceCheck: { ...form.acceptanceCheck, [key]: !!checked } });
        };
        return onChange;
    };

    const hasCheckedAtLeastTwo = () => {
        const selectedCount = Object.values(form.acceptanceCheck).filter(Boolean).length;
        return selectedCount >= 2;
    };

    return (
        <RegistrationStep onBack={onBack} onNext={onNext} isNextDisabled={!hasCheckedAtLeastTwo()}>
            <RegistrationStepTitle className="md:mb-4 mb-3">{t('registration.steps.acceptanceCheck.title')}</RegistrationStepTitle>
            <RegistrationStepDescription className="mb-5">{t('registration.steps.acceptanceCheck.description')}</RegistrationStepDescription>
            <div className="flex flex-col gap-y-2 w-full">
                <div className="w-full bg-white p-4 gap-x-4 flex items-center rounded-md">
                    <Checkbox
                        checked={form.acceptanceCheck?.needHelpInSchool}
                        onCheckedChange={makeOnChangeHandler('needHelpInSchool')}
                        className="size-4"
                        id="schoolHelp"
                    />{' '}
                    <Label htmlFor="schoolHelp" className="text-base font-normal w-full cursor-pointer">
                        {t('registration.steps.acceptanceCheck.needHelpInSchool')}
                    </Label>
                </div>
                <div className="w-full bg-white p-4 gap-x-4 flex items-center rounded-md">
                    <Checkbox
                        checked={form.acceptanceCheck?.familyCannotHelp}
                        onCheckedChange={makeOnChangeHandler('familyCannotHelp')}
                        className="size-4"
                        id="homeworkHelp"
                    />{' '}
                    <Label htmlFor="homeworkHelp" className="text-base font-normal w-full cursor-pointer">
                        {t('registration.steps.acceptanceCheck.familyCannotHelp')}
                    </Label>
                </div>
                <div className="w-full bg-white p-4 gap-x-4 flex items-center rounded-md cursor-pointer">
                    <Checkbox
                        checked={form.acceptanceCheck?.familyCannotAffordTutoring}
                        onCheckedChange={makeOnChangeHandler('familyCannotAffordTutoring')}
                        className="size-4"
                        id="tutoring"
                    />{' '}
                    <Label htmlFor="tutoring" className="text-base font-normal w-full">
                        {t('registration.steps.acceptanceCheck.familyCannotAffordTutoring')}
                    </Label>
                </div>
            </div>
            <div className="w-full px-3">
                <Button variant="link" className="mt-4 md:mt-8 w-full underline decoration-1" onClick={onFail}>
                    {t('registration.steps.acceptanceCheck.doNotApplyToMe')}
                </Button>
            </div>
        </RegistrationStep>
    );
};
