import { useTranslation } from 'react-i18next';
import { InfoCard } from '../../components/InfoCard';
import { TutorScreening } from '../../types';

export function TutorScreeningCard({ screening }: { screening: TutorScreening }) {
    const { t } = useTranslation();

    let message = `Entscheidung: ${new Date(screening!.createdAt).toLocaleDateString()}`;

    message += `\nScreener: ${screening!.screener.firstname} ${screening.screener.lastname}`;

    return (
        <InfoCard
            noMargin
            icon={screening.success ? 'yes' : 'no'}
            background={screening.success ? 'primary.900' : 'orange.500'}
            title={screening.success ? `Erfolgreiches Helferscreening` : `Abgelehntes Helferscreening`}
            message={message}
        />
    );
}
