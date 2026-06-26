import { SubjectOption, SubjectsSelector } from '@/widgets/SubjectSelector';
import { useTranslation } from 'react-i18next';
import { useMatchRequestForm } from './useMatchRequestForm';
import { MatchRequestStep, MatchRequestStepTitle } from '@/components/match-request/MatchRequestStep';
import { Typography } from '@/components/Typography';
import { Course_Subject_Enum, Learning_Offer_Constraints_Enum } from '@/gql/graphql';
import { Alert } from '@/components/Alert';
import { IconBulbFilled } from '@tabler/icons-react';
import { useMemo } from 'react';

const Subjects: React.FC = () => {
    const { goNext, goBack, form, onFormChange } = useMatchRequestForm();
    const { t } = useTranslation();
    const isDAZ = form.learningOfferConstraints?.includes(Learning_Offer_Constraints_Enum.DazSubjectRequiredForMatching);

    const handleOnSubjectsChange = (subjects: Course_Subject_Enum[]) => {
        if (isDAZ && !subjects.includes(Course_Subject_Enum.DeutschAlsZweitsprache)) {
            onFormChange({
                subjects: [{ name: Course_Subject_Enum.DeutschAlsZweitsprache, mandatory: true }, ...subjects.map((s) => ({ name: s, mandatory: false }))],
            });
            return;
        }
        onFormChange({ subjects: subjects.map((s) => ({ name: s })) });
    };

    const subjectNames = form.subjects.map((s) => s.name as Course_Subject_Enum);
    const value = useMemo(() => {
        if (isDAZ && !subjectNames.includes(Course_Subject_Enum.DeutschAlsZweitsprache)) {
            return [Course_Subject_Enum.DeutschAlsZweitsprache, ...subjectNames];
        }

        return subjectNames;
    }, [subjectNames, isDAZ]);

    return (
        <MatchRequestStep onNext={goNext} onBack={goBack} isNextDisabled={form.subjects.length === 0}>
            <MatchRequestStepTitle>{t('matching.wizard.pupil.subjects.heading')}</MatchRequestStepTitle>
            <Typography variant="h5" className="mb-4">
                {t('matching.wizard.pupil.subjects.subheading')}
            </Typography>
            <SubjectsSelector
                showPupilsWaiting={form.userType === 'student'}
                showGradesAvailable={form.userType === 'student'}
                showWaitingDays={form.userType === 'pupil'}
                onChange={handleOnSubjectsChange}
                multiple
                value={value}
                options={form.subjectsOptions as unknown as SubjectOption[]}
            />
            <Alert variant="indigo" className="mt-10" icon={<IconBulbFilled size={24} className=" text-indigo-500" />}>
                <span className="leading-[18px]">
                    {form.userType === 'pupil' ? t('matching.wizard.pupil.subjects.bannerText') : t('matching.wizard.student.subjects.bannerText')}
                </span>
            </Alert>
        </MatchRequestStep>
    );
};
export default Subjects;
