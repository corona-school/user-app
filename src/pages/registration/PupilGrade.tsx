import { GradeSelector } from '@/components/GradeSelector';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { OptionalBadge, RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { TRAINEE_GRADE } from '@/Utility';
import { School_Schooltype_Enum as SchoolType } from '@/gql/graphql';

interface PupilGradeProps extends RegistrationStepProps {}

const PupilGrade = ({ onBack, onNext }: PupilGradeProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    usePageTitle('Registrierung: Klasse - optional');

    const onChange = (grade: number) => {
        onFormChange({ grade, school: { ...form.school, schooltype: grade === TRAINEE_GRADE ? SchoolType.Berufsschule : null } });
    };

    return (
        <RegistrationStep className="px-0" onBack={onBack} onNext={onNext}>
            <OptionalBadge />
            <RegistrationStepTitle className="md:mb-10">{t('registration.steps.grade.title')} </RegistrationStepTitle>
            <div className="w-full md:pb-0">
                <GradeSelector
                    className="flex flex-wrap justify-center"
                    toggleConfig={{
                        variant: 'white-primary',
                        size: 'lg',
                        className: 'w-[150px] [&>*:nth-child(1)]:hidden',
                    }}
                    grade={form.grade}
                    onGradeChange={onChange}
                />
            </div>
        </RegistrationStep>
    );
};
export default PupilGrade;
