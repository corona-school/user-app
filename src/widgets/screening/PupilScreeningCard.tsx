import { useTranslation } from 'react-i18next';
import { InfoCard } from '../../components/InfoCard';
import { Pupil_Screening_Status_Enum } from '../../gql/graphql';
import { PupilScreening } from '../../types';

export function PupilScreeningCard({ screening }: { screening: PupilScreening }) {
    const { t } = useTranslation();

    const icon = ({ success: 'yes', rejection: 'no', dispute: 'loki', pending: 'loki' } as const)[screening!.status];
    const background = screening!.status === Pupil_Screening_Status_Enum.Rejection ? 'orange.500' : 'primary.900';
    const title = t(`screening.${screening!.status!}_screening`);

    let message = `Anfrage: ${new Date(screening!.createdAt).toLocaleDateString()}`;
    if (screening!.updatedAt) {
        message += ` Entscheidung: ${new Date(screening!.updatedAt).toLocaleDateString()}`;
    }

    if (screening!.screeners.length) {
        message += `\nScreener: ` + screening!.screeners.map((it) => `${it.firstname} ${it.lastname}`).join(', ');
    }

    return <InfoCard noMargin icon={icon} background={background} title={title} message={message} />;
}
