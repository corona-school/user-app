import { VStack, Heading, HStack, Button, TextArea, useTheme, Stack, useMediaQuery } from 'native-base';
import { Pupil_Screening_Status_Enum } from '../../gql/graphql';
import { PupilForScreening } from '../../types';
import HSection from '../HSection';
import { MatchStudentCard } from '../matching/MatchStudentCard';
import { PupilScreeningCard } from './PupilScreeningCard';

export function ScreenPupilCard({ pupil }: { pupil: PupilForScreening }) {
    const { space } = useTheme();

    return (
        <VStack>
            <Heading paddingTop="50px" paddingBottom="20px" fontSize="30px">
                Schülerscreening / {pupil.firstname} {pupil.lastname}
            </Heading>
            <HStack space={space['1']} display="flex">
                <Button isDisabled>Annehmen</Button>
                <Button isDisabled variant="outline">
                    Ablehnen - Zu Kursen
                </Button>
                <Button isDisabled variant="outline">
                    Ablehnen
                </Button>
            </HStack>
            <VStack space={space['2']} paddingTop="20px">
                <VStack flexGrow="1" space={space['1']}>
                    <TextArea minH="500px" width="100%" autoCompleteType="" />
                    <Button isDisabled variant="outline">
                        Speichern & Vier Augen
                    </Button>
                </VStack>
                <HStack space={space['2']}>
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
                    <VStack>
                        <Heading>Vorherige Screenings</Heading>
                        {pupil!.screenings!.map((screening) => (
                            <PupilScreeningCard pupil={pupil} screening={screening} />
                        ))}
                        <PupilScreeningCard
                            pupil={pupil}
                            screening={{ createdAt: new Date(), invalidated: true, status: Pupil_Screening_Status_Enum.Pending, comment: 'Kommentar von Maxi' }}
                        />
                        <PupilScreeningCard
                            pupil={pupil}
                            screening={{ createdAt: new Date(), invalidated: true, status: Pupil_Screening_Status_Enum.Success, comment: 'Kommentar von Maxi' }}
                        />
                        <PupilScreeningCard
                            pupil={pupil}
                            screening={{
                                createdAt: new Date(),
                                invalidated: true,
                                status: Pupil_Screening_Status_Enum.Rejection,
                                comment: 'Kommentar von Maxi',
                            }}
                        />
                    </VStack>
                </HStack>
            </VStack>
        </VStack>
    );
}
