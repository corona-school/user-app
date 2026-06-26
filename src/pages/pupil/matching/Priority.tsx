import { SubjectOption, SubjectsSelector } from '@/widgets/SubjectSelector';
import { useTranslation } from 'react-i18next';
import { useMatchRequestForm } from './useMatchRequestForm';
import { MatchRequestStep, MatchRequestStepTitle } from '@/components/match-request/MatchRequestStep';
import { Typography } from '@/components/Typography';
import { Course_Subject_Enum } from '@/gql/graphql';

const Priority: React.FC = () => {
    const { goBack, goNext, form, onFormChange } = useMatchRequestForm();
    const { t } = useTranslation();

    const handleOnSubjectsChange = (subject: Course_Subject_Enum) => {
        onFormChange({
            subjects: form.subjects.map((s) => ({
                name: s.name,
                mandatory: s.name === subject,
            })),
        });
    };

    const options = (form.subjectsOptions ?? []).filter((it) => form.subjects.some((s) => s.name === it.subject)) as unknown as SubjectOption[];
    const value = form.subjects.find((s) => s.mandatory)?.name as Course_Subject_Enum;

    return (
        <MatchRequestStep
            onNext={goNext}
            onBack={goBack}
            isNextDisabled={form.subjects.every((it) => !it.mandatory)}
            reasonNextDisabled={t('matching.wizard.pupil.priority.reason_btn_disabled')}
        >
            <MatchRequestStepTitle>{t('matching.wizard.pupil.priority.subheading')}</MatchRequestStepTitle>
            <Typography className="mb-10">{t('matching.wizard.pupil.priority.text')}</Typography>
            <SubjectsSelector
                showPupilsWaiting={form.userType === 'student'}
                showGradesAvailable={form.userType === 'student'}
                showWaitingDays={form.userType === 'pupil'}
                onChange={handleOnSubjectsChange}
                value={value}
                options={options}
            />
        </MatchRequestStep>
    );
};
export default Priority;
