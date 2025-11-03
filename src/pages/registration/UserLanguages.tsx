import { useTranslation } from 'react-i18next';
import { OptionalBadge, RegistrationStep, RegistrationStepDescription, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Language } from '@/gql/graphql';
import { Typography } from '@/components/Typography';
import { usePageTitle } from '@/hooks/usePageTitle';

interface UserLanguagesProps extends RegistrationStepProps {}

export const UserLanguages = ({ onBack, onNext }: UserLanguagesProps) => {
    const { form, onFormChange } = useRegistrationForm();
    usePageTitle(`Registrierung: Sprachen (${form.userType === 'pupil' ? 'Schüler:in' : 'Helfer:in'})`);
    const { t } = useTranslation();

    const onChange = (values: Language[]) => {
        onFormChange({ languages: values });
    };

    const isNextDisabled = form.userType === 'pupil' ? form.languages.length === 0 : false;

    return (
        <RegistrationStep className="px-0" onBack={onBack} onNext={onNext} isNextDisabled={isNextDisabled}>
            {form.userType === 'student' && <OptionalBadge />}
            <RegistrationStepTitle className="mb-3">
                {t(form.userType === 'pupil' ? 'registration.steps.languages.titlePupil' : 'registration.steps.languages.titleStudent')}
            </RegistrationStepTitle>
            <RegistrationStepDescription className="mb-4 md:px-14">
                {t(form.userType === 'pupil' ? 'registration.steps.languages.descriptionPupil' : 'registration.steps.languages.descriptionStudent')}
            </RegistrationStepDescription>
            <div className="w-full sm:pb-32 md:pb-0">
                <LanguageSelector
                    maxVisibleItems={8}
                    className="flex flex-wrap justify-center"
                    searchConfig={{
                        containerClassName: 'w-full sm:max-w-[342px] md:w-[227px]',
                        className: 'bg-white',
                        placeholder: t('otherLanguages'),
                    }}
                    toggleConfig={{
                        variant: 'white-primary',
                        size: 'lg',
                        className: 'justify-start w-[48%] sm:w-[168px] font-semibold h-[48px]',
                    }}
                    multiple
                    value={form.languages}
                    setValue={onChange}
                />
            </div>
        </RegistrationStep>
    );
};
