import { SubjectOption, SubjectsSelector } from '@/widgets/SubjectSelector';
import { useTranslation } from 'react-i18next';
import { useMatchRequestForm } from './useMatchRequestForm';
import { MatchRequestStep, MatchRequestStepTitle } from '@/components/match-request/MatchRequestStep';
import { Typography } from '@/components/Typography';
import { Learning_Offer_Constraints_Enum } from '@/gql/graphql';
import { Alert } from '@/components/Alert';
import { IconBulbFilled, IconCircleCheckFilled, IconInfoCircleFilled } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/Tailwind';
import { SingleSubject } from '@/types/subject';

const PupilSubjects = () => {
    const { goNext, form, onFormChange } = useMatchRequestForm();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isDAZ = form.learningOfferConstraints?.includes(Learning_Offer_Constraints_Enum.DazSubjectRequiredForMatching);

    useEffect(() => {
        if (isDAZ) {
            const optionalSubjects = form.subjects.filter((s) => s.name !== 'Deutsch als Zweitsprache').map((s) => ({ name: s.name, mandatory: false }));
            onFormChange({
                subjects: [{ name: 'Deutsch als Zweitsprache', mandatory: true }].concat(optionalSubjects),
            });
        }
    }, [isDAZ]);

    const handleOnSubjectsChange = (subjects: SingleSubject[]) => {
        if (isDAZ && !subjects.includes('Deutsch als Zweitsprache')) {
            onFormChange({
                subjects: [{ name: 'Deutsch als Zweitsprache', mandatory: true }, ...subjects.map((s) => ({ name: s, mandatory: false }))],
            });
            return;
        }
        onFormChange({ subjects: subjects.map((s) => ({ name: s, mandatory: false })) });
    };

    const subjectNames = form.subjects.map((s) => s.name as SingleSubject);
    const value = useMemo(() => {
        if (isDAZ && !subjectNames.includes('Deutsch als Zweitsprache')) {
            return ['Deutsch als Zweitsprache', ...subjectNames];
        }

        return subjectNames;
    }, [subjectNames, isDAZ]);

    return (
        <MatchRequestStep onNext={goNext} onBack={() => navigate(-1)} isNextDisabled={form.subjects.length === 0}>
            <div className={cn('flex flex-col justify-between xl:flex-row gap-y-4 gap-x-4 mt-11')}>
                <MatchRequestStepTitle className="mt-0">{t('matching.wizard.subjects.heading')}</MatchRequestStepTitle>
                {isDAZ && (
                    <Alert variant="amber" className="max-w-[755px] mb-4" icon={<IconInfoCircleFilled size={24} />}>
                        <span className="leading-[18px]">{t('matching.wizard.subjects.pupil.dazBannerText')}</span>
                    </Alert>
                )}
            </div>
            <Typography variant="h5" className="mb-4">
                {t('matching.wizard.subjects.pupil.subheading')}
            </Typography>
            <SubjectsSelector
                showWaitingDays
                onChange={handleOnSubjectsChange}
                multiple
                value={value as SingleSubject[]}
                options={form.subjectsOptions as unknown as SubjectOption[]}
            />
            {!isDAZ && (
                <Alert variant="indigo" className=" mt-6 md:mt-10 whitespace-break-spaces w-full" icon={<IconBulbFilled size={24} />}>
                    <span className="leading-[18px]">{t('matching.wizard.subjects.pupil.bannerText')}</span>
                </Alert>
            )}
            {form.subjects.length > 0 && (
                <div className="flex items-center mt-4 md:hidden">
                    <IconCircleCheckFilled className="text-green-500 inline-block mr-2" size={20} />
                    <div>
                        <Typography variant="subtle">{t('matching.wizard.subjects.selectedSubjects', { count: form.subjects.length })}:</Typography>
                        <Typography variant="subtle" className="mt-1">
                            {form.subjects.map((s) => s.name).join(', ')}
                        </Typography>
                    </div>
                </div>
            )}
        </MatchRequestStep>
    );
};
export default PupilSubjects;
