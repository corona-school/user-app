import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { MatchRequestStep, MatchRequestStepTitle } from '@/components/match-request/MatchRequestStep';
import { Slider } from '@/components/Slider';
import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { getGradeLabel } from '@/Utility';
import { SubjectIcon } from '@/widgets/SubjectSelector';
import { IconCopyPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useMatchRequestForm } from './useMatchRequestForm';

const SubjectsGrade = () => {
    const { t } = useTranslation();
    const { form, goNext, goBack, onFormChange } = useMatchRequestForm();

    const selectedOptions = form.subjectsOptions.filter((o) => form.subjects.some((s) => s.name === o.subject));

    const getWaitingInGradeRange = (subjectName?: string, minGrade: number = 1, maxGrade: number = 14) => {
        if (!subjectName) return 0;
        const subjectOption = form.subjectsOptions.find((o) => o.subject === subjectName);
        if (!subjectOption) return 0;
        return subjectOption.gradesAvailable?.filter((g) => g >= minGrade && g <= maxGrade).length ?? 0;
    };

    const copyToAllSubjects = (minGrade: number, maxGrade: number) => {
        onFormChange({
            subjects: form.subjects.map((s) => ({ ...s, grade: { min: minGrade, max: maxGrade } })),
        });
    };

    const ranges = selectedOptions.map((option) => {
        const subject = form.subjects.find((s) => s.name === option.subject);
        return { min: subject?.grade?.min ?? 1, max: subject?.grade?.max ?? 14 };
    });

    const isCopyDisabled = selectedOptions.length <= 1 || ranges.every((range) => range.min === ranges[0].min && range.max === ranges[0].max);

    return (
        <MatchRequestStep onNext={goNext} onBack={goBack}>
            <div className="flex flex-col justify-between xl:flex-row gap-y-4 gap-x-4 mb-6">
                <MatchRequestStepTitle className="my-0">{t('matching.wizard.grades.heading')}</MatchRequestStepTitle>
            </div>
            <div className="flex gap-4 flex-wrap">
                {selectedOptions.map((option) => {
                    const subject = form.subjects.find((s) => s.name === option.subject);
                    return (
                        <div className="w-[560px] rounded-md p-4 gap-2 border border-accent-dark" key={option.subject}>
                            <div className="flex justify-between">
                                <div className="flex gap-x-[14px] mb-6">
                                    <div className="w-10 h-10 shrink-0 bg-accent-medium rounded-full flex items-center justify-center group-data-[state=on]:bg-green-200">
                                        <SubjectIcon subject={option.subject as any} className={cn('rounded-full size-6 flex-shrink-0')} />
                                    </div>
                                    <div className="w-full">
                                        <Typography variant="subtle" className="font-semibold leading-1 mb-1 truncate">
                                            {t(`lernfair.subjects.${option.subject}` as unknown as TemplateStringsArray)}
                                        </Typography>
                                        <Badge className="shadow-none text-[12px] font-normal px-[7px] h-5">
                                            {t('peopleWaiting', { count: option.pupilsWaiting })}
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    className="hidden md:flex font-normal"
                                    size="xs"
                                    variant="ghost"
                                    leftIcon={<IconCopyPlus size={16} />}
                                    onClick={() => copyToAllSubjects(subject?.grade?.min ?? 1, subject?.grade?.max ?? 14)}
                                    disabled={isCopyDisabled}
                                >
                                    Für alle Fächer übernehmen
                                </Button>
                            </div>
                            <div className="mb-4">
                                <Typography variant="subtle" className="mb-3 text-primary-midnight">
                                    {getGradeLabel(subject?.grade?.min ?? 1)} - {getGradeLabel(subject?.grade?.max ?? 14)} (
                                    {t('peopleWaiting', {
                                        count: getWaitingInGradeRange(subject?.name, subject?.grade?.min, subject?.grade?.max),
                                    })}
                                    )
                                </Typography>
                                <Slider
                                    id="gradeSlider"
                                    min={1}
                                    max={14}
                                    onValueChange={([min, max]) =>
                                        onFormChange({
                                            subjects: form.subjects.map((s) => (s.name === subject?.name ? { ...s, grade: { min, max } } : s)),
                                        })
                                    }
                                    value={[subject?.grade?.min ?? 1, subject?.grade?.max ?? 14]}
                                />
                            </div>
                            <div
                                className="md:hidden inline-block py-2 h-auto w-auto"
                                onClick={() => copyToAllSubjects(subject?.grade?.min ?? 1, subject?.grade?.max ?? 14)}
                            >
                                <Button
                                    className="font-normal"
                                    size="xs"
                                    variant="ghost"
                                    leftIcon={<IconCopyPlus size={16} />}
                                    onClick={() => copyToAllSubjects(subject?.grade?.min ?? 1, subject?.grade?.max ?? 14)}
                                    disabled={isCopyDisabled}
                                >
                                    Für alle Fächer übernehmen
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </MatchRequestStep>
    );
};
export default SubjectsGrade;
