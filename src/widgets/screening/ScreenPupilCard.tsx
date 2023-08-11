import { VStack, Heading, HStack, Button, TextArea, useTheme } from 'native-base';
import { PupilForScreening } from '../../types';
import HSection from '../HSection';
import { MatchStudentCard } from '../matching/MatchStudentCard';

export function ScreenPupilCard({ pupil }: { pupil: PupilForScreening }) {
    const { space } = useTheme();

    return (
        <VStack>
            <Heading paddingTop="50px" paddingBottom="20px" fontSize="30px">
                Schülerscreening - {pupil.firstname} {pupil.lastname}
            </Heading>
            <HStack space={space['1']} display="flex">
                <Button disabled>Annehmen</Button>
                <Button disabled variant="outline">
                    Ablehnen - Zu Kursen
                </Button>
                <Button disabled variant="outline">
                    Ablehnen
                </Button>
            </HStack>
            <HStack space={space['2']} paddingTop="20px">
                <VStack>
                    <TextArea minH="500px" minW="600px" autoCompleteType="" />
                </VStack>
                <VStack>
                    <HSection title="Aktive Zuordnungen">
                        {pupil!
                            .matches!.filter((it) => !it!.dissolved)
                            .map((it) => (
                                <MatchStudentCard match={it} />
                            ))}
                    </HSection>
                    <HSection title="Aufgelöste Zuordnungen">
                        {pupil
                            .matches!.filter((it) => it!.dissolved)
                            .map((it) => (
                                <MatchStudentCard match={it} />
                            ))}
                    </HSection>
                </VStack>
            </HStack>
        </VStack>
    );
}
