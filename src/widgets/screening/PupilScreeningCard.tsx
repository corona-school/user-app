import { Heading, HStack } from 'native-base';
import { InfoCard } from '../../components/InfoCard';
import { PupilForScreening, PupilScreening } from '../../types';

export function PupilScreeningCard({ pupil, screening }: { pupil: PupilForScreening; screening: PupilScreening }) {
    const icon = ({ success: 'yes', rejection: 'no', dispute: 'loki', pending: 'loki' } as const)[screening!.status];

    return <InfoCard icon={icon} title={`Screening am ${new Date(screening!.createdAt).toLocaleDateString()}`} message={screening!.comment!} />;
}
