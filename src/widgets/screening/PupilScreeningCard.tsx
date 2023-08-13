import { useTranslation } from 'react-i18next';
import { InfoCard } from '../../components/InfoCard';
import { Pupil_Screening_Status_Enum } from '../../gql/graphql';
import { PupilForScreening, PupilScreening } from '../../types';

export function PupilScreeningCard({ pupil, screening }: { pupil: PupilForScreening; screening: PupilScreening }) {
    const { t } = useTranslation();

    const icon = ({ success: 'yes', rejection: 'no', dispute: 'loki', pending: 'loki' } as const)[screening!.status];
    const background = screening!.status === Pupil_Screening_Status_Enum.Rejection ? 'orange.500' : 'primary.900';
    const title = t(`screening.${screening!.status!}_screening`);

    const message = `am ${new Date(screening!.createdAt).toLocaleDateString()}`;

    return <InfoCard noMargin icon={icon} background={background} title={title} message={message} />;
}
