import { Heading, HStack } from 'native-base';
import { PupilForScreening, PupilScreening } from '../../types';

export function PupilScreeningCard({ pupil, screening }: { pupil: PupilForScreening; screening: PupilScreening }) {
    return (
        <HStack>
            <Heading>Screening am {new Date(screening!.createdAt).toLocaleDateString()}</Heading>
        </HStack>
    );
}
