import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useRegistrationForm } from './useRegistrationForm';
import { OptionalBadge, RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { SchoolTypeSelector } from '@/components/SchoolTypeSelector';
import { SchoolType as ISchoolType, School_Schooltype_Enum } from '@/gql/graphql';

interface SchoolTypeProps extends RegistrationStepProps {}

const SchoolType = ({ onBack, onNext }: SchoolTypeProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    usePageTitle('Lern-Fair - Registrierung: Schulform');

    const onChange = (schooltype: ISchoolType) => {
        onFormChange({ school: { ...form.school, schooltype: schooltype as unknown as School_Schooltype_Enum } });
    };

    return (
        <RegistrationStep className="px-0" onBack={onBack} onNext={onNext}>
            <OptionalBadge />
            <RegistrationStepTitle className="md:mb-10">{t('registration.steps.schoolType.title')} </RegistrationStepTitle>
            <div className="w-full md:pb-0">
                <SchoolTypeSelector
                    className="flex flex-wrap justify-center"
                    toggleConfig={{
                        variant: 'white-primary',
                        size: 'lg',
                        className: 'justify-start w-fit h-[48px] px-4 [&>*:nth-child(1)]:hidden font-semibold',
                    }}
                    value={form.school.schooltype as unknown as ISchoolType}
                    setValue={onChange}
                />
            </div>
        </RegistrationStep>
    );
};
export default SchoolType;
