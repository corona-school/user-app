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

const StudentSubjects = () => {
    const { goNext, form, onFormChange } = useMatchRequestForm();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleOnSubjectsChange = (subjects: SingleSubject[]) => {
        onFormChange({ subjects: subjects.map((s) => ({ name: s, mandatory: false })) });
    };

    const subjectNames = form.subjects.map((s) => s.name as SingleSubject);

    const options: SubjectOption[] = SUBJECTS.map((e) => ({
        subject: e,
        pupilsWaiting: form.subjectsOptions.find((o) => o.subject === e)?.pupilsWaiting ?? 0,
        gradesAvailable: form.subjectsOptions.find((o) => o.subject === e)?.gradesAvailable ?? [],
    })).sort((a, b) => (b.pupilsWaiting ?? 0) - (a.pupilsWaiting ?? 0));

    return (
        <MatchRequestStep onNext={goNext} onBack={() => navigate(-1)} isNextDisabled={form.subjects.length === 0}>
            <div className={cn('flex flex-col justify-between md:items-center xl:flex-row gap-y-4 gap-x-4 mt-11')}>
                <div className="mb-5">
                    <MatchRequestStepTitle className="mt-0">{t('matching.wizard.subjects.heading')}</MatchRequestStepTitle>
                    <Typography variant="subtle">
                        <Trans
                            i18nKey="matching.wizard.subjects.student.subheading"
                            values={{
                                pupilCount: form.subjectsOptions.reduce((acc, s) => acc + (s.pupilsWaiting ?? 0), 0),
                                subjectCount: form.subjectsOptions.length,
                            }}
                            components={{ b: <b /> }}
                            t={t}
                        />
                    </Typography>
                </div>
                <Alert variant="warning" className="max-w-[755px] mb-4 max-h-12" icon={<IconInfoCircleFilled size={24} />}>
                    {t('matching.wizard.subjects.student.dazBannerText')}
                </Alert>
            </div>
            <SubjectsSelector
                showPupilsWaiting
                showGradesAvailable
                onChange={handleOnSubjectsChange}
                multiple
                value={subjectNames as SingleSubject[]}
                options={options}
                initialVisibleOptions={form.subjectsOptions.length}
            />
            <Alert variant="indigo" className=" mt-6 md:mt-10 whitespace-break-spaces w-full" icon={<IconBulbFilled size={24} />}>
                <span className="leading-[18px]">{t('matching.wizard.subjects.student.bannerText')}</span>
            </Alert>

            {form.subjects.length > 0 && (
                <div className="flex items-center mt-4">
                    <IconCircleCheckFilled className="text-green-500 inline-block mr-2" size={20} />
                    <div>
                        <Typography variant="subtle">{t('matching.wizard.subjects.selectedSubjects', { count: form.subjects.length })} </Typography>
                    </div>
                </div>
            )}
        </MatchRequestStep>
    );
};
export default StudentSubjects;
