import { useQuery } from '@apollo/client';
import { Card, Heading, HStack, Pressable, Stack, Text, TextArea, useLayout, useTheme, VStack } from 'native-base';
import { Button } from 'native-base';
import { Box } from 'native-base';
import { useState } from 'react';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import HeaderCard from '../../components/HeaderCard';
import SearchBar from '../../components/SearchBar';
import Tag from '../../components/Tag';
import WithNavigation from '../../components/WithNavigation';
import { gql } from '../../gql';
import { PupilForScreening } from '../../types';
import { RequireAuth } from '../../User';
import HSection from '../../widgets/HSection';
import LearningPartner from '../../widgets/LearningPartner';
import { MatchStudentCard } from '../../widgets/matching/MatchStudentCard';
import { ScreenPupilCard } from '../../widgets/screening/ScreenPupilCard';

function PupilCard({ pupil, onClick }: { pupil: PupilForScreening; onClick: () => void }) {
    return (
        <Pressable onPress={onClick}>
            <HStack borderRadius="15px" backgroundColor="primary.100" padding="20px" minW="400px">
                <VStack>
                    <Heading>
                        {pupil.firstname} {pupil.lastname}
                    </Heading>
                    {pupil!.matches!.length && <Tag text="Hat Lernpaar" />}
                    {pupil!.screenings!.some((it) => !it!.invalidated && it!.status === 'dispute') && <Tag text="Unklares Screening" />}
                    {pupil!.screenings!.some((it) => !it!.invalidated && it!.status === 'pending' && <Tag text="Ausstehendes Screening" />)}
                    {pupil!.screenings!.some((it) => it!.status === 'success') && <Tag text="Erfolgreiches Screening" />}
                    {pupil!.screenings!.some((it) => it!.status === 'rejection') && <Tag text="Screening nicht erfolgreich" />}
                </VStack>
            </HStack>
        </Pressable>
    );
}

export function ScreeningDashboard() {
    const { space, sizes } = useTheme();

    const [searchQuery, setSearchQuery] = useState('');
    const { data: searchResult, loading: searchLoading } = useQuery(
        gql(`
        query ScreenerSearchUsers($search: String!) {
            usersSearch(query: $search, take: 1) {
                pupil { 
                    firstname
                    lastname
                    matches {
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
        <WithNavigation headerTitle="Screening" showBack hideMenu>
            <VStack paddingX={space['1']} marginX="auto" width="100%" maxWidth={sizes['containerWidth']}>
                <SearchBar
                    onSearch={(search) => {
                        setSearchQuery(search);
                        setSelectedPupil(null);
                    }}
                />
                {searchLoading && <CenterLoadingSpinner />}
                {searchResult?.usersSearch.length === 0 && <>Nichts gefunden :/</>}
                <HStack marginTop="20px">
                    {searchResult?.usersSearch
                        .filter((it) => it.pupil)
                        .map((it) => (
                            <PupilCard onClick={() => setSelectedPupil(it.pupil!)} pupil={it.pupil!} />
                        ))}
                </HStack>
                {selectedPupil && <ScreenPupilCard pupil={selectedPupil} />}
            </VStack>
        </WithNavigation>
    );
}
