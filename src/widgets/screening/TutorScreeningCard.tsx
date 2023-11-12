import { useTranslation } from 'react-i18next';
import { InfoCard } from '../../components/InfoCard';
import { TutorScreening } from '../../types';

export function TutorScreeningCard({ screening }: { screening: TutorScreening }) {
    const { t } = useTranslation();

    let message = `${t('screening.decision')}: ${new Date(screening!.createdAt).toLocaleDateString()}`;

    message += `\n${t('screening.screener')}: ${screening!.screener.firstname} ${screening.screener.lastname}`;
    message += `\n\n${screening.comment ?? ''}`;

    return (
        <InfoCard
            noMargin
            icon={screening.success ? 'yes' : 'no'}
            background={screening.success ? 'primary.900' : 'orange.500'}
            title={screening.success ? t('screening.successful_tutor_screening') : t('screening.rejected_tutor_screening')}
            message={message}
        />
    );
}
