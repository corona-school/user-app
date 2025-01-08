import { Typography } from '@/components/Typography';
import { MatchWithStudent, PupilScreening } from '@/types';
import { MatchStudentCard } from '@/widgets/matching/MatchStudentCard';
import { PupilScreeningCard } from '@/widgets/screening/PupilScreeningCard';
import { useTranslation } from 'react-i18next';

interface PupilScreeningsHistoryProps {
    screenings: PupilScreening[];
}

export const PupilScreeningsHistory = ({ screenings }: PupilScreeningsHistoryProps) => {
    if (!screenings.length) return null;

    return (
        <div className="flex flex-col gap-y-2">
            {screenings.map((screening, id) => (
                <PupilScreeningCard key={id} screening={screening} />
            ))}
        </div>
    );
};

interface PupilMatchingHistoryProps {
    matches: MatchWithStudent[];
}

export const PupilMatchingHistory = ({ matches }: PupilMatchingHistoryProps) => {
    const { t } = useTranslation();

    const activeMatches = matches!.filter((it) => !it!.dissolved).sort((a, b) => +new Date(b!.createdAt) - +new Date(a!.createdAt));
    const dissolvedMatches = matches!.filter((it) => it!.dissolved).sort((a, b) => +new Date(b!.createdAt) - +new Date(a!.createdAt));

    return (
        <div className="flex flex-col gap-y-6">
            {activeMatches.length > 0 && (
                <div className="flex flex-col gap-y-2">
                    <Typography variant="h6">{t('screening.active_matches')}</Typography>
                    {activeMatches.map((it, id) => (
                        <MatchStudentCard key={id} match={it} />
                    ))}
                </div>
            )}
            {dissolvedMatches.length > 0 && (
                <div className="flex flex-col gap-y-2">
                    <Typography variant="h6">{t('screening.dissolved_matches')}</Typography>
                    {dissolvedMatches.map((it, id) => (
                        <MatchStudentCard key={id} match={it} />
                    ))}
                </div>
            )}
        </div>
    );
};
