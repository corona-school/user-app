import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Language } from '@/gql/graphql';
import { Typography } from '@/components/Typography';

interface UserLanguagesProps extends RegistrationStepProps {}

export const UserLanguages = ({ onBack, onNext }: UserLanguagesProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();

    const onChange = (values: Language[]) => {
        onFormChange({ languages: values });
    };

    return (
        <RegistrationStep className="px-0" onBack={onBack} onNext={onNext} isNextDisabled={!form.languages.length}>
            <RegistrationStepTitle className="md:mb-10">{t('registration.steps.languages.title')} </RegistrationStepTitle>
            <Typography variant="body-lg" className="text-center mb-4 md:whitespace-pre-line md:px-14">
                {t('registration.steps.languages.description')}
            </Typography>
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
