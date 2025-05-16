import { Typography } from '@/components/Typography';
import AvatarPupil from '@/assets/icons/lernfair/avatar_pupil.svg';
import AvatarStudent from '@/assets/icons/lernfair/avatar_student.svg';
import { InstructorScreening, MatchWithPupil, MatchWithStudent, TutorScreening, PupilScreening } from '@/types';
import { Badge } from '@/components/Badge';
import { useTranslation } from 'react-i18next';
import { Student_Screening_Status_Enum } from '@/gql/graphql';

interface UserCardProps {
    user: {
        id: number;
        firstname?: string | null;
        lastname?: string | null;
        email: string;
        matches?: MatchWithStudent[] | MatchWithPupil[];
        instructorScreenings?: InstructorScreening[];
        tutorScreenings?: TutorScreening[];
        pupilScreenings?: PupilScreening[];
    };
    onClick: () => void;
    type: 'pupil' | 'student';
}

const UserCard = ({ user, type, onClick }: UserCardProps) => {
    const { t } = useTranslation();
    return (
        <div
            className="flex flex-col items-center w-full h-full py-4 px-4 border-[0.5px] rounded-sm border-primary-light bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground"
            role="button"
            onClick={onClick}
        >
            <div className="h-auto w-auto">
                {type === 'pupil' ? <AvatarPupil className="size-20 lg:size-10" /> : <AvatarStudent className="size-20 lg:size-10" />}
            </div>
            <div className="flex flex-col w-full">
                <Typography variant="body" className="font-bold text-center">
                    {user.firstname} {user.lastname}
                </Typography>
                <Typography variant="sm" className="text-center">
                    {user.email}
                </Typography>
            </div>
            <div className="flex w-full flex-wrap gap-2 mt-4">
                {!!user?.matches?.length && <Badge>{t('screening.has_matches')}</Badge>}

                {/** Pupil specific tags */}
                {user?.pupilScreenings?.some((it) => !it!.invalidated && it!.status === 'dispute') && <Badge>{t('screening.dispute_screening')}</Badge>}
                {user?.pupilScreenings?.some((it) => !it!.invalidated && it!.status === 'pending') && <Badge>{t('screening.pending_screening')}</Badge>}
                {user?.pupilScreenings?.some((it) => it!.status === 'success') && <Badge>{t('screening.success_screening')}</Badge>}
                {user?.pupilScreenings?.some((it) => it!.status === 'rejection') && <Badge>{t('screening.rejection_screening')}</Badge>}

                {/** Student specific tags */}
                {user?.instructorScreenings?.some((it) => it.status === Student_Screening_Status_Enum.Success) && <Badge>gescreenter Kursleiter</Badge>}
                {user?.tutorScreenings?.some((it) => it.status === Student_Screening_Status_Enum.Success) && <Badge>gescreenter Helfer</Badge>}
            </div>
        </div>
    );
};

export default UserCard;
