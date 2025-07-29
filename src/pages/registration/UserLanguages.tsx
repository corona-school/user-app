import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Language } from '@/gql/graphql';
import { IconInfoCircleFilled } from '@tabler/icons-react';
import { TooltipButton } from '@/components/Tooltip';
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
            <RegistrationStepTitle className="md:mb-10">
                {t('registration.steps.languages.title')}{' '}
                <span className="inline-block">
                    <TooltipButton
                        className="max-w-[168px]"
                        tooltipContent={
                            <Typography className="text-balance" variant="subtle">
                                {t('registration.steps.languages.tooltip')}
                            </Typography>
                        }
                    >
                        <IconInfoCircleFilled size={24} />
                    </TooltipButton>
                </span>
            </RegistrationStepTitle>
            <Typography variant="body-lg" className="text-center mb-10 md:whitespace-pre-line text-balance">
                {t('registration.steps.languages.description')}
            </Typography>
            <div className="w-full pb-32 md:pb-0">
                <LanguageSelector
                    maxVisibleItems={8}
                    className="flex flex-wrap justify-center"
                    searchConfig={{
                        containerClassName: 'w-full max-w-[342px] md:w-[227px]',
                        className: 'bg-white',
                        placeholder: t('otherLanguages'),
                    }}
                    toggleConfig={{
                        variant: 'white-primary',
                        size: 'lg',
                        className: 'justify-start w-[168px]',
                    }}
                    multiple
                    value={form.languages}
                    setValue={onChange}
                />
            </div>
        </RegistrationStep>
    );
};
