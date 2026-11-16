import { MatchRequestStep, MatchRequestStepTitle } from '@/components/match-request/MatchRequestStep';
import { usePageTitle } from '@/hooks/usePageTitle';
import { cn } from '@/lib/Tailwind';
import { MIN_MAX_GRADE_RANGE } from '@/Utility';
import { SingleSubject } from '@/types/subject';
import { SubjectGradeCard } from '@/widgets/SubjectGradeCard';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useTranslation } from 'react-i18next';
import { useMatchRequestForm } from './useMatchRequestForm';

const SubjectsGrade = () => {
    const { t } = useTranslation();
    const { form, goNext, goBack, onFormChange } = useMatchRequestForm();
    usePageTitle(`Neues Lernpaar: Klassenstufen - Helfer*in (App) | Lern-Fair`);
    const { trackEvent } = useMatomo();

    const selectedSubjects = form.subjects;

    const getWaitingInGradeRange = (subjectName?: string, range: { min: number; max: number } = MIN_MAX_GRADE_RANGE) => {
        if (!subjectName) return 0;
        const subjectOption = form.subjectsOptions.find((o) => o.subject === subjectName);
        if (!subjectOption) return 0;
        return subjectOption.gradesAvailable?.filter((g) => g >= range.min && g <= range.max).length ?? 0;
    };

    const copyToAllSubjects = (range: { min: number; max: number }) => {
        trackEvent({
            category: 'Match Request',
            action: 'Page "Select Grade"',
            name: 'Button Click - Copy Grade to all Subjects',
        });
        onFormChange({
            subjects: form.subjects.map((s) => ({ ...s, grade: { min: range.min, max: range.max } })),
        });
    };

    const ranges = selectedSubjects.map((subject) => {
        return { min: subject?.grade?.min ?? MIN_MAX_GRADE_RANGE.min, max: subject?.grade?.max ?? MIN_MAX_GRADE_RANGE.max };
    });

    const isCopyDisabled = form.subjects.length <= 1 || ranges.every((range) => range.min === ranges[0].min && range.max === ranges[0].max);

    return (
        <MatchRequestStep onNext={goNext} onBack={goBack}>
            <div className="flex flex-col justify-between xl:flex-row gap-y-4 gap-x-4 mb-6">
                <MatchRequestStepTitle className="my-0">{t('matching.wizard.grades.heading')}</MatchRequestStepTitle>
            </div>
            <div className={cn('flex flex-wrap gap-4')}>
                {selectedSubjects.map((subject) => {
                    const option = form.subjectsOptions.find((o) => o.subject === subject.name);
                    const range = { min: subject?.grade?.min ?? MIN_MAX_GRADE_RANGE.min, max: subject?.grade?.max ?? MIN_MAX_GRADE_RANGE.max };
                    return (
                        <SubjectGradeCard
                            key={subject.name}
                            subject={subject.name as SingleSubject}
                            range={range}
                            onRangeChange={({ min, max }) =>
                                onFormChange({
                                    subjects: form.subjects.map((s) => (s.name === subject?.name ? { ...s, grade: { min, max } } : s)),
                                })
                            }
                            onCopyToAll={copyToAllSubjects}
                            isCopyDisabled={isCopyDisabled}
                            pupilsWaiting={option?.pupilsWaiting ?? undefined}
                            pupilsWaitingInRange={getWaitingInGradeRange(subject?.name, range)}
                        />
                    );
                })}
            </div>
        </MatchRequestStep>
    );
};
export default SubjectsGrade;
