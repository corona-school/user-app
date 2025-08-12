import { GradeSelector } from '@/components/GradeSelector';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';

interface PupilGradeProps extends RegistrationStepProps {}

const PupilGrade = ({ onBack, onNext }: PupilGradeProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    usePageTitle('Lern-Fair - Registrierung: Klasse');

    const onChange = (grade: number) => {
        onFormChange({ grade });
    };

    return (
        <RegistrationStep className="px-0" onBack={onBack} onNext={onNext} isNextDisabled={!form.grade}>
            <RegistrationStepTitle className="md:mb-10">{t('registration.steps.grade.title')} </RegistrationStepTitle>
            <div className="w-full md:pb-0">
                <GradeSelector
                    className="flex flex-wrap justify-center"
                    toggleConfig={{
                        variant: 'white-primary',
                        size: 'lg',
                        className: 'justify-start w-[150px]',
                    }}
                    grade={form.grade}
                    onGradeChange={onChange}
                />
            </div>
        </RegistrationStep>
    );
};
export default PupilGrade;
