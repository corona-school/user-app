import { SubjectsSelector } from '@/widgets/SubjectSelector';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/Typography';
import { useMatchRequestForm } from './useMatchRequestForm';
import { MatchRequestStep, MatchRequestStepTitle } from '@/components/match-request/MatchRequestStep';
import { SingleSubject } from '@/types/subject';

const Priority: React.FC = () => {
    const { goBack, goNext, form, onFormChange } = useMatchRequestForm();
    const { t } = useTranslation();

    const handleOnSubjectsChange = (subject: SingleSubject) => {
        onFormChange({
            subjects: form.subjects.map((s) => ({
                name: s.name,
                mandatory: s.name === subject,
            })),
        });
    };

    const options = form.subjects.map((e) => ({
        subject: e.name as SingleSubject,
        waitingDaysRange: form.subjectsOptions.find((o) => o.subject === e.name)?.waitingDaysRange,
    }));
    const value = form.subjects.find((s) => s.mandatory)?.name as SingleSubject;

    return (
        <MatchRequestStep
            onNext={goNext}
            onBack={goBack}
            isNextDisabled={form.subjects.every((it) => !it.mandatory)}
            reasonNextDisabled={t('matching.wizard.priority.reason_btn_disabled')}
        >
            <MatchRequestStepTitle>{t('matching.wizard.priority.subheading')}</MatchRequestStepTitle>
            <Typography className="mb-10">{t('matching.wizard.priority.text')}</Typography>
            <SubjectsSelector showWaitingDays onChange={handleOnSubjectsChange} value={value} options={options} />
        </MatchRequestStep>
    );
};
export default Priority;
