import { containsDAZ, DAZ } from '../../../types/subject';
import { SubjectSelector } from '../../../widgets/SubjectSelector';
import { useTranslation } from 'react-i18next';
import { useMatchRequestForm } from './useMatchRequestForm';
import { MatchRequestStep, MatchRequestStepTitle } from '@/components/match-request/MatchRequestStep';
import { Typography } from '@/components/Typography';

const Subjects: React.FC = () => {
    const { goNext, goBack, form, onFormChange } = useMatchRequestForm();
    const { t } = useTranslation();
    const isDAZ = containsDAZ(form.subjects);

    const onAddSubject = (subject: string) => {
        if (form.learningGermanSince === '2-4') {
            onFormChange({ subjects: [{ name: subject, mandatory: true }].concat({ name: DAZ, mandatory: true }) });
        } else {
            onFormChange({ subjects: form.subjects.concat({ name: subject, mandatory: form.subjects.length === 0 }) });
        }
    };

    return (
        <MatchRequestStep
            onNext={goNext}
            onBack={goBack}
            isNextDisabled={form.subjects.length === 0 || (form.subjects.length === 1 && isDAZ)}
            reasonNextDisabled={isDAZ ? t('matching.wizard.pupil.subjects.reason_btn_disabled_DAZ') : t('matching.wizard.pupil.subjects.reason_btn_disabled')}
        >
            <MatchRequestStepTitle>{t('matching.wizard.pupil.subjects.heading')}</MatchRequestStepTitle>
            <Typography variant="h5">{t('matching.wizard.pupil.subjects.subheading')}</Typography>
            {isDAZ && <Typography>{t('matching.wizard.pupil.subjects.text')}</Typography>}
            <SubjectSelector
                subjects={form.subjects.filter((it) => it.name !== DAZ).map((it) => it.name)}
                addSubject={onAddSubject}
                removeSubject={(it) => onFormChange({ subjects: form.subjects.filter((s) => s.name !== it) })}
                limit={isDAZ ? 1 : undefined}
            />
        </MatchRequestStep>
    );
};
export default Subjects;
