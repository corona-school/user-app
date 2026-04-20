import { DAZ } from '../../../types/subject';
import { SubjectSelector } from '../../../widgets/SubjectSelector';
import { useTranslation } from 'react-i18next';
import { useMatchRequestForm } from './useMatchRequestForm';
import { MatchRequestStep, MatchRequestStepTitle } from '@/components/match-request/MatchRequestStep';
import { Typography } from '@/components/Typography';

const Priority: React.FC = () => {
    const { goBack, goNext, form, onFormChange } = useMatchRequestForm();
    const { t } = useTranslation();

    return (
        <MatchRequestStep
            onNext={goNext}
            onBack={goBack}
            isNextDisabled={form.subjects.every((it) => !it.mandatory)}
            reasonNextDisabled={t('matching.wizard.pupil.priority.reason_btn_disabled')}
        >
            <MatchRequestStepTitle>{t('matching.wizard.pupil.priority.heading')}</MatchRequestStepTitle>
            <Typography variant="h5">{t('matching.wizard.pupil.priority.subheading')}</Typography>
            <Typography>{t('matching.wizard.pupil.priority.text')}</Typography>
            <SubjectSelector
                subjects={form.subjects.filter((it) => it.mandatory && it.name !== DAZ).map((it) => it.name)}
                selectable={form.subjects.filter((it) => it.name !== DAZ).map((it) => it.name)}
                addSubject={(it) =>
                    onFormChange({ subjects: form.subjects.map((s) => (s.name === it ? { ...s, mandatory: true } : { ...s, mandatory: false })) })
                }
                removeSubject={(it) => onFormChange({ subjects: form.subjects.map((s) => (s.name === it ? { ...s, mandatory: false } : s)) })}
                limit={1}
            />
        </MatchRequestStep>
    );
};
export default Priority;
