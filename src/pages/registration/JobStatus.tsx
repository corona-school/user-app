import { Screening_Jobstatus_Enum, Student_Jobstatus_Enum } from '@/gql/graphql';
import { JobStatusSelector } from '@/widgets/screening/JobStatusSelector';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { OptionalBadge, RegistrationStep, RegistrationStepDescription, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';

interface JobStatusProps extends RegistrationStepProps {}

export const JobStatus = ({ onBack, onNext }: JobStatusProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    usePageTitle('Registrierung: JobStatus - optional');

    return (
        <RegistrationStep className="px-0" onBack={onBack} onNext={onNext}>
            <OptionalBadge />
            <RegistrationStepTitle>{t('registration.steps.jobStatus.title')} </RegistrationStepTitle>
            <RegistrationStepDescription className="mb-10">{t('registration.steps.jobStatus.description')}</RegistrationStepDescription>
            <div className="w-full md:pb-0">
                <JobStatusSelector
                    value={form.jobStatus as unknown as Screening_Jobstatus_Enum}
                    setValue={(jobStatus) => onFormChange({ jobStatus: jobStatus as unknown as Student_Jobstatus_Enum })}
                    className="flex flex-wrap justify-center"
                    toggleConfig={{
                        variant: 'white-primary',
                        size: 'lg',
                    }}
                />
            </div>
        </RegistrationStep>
    );
};
