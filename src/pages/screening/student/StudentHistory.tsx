import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { Screening } from '@/gql/graphql';
import { StudentForScreening } from '@/types';
import { SubcourseCard } from '@/widgets/course/SubcourseCard';
import { MatchPupilCard } from '@/widgets/matching/MatchPupilCard';
import { StudentScreeningCard } from '@/widgets/screening/StudentScreeningCard';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';

interface StudentHistoryProps {
    student: StudentForScreening;
}

export const StudentHistory = ({ student }: StudentHistoryProps) => {
    const { t } = useTranslation();
    const [mutationUpdateTutorScreening] = useMutation(
        gql(`
            mutation UpdateTutorScreening($screeningId: Float!, $comment: String) {
                studentTutorScreeningUpdate(screeningId: $screeningId, data: { comment: $comment })
            }
        `)
    );

    const [mutationUpdateInstructorScreening] = useMutation(
        gql(`
            mutation UpdateInstructorScreening($screeningId: Float!, $comment: String) {
                studentInstructorScreeningUpdate(screeningId: $screeningId, data: { comment: $comment })
            }
        `)
    );

    const activeMatches = student!.matches!.filter((it) => !it!.dissolved).sort((a, b) => +new Date(b!.createdAt) - +new Date(a!.createdAt));
    const dissolvedMatches = student.matches!.filter((it) => it!.dissolved).sort((a, b) => +new Date(b!.createdAt) - +new Date(a!.createdAt));

    const handleOnUpdateTutorScreening = (screeningId: number, data: Pick<Screening, 'comment'>) => {
        mutationUpdateTutorScreening({ variables: { screeningId, comment: data.comment } });
    };

    const handleOnUpdateInstructorScreening = (screeningId: number, data: Pick<Screening, 'comment'>) => {
        mutationUpdateInstructorScreening({ variables: { screeningId, comment: data.comment } });
    };

    return (
        <div className="flex flex-col gap-y-6">
            {activeMatches.length > 0 && (
                <div className="flex flex-col gap-y-2">
                    <Typography variant="h6">{t('screening.active_matches')}</Typography>
                    {activeMatches.map((it, id) => (
                        <MatchPupilCard key={id} match={it} />
                    ))}
                </div>
            )}
            {dissolvedMatches.length > 0 && (
                <div className="flex flex-col gap-y-2">
                    <Typography variant="h6">{t('screening.dissolved_matches')}</Typography>
                    {dissolvedMatches.map((it, id) => (
                        <MatchPupilCard key={id} match={it} />
                    ))}
                </div>
            )}
            {student.subcoursesInstructing.length > 0 && (
                <div className="flex flex-col gap-y-2">
                    <Typography variant="h6">{t('screening.their_courses')}</Typography>
                    {student.subcoursesInstructing.map((subcourse) => (
                        <SubcourseCard subcourse={subcourse} />
                    ))}
                </div>
            )}
            {(!!student.tutorScreenings?.length || !!student.instructorScreenings?.length) && (
                <div className="flex flex-col gap-y-2">
                    {((student.tutorScreenings?.length ?? 0) > 0 || (student.instructorScreenings?.length ?? 0) > 0) && (
                        <Typography variant="h6">{t('screening.previous_screenings')}</Typography>
                    )}
                    {student.tutorScreenings?.map((tutorScreening) => (
                        <StudentScreeningCard screeningType="tutor" onUpdate={handleOnUpdateTutorScreening} screening={tutorScreening} />
                    ))}
                    {student.instructorScreenings?.map((instructorScreening) => (
                        <StudentScreeningCard screeningType="instructor" onUpdate={handleOnUpdateInstructorScreening} screening={instructorScreening} />
                    ))}
                </div>
            )}
        </div>
    );
};
