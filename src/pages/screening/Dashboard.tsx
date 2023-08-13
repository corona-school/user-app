import { useQuery } from '@apollo/client';
import { Card, Heading, HStack, Pressable, Stack, Text, TextArea, useLayout, useTheme, VStack } from 'native-base';
import { Button } from 'native-base';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
                    <HStack space={space['0.5']}>
                        {pupil!.matches!.length && <Tag variant="orange" padding="5px" text="Hat Lernpaar" />}
                        {pupil!.screenings!.some((it) => !it!.invalidated && it!.status === 'dispute') && (
                            <Tag variant="orange" padding="5px" text="Unklares Screening" />
                        )}
                        {pupil!.screenings!.some(
                            (it) => !it!.invalidated && it!.status === 'pending' && <Tag variant="orange" padding="5px" text="Ausstehendes Screening" />
                        )}
                        {pupil!.screenings!.some((it) => it!.status === 'success') && <Tag variant="orange" padding="5px" text="Erfolgreiches Screening" />}
                        {pupil!.screenings!.some((it) => it!.status === 'rejection') && (
                            <Tag variant="orange" padding="5px" text="Screening nicht erfolgreich" />
                        )}
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
    const { t } = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');
    const { data: searchResult, loading: searchLoading } = useQuery(
        gql(`
        query ScreenerSearchUsers($search: String!) {
            usersSearch(query: $search, take: 1) {
                pupil {
                    id
                    createdAt
                    firstname
                    lastname
                    languages
                    subjectsFormatted { name }
                    grade
                    matches {
                        createdAt
                        student { firstname lastname }
                        dissolved
                        dissolvedAt
                        pupilFirstMatchRequest
                        subjectsFormatted { name }
                    }
                    screenings {
                        id
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
        { skip: !searchQuery, variables: { search: searchQuery }, fetchPolicy: 'no-cache' }
    );

    const { data: disputedScreenings } = useQuery(
        gql(`
        query GetDisputedScreenings {
            pupilsToBeScreened(onlyDisputed: true) {
                id
                createdAt
                firstname
                lastname
                languages
                subjectsFormatted { name }
                grade
                matches {
                    createdAt
                    student { firstname lastname }
                    dissolved
                    dissolvedAt
                    pupilFirstMatchRequest
                    subjectsFormatted { name }
                }
                screenings {
                    id
                    invalidated
                    status
                    comment
                    createdAt
                    updatedAt
                }
            }
        }
    `),
        { fetchPolicy: 'no-cache' }
    );

    const [selectedPupil, setSelectedPupil] = useState<PupilForScreening | null>(null);

    return (
        <WithNavigation headerTitle={t('screening.title')}>
            <VStack paddingX={space['1']} marginX="auto" width="100%" maxWidth={sizes['containerWidth']}>
                <SearchBar
                    placeholder={t('screening.search.placeholder')}
                    onSearch={(search) => {
                        setSearchQuery(search);
                        setSelectedPupil(null);
                    }}
                />
                {searchLoading && <CenterLoadingSpinner />}
                {searchResult?.usersSearch.length === 0 && <InfoCard icon="no" title={t('not_found')} message={t('screening.search.not_found')} />}
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
                        <InfoCard key="screening-welcome" icon="loki" title={`${greeting}, ${user.firstname}!`} message={t('screening.howto')} />

                        {disputedScreenings && disputedScreenings.pupilsToBeScreened.length !== 0 && (
                            <>
                                <Heading>{t('screening.disputed_screenings')}</Heading>
                                <HStack marginTop="20px">
                                    {disputedScreenings &&
                                        disputedScreenings.pupilsToBeScreened.map((it) => <PupilCard onClick={() => setSelectedPupil(it)} pupil={it} />)}
                                </HStack>
                            </>
                        )}
                    </>
                )}
            </VStack>
        </WithNavigation>
    );
}
