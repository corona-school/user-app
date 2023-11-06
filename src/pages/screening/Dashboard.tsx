import { useQuery } from '@apollo/client';
import { Card, Heading, HStack, Pressable, Stack, Text, TextArea, useLayout, useTheme, VStack } from 'native-base';
import { Button } from 'native-base';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { InfoCard } from '../../components/InfoCard';
import SearchBar from '../../components/SearchBar';
import Tag from '../../components/Tag';
import WithNavigation from '../../components/WithNavigation';
import { gql } from '../../gql';
import { useUser } from '../../hooks/useApollo';
import { PupilForScreening, StudentForScreening } from '../../types';
import { ScreenPupilCard } from '../../widgets/screening/ScreenPupilCard';
import { ScreenStudentCard } from '../../widgets/screening/ScreenStudentCard';

function PupilCard({ pupil, onClick }: { pupil: PupilForScreening; onClick: () => void }) {
    const { space } = useTheme();
    const { t } = useTranslation();

    return (
        <Pressable onPress={onClick}>
            <HStack borderRadius="15px" backgroundColor="primary.900" padding="20px" margin="20px" minW="325px">
                <VStack space={space['1.5']}>
                    <VStack space={space['0.5']}>
                        <Heading color="white" fontSize="20px">
                            {pupil.firstname} {pupil.lastname}
                        </Heading>
                        <Text color="white" fontSize="15px">
                            E-Mail: <b>{pupil.email}</b>
                        </Text>
                        <Text color="white" fontSize="15px">
                            {t('screening.registered_since')} {new Date(pupil!.createdAt).toLocaleDateString()}
                        </Text>
                    </VStack>
                    <HStack space={space['0.5']} display="flex" flexWrap="wrap" maxW="270px">
                        {pupil!.matches!.length > 0 && <Tag variant="orange" padding="5px" text={t('screening.has_matches')} />}
                        {pupil!.screenings!.some((it) => !it!.invalidated && it!.status === 'dispute') && (
                            <Tag variant="orange" padding="5px" text={t('screening.dispute_screening')} />
                        )}
                        {pupil!.screenings!.some(
                            (it) =>
                                !it!.invalidated && it!.status === 'pending' && <Tag variant="orange" padding="5px" text={t('screening.pending_screening')} />
                        )}
                        {pupil!.screenings!.some((it) => it!.status === 'success') && (
                            <Tag variant="orange" padding="5px" text={t('screening.success_screening')} />
                        )}
                        {pupil!.screenings!.some((it) => it!.status === 'rejection') && (
                            <Tag variant="orange" padding="5px" text={t('screening.rejection_screening')} />
                        )}
                    </HStack>
                </VStack>
            </HStack>
        </Pressable>
    );
}

function StudentCard({ student, onClick }: { student: StudentForScreening; onClick: () => void }) {
    const { space } = useTheme();
    const { t } = useTranslation();

    return (
        <Pressable onPress={onClick}>
            <HStack borderRadius="15px" backgroundColor="primary.400" padding="20px" margin="20px" minW="325px">
                <VStack space={space['1.5']}>
                    <VStack space={space['0.5']}>
                        <Heading color="white" fontSize="20px">
                            {student.firstname} {student.lastname}
                        </Heading>
                        <Text color="white" fontSize="15px">
                            E-Mail: <b>{/* student.email */ ''}</b>
                        </Text>
                        <Text color="white" fontSize="15px">
                            {t('screening.registered_since')} {new Date(student!.createdAt).toLocaleDateString()}
                        </Text>
                    </VStack>
                    <HStack space={space['0.5']} display="flex" flexWrap="wrap" maxW="270px">
                        {student!.matches!.length > 0 && <Tag variant="orange" padding="5px" text={t('screening.has_matches')} />}
                        {student.instructorScreenings?.some((it) => it.success) && <Tag variant="orange" padding="5px" text={`gescreenter Kursleiter`} />}
                        {student.tutorScreenings?.some((it) => it.success) && <Tag variant="orange" padding="5px" text={`gescreenter Helfer`} />}
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
    const {
        data: searchResult,
        loading: searchLoading,
        refetch: refetchUserSearch,
    } = useQuery(
        gql(`
        query ScreenerSearchUsers($search: String!) {
            usersSearch(query: $search, take: 10) {
                pupil {
                    active
                    id
                    createdAt
                    firstname
                    lastname
                    email
                    languages
                    subjectsFormatted { name }
                    grade
                    matches {
                        createdAt
                        student { firstname lastname }
                        dissolved
                        dissolvedAt
                        dissolveReasonEnum
                        dissolvedBy
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
                        screeners { firstname lastname }
                    }
                }

                student {
                    active
                    id
                    createdAt
                    firstname
                    lastname
                    languages
                    subjectsFormatted { name grade { min max } }
                    matches {
                        createdAt
                        pupil { firstname lastname }
                        dissolved
                        dissolvedAt
                        dissolveReasonEnum
                        dissolvedBy
                        studentFirstMatchRequest
                        subjectsFormatted { name }
                    }

                    tutorScreenings { createdAt success comment screener { firstname lastname } }
                    instructorScreenings { createdAt success comment screener { firstname lastname } }
                }
            }
        }
    `),
        { skip: !searchQuery, variables: { search: searchQuery }, fetchPolicy: 'no-cache' }
    );

    const { data: disputedScreenings, refetch: refetchDisputedScreenings } = useQuery(
        gql(`
        query GetDisputedScreenings {
            pupilsToBeScreened(onlyDisputed: true) {
                active
                id
                createdAt
                firstname
                lastname
                email
                languages
                subjectsFormatted { name }
                grade
                matches {
                    createdAt
                    student { firstname lastname }
                    dissolved
                    dissolvedAt
                    dissolveReasonEnum
                    dissolvedBy
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
                    screeners { firstname lastname }
                }
            }
        }
    `),
        { fetchPolicy: 'no-cache' }
    );

    const [selectedPupil, setSelectedPupil] = useState<PupilForScreening | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<StudentForScreening | null>(null);

    // Refetch user data when navigating between a certain user and the dashboard
    useEffect(() => {
        refetchDisputedScreenings();
        refetchUserSearch();
    }, [selectedPupil, selectedStudent, refetchDisputedScreenings, refetchUserSearch]);

    // Refresh the currently open screening in case we got new info from the backend:

    useEffect(() => {
        if (disputedScreenings) {
            setSelectedPupil((current) => {
                if (!current) return null;
                const update = disputedScreenings.pupilsToBeScreened.find((it) => it.id === current.id);
                if (update && update !== current) return update;
                return current;
            });
        }
    }, [disputedScreenings, setSelectedPupil]);

    useEffect(() => {
        if (searchResult) {
            setSelectedPupil((current) => {
                if (!current) return null;
                const update = searchResult.usersSearch.find((it) => it.pupil?.id === current.id);
                if (update && update !== current) return update.pupil!;
                return current;
            });

            setSelectedStudent((current) => {
                if (!current) return null;
                const update = searchResult.usersSearch.find((it) => it.student?.id === current.id);
                if (update && update !== current) return update.student!;
                return current;
            });
        }
    }, [searchResult, setSelectedPupil, setSelectedStudent]);

    return (
        <WithNavigation headerTitle={t('screening.title')}>
            <VStack paddingX={space['1']} marginX="auto" width="100%" maxWidth={sizes['containerWidth']}>
                <SearchBar
                    placeholder={t('screening.search.placeholder')}
                    onSearch={(search) => {
                        setSearchQuery(search);
                        setSelectedPupil(null);
                        setSelectedStudent(null);
                    }}
                />
                {searchLoading && <CenterLoadingSpinner />}
                {searchResult?.usersSearch.length === 0 && <InfoCard icon="no" title={t('not_found')} message={t('screening.search.not_found')} />}
                {!selectedPupil && !selectedStudent && (
                    <HStack display="flex" flexWrap="wrap">
                        {searchResult?.usersSearch
                            .filter((it) => it.pupil)
                            .map((it, id) => (
                                <PupilCard key={id} onClick={() => setSelectedPupil(it.pupil!)} pupil={it.pupil!} />
                            ))}
                        {searchResult?.usersSearch
                            .filter((it) => it.student)
                            .map((it, id) => (
                                <StudentCard key={id} onClick={() => setSelectedStudent(it.student!)} student={it.student!} />
                            ))}
                    </HStack>
                )}
                {selectedPupil && (
                    <ScreenPupilCard
                        pupil={selectedPupil}
                        refresh={() => {
                            refetchDisputedScreenings();
                            refetchUserSearch();
                        }}
                    />
                )}
                {selectedStudent && <ScreenStudentCard student={selectedStudent} />}

                {!searchQuery && !selectedPupil && !selectedStudent && (
                    <>
                        <InfoCard key="screening-welcome" icon="loki" title={`${greeting}, ${user.firstname}!`} message={t('screening.howto')} />

                        {disputedScreenings && disputedScreenings.pupilsToBeScreened.length !== 0 && (
                            <>
                                <Heading>{t('screening.disputed_screenings')}</Heading>
                                <VStack marginTop="20px">
                                    {disputedScreenings &&
                                        disputedScreenings.pupilsToBeScreened.map((it, id) => (
                                            <PupilCard key={id} onClick={() => setSelectedPupil(it)} pupil={it} />
                                        ))}
                                </VStack>
                            </>
                        )}
                    </>
                )}
            </VStack>
        </WithNavigation>
    );
}
