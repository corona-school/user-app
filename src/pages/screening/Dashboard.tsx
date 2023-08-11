import { useQuery } from '@apollo/client';
import { Card, Heading, HStack, Pressable, Stack, Text, TextArea, useLayout, useTheme, VStack } from 'native-base';
import { Button } from 'native-base';
import { useState } from 'react';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { InfoCard } from '../../components/InfoCard';
import SearchBar from '../../components/SearchBar';
import Tag from '../../components/Tag';
import WithNavigation from '../../components/WithNavigation';
import { gql } from '../../gql';
import { useUser } from '../../hooks/useApollo';
import { PupilForScreening } from '../../types';
import { ScreenPupilCard } from '../../widgets/screening/ScreenPupilCard';

function PupilCard({ pupil, onClick }: { pupil: PupilForScreening; onClick: () => void }) {
    const { space } = useTheme();

    return (
        <Pressable onPress={onClick}>
            <HStack borderRadius="15px" backgroundColor="primary.900" padding="20px" minW="400px">
                <VStack space={space['1.5']}>
                    <VStack space={space['0.5']}>
                        <Heading color="white" fontSize="20px">
                            {pupil.firstname} {pupil.lastname}
                        </Heading>
                        <Text color="white" fontSize="15px">
                            registriert seit {new Date(pupil!.createdAt).toLocaleDateString()}
                        </Text>
                    </VStack>
                    <HStack>
                        {pupil!.matches!.length && <Tag variant="orange" padding="5px" text="Hat Lernpaar" />}
                        {pupil!.screenings!.some((it) => !it!.invalidated && it!.status === 'dispute') && (
                            <Tag variant="secondary-light" text="Unklares Screening" />
                        )}
                        {pupil!.screenings!.some((it) => !it!.invalidated && it!.status === 'pending' && <Tag text="Ausstehendes Screening" />)}
                        {pupil!.screenings!.some((it) => it!.status === 'success') && <Tag text="Erfolgreiches Screening" />}
                        {pupil!.screenings!.some((it) => it!.status === 'rejection') && <Tag text="Screening nicht erfolgreich" />}
                    </HStack>
                </VStack>
            </HStack>
        </Pressable>
    );
}

const greetings = ['Wilkommen', 'Bonjour', 'Hola', 'Salve', 'asalaam alaikum', 'konnichiwa'];

const greeting = greetings[Math.floor(Math.random() * greetings.length)];

export function ScreeningDashboard() {
    const { space, sizes } = useTheme();
    const user = useUser();

    const [searchQuery, setSearchQuery] = useState('');
    const { data: searchResult, loading: searchLoading } = useQuery(
        gql(`
        query ScreenerSearchUsers($search: String!) {
            usersSearch(query: $search, take: 1) {
                pupil { 
                    createdAt
                    firstname
                    lastname
                    matches {
                        createdAt
                        student { firstname lastname }
                        dissolved
                        dissolvedAt
                        pupilFirstMatchRequest
                        subjectsFormatted { name }
                    }
                    screenings {
                        invalidated
                        status
                        comment
                        createdAt
                        updatedAt
                    }
                }
            }
        }
    `),
        { skip: !searchQuery, variables: { search: searchQuery } }
    );

    console.log(searchResult);

    const [selectedPupil, setSelectedPupil] = useState<PupilForScreening | null>(null);

    return (
        <WithNavigation headerTitle="Screening" hideMenu>
            <VStack paddingX={space['1']} marginX="auto" width="100%" maxWidth={sizes['containerWidth']}>
                <SearchBar
                    placeholder="Name oder E-Mail eines Schülers oder Helfers"
                    onSearch={(search) => {
                        setSearchQuery(search);
                        setSelectedPupil(null);
                    }}
                />
                {searchLoading && <CenterLoadingSpinner />}
                {searchResult?.usersSearch.length === 0 && (
                    <InfoCard icon="no" title="Nichts gefunden" message="Suche nach dem vollen Namen oder der E-Mail eines Schülers oder Helfers" />
                )}
                {!selectedPupil && (
                    <HStack marginTop="20px">
                        {searchResult?.usersSearch
                            .filter((it) => it.pupil)
                            .map((it) => (
                                <PupilCard onClick={() => setSelectedPupil(it.pupil!)} pupil={it.pupil!} />
                            ))}
                    </HStack>
                )}
                {selectedPupil && <ScreenPupilCard pupil={selectedPupil} />}

                {!searchQuery && !selectedPupil && (
                    <>
                        <InfoCard
                            icon="loki"
                            title={`${greeting}, ${user.firstname}!`}
                            message="Nutze die Suchleiste um den Schüler oder Helfer zu finden den du screenen möchtest."
                        />
                        <HStack space={space['1']} display="flex" flexWrap="wrap">
                            <Button isDisabled>Schüler mit offenen Screenings</Button>
                            <Button isDisabled>Helfer mit offnen Screenings</Button>
                        </HStack>
                    </>
                )}
            </VStack>
        </WithNavigation>
    );
}
