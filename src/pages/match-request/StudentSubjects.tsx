import { SubjectOption, SubjectsSelector } from '@/widgets/SubjectSelector';
import { Trans, useTranslation } from 'react-i18next';
import { useMatchRequestForm } from './useMatchRequestForm';
import { MatchRequestStep, MatchRequestStepTitle } from '@/components/match-request/MatchRequestStep';
import { Typography } from '@/components/Typography';
import { Alert } from '@/components/Alert';
import { IconBulbFilled, IconCircleCheckFilled, IconInfoCircleFilled } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/Tailwind';
import { SingleSubject, SUBJECTS } from '@/types/subject';
import { MIN_MAX_GRADE_RANGE } from '@/Utility';
import { usePageTitle } from '@/hooks/usePageTitle';

const StudentSubjects = () => {
    const { goNext, form, onFormChange } = useMatchRequestForm();
    const { t } = useTranslation();
    const navigate = useNavigate();
    usePageTitle(`Neues Lernpaar: Fächer - Helfer*in (App) | Lern-Fair`);
    const handleOnSubjectsChange = (subjects: SingleSubject[]) => {
        const updatedSubjects = subjects.map((name) => {
            const existingSubject = form.subjects.find((subject) => subject.name === name);

            return {
                name,
                grade: existingSubject?.grade ?? MIN_MAX_GRADE_RANGE,
            };
        });
        onFormChange({ subjects: updatedSubjects });
    };

    const subjectNames = form.subjects.map((s) => s.name as SingleSubject);

    const options: SubjectOption[] = SUBJECTS.map((e) => ({
        subject: e,
        pupilsWaiting: form.subjectsOptions.find((o) => o.subject === e)?.pupilsWaiting ?? 0,
        gradesAvailable: form.subjectsOptions.find((o) => o.subject === e)?.gradesAvailable ?? [],
        demandRank: form.subjectsOptions.find((o) => o.subject === e)?.demandRank ?? 2,
    })).sort((a, b) => {
        // Keep the order from the subjectsOptions array, but put subjects that are not in the array at the end
        const indexA = form.subjectsOptions.findIndex((o) => o.subject === a.subject);
        const indexB = form.subjectsOptions.findIndex((o) => o.subject === b.subject);

        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return (
        <MatchRequestStep onNext={goNext} onBack={() => navigate(-1)} isNextDisabled={form.subjects.length === 0} className="gap-y-5 md:gap-y-5">
            <div className={cn('flex flex-col justify-between md:items-center md:flex-row gap-y-4 gap-x-4')}>
                <div className="mb-5">
                    <MatchRequestStepTitle className="mb-2 md:mb-2">{t('matching.wizard.subjects.heading')}</MatchRequestStepTitle>
                    <Typography variant="subtle">
                        <Trans
                            i18nKey="matching.wizard.subjects.student.subheading"
                            values={{
                                pupilCount: form.subjectsOptions.reduce((acc, s) => acc + (s.pupilsWaiting ?? 0), 0),
                                subjectCount: form.subjectsOptions.filter((s) => !!s?.pupilsWaiting).length,
                            }}
                            components={{ b: <b /> }}
                            t={t}
                        />
                    </Typography>
                </div>
                <Alert
                    variant="warning"
                    className={cn('max-w-[559px] mb-4 hidden', {
                        flex: subjectNames.includes('Deutsch als Zweitsprache') || subjectNames.includes('Deutsch'),
                    })}
                    icon={<IconInfoCircleFilled size={24} />}
                >
                    <Typography variant="subtle">
                        <Trans
                            i18nKey="matching.wizard.subjects.student.dazBannerText"
                            components={{
                                dazLink: (
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                        href="https://drive.google.com/file/d/1aCqsoymbSUp9vQRMne5LVJgyoSIZ33yw/preview"
                                    >
                                        {t('lernfair.subjects.Deutsch als Zweitsprache')}
                                    </a>
                                ),
                            }}
                            t={t}
                        />
                    </Typography>
                </Alert>
            </div>
            <Alert variant="indigo" className=" mb-6 md:mb-5 whitespace-break-spaces w-full" icon={<IconBulbFilled size={24} />}>
                <span className="leading-[18px]">{t('matching.wizard.subjects.student.bannerText')}</span>
            </Alert>
            <SubjectsSelector
                showPupilsWaiting
                showGradesAvailable
                onChange={handleOnSubjectsChange}
                multiple
                value={subjectNames as SingleSubject[]}
                options={options}
                initialVisibleOptions={options.length}
            />
            {form.subjects.length > 0 && (
                <div className="flex items-center mt-10">
                    <IconCircleCheckFilled className="text-green-500 inline-block mr-2" size={20} />
                    <div>
                        <Typography variant="subtle">{t('matching.wizard.subjects.selectedSubjects', { count: form.subjects.length })}. </Typography>
                    </div>
                </div>
            )}
        </MatchRequestStep>
    );
};
export default StudentSubjects;
