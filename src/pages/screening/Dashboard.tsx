import { useQuery } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { InfoCard } from '../../components/InfoCard';
import SearchBar from '../../components/SearchBar';
import WithNavigation from '../../components/WithNavigation';
import { gql } from '../../gql';
import { useUser } from '../../hooks/useApollo';
import { PupilForScreening, StudentForScreening } from '../../types';
import { useShortcut } from '../../helper/keyboard';
import UserCard from './components/UserCard';
import { Typography } from '@/components/Typography';
import PupilDetail from './pupil/PupilDetail';
import { StudentDetail } from './student/StudentDetail';

const greetings = ['Wilkommen', 'Bonjour', 'Hola', 'Salve', 'asalaam alaikum', 'konnichiwa'];

const greeting = greetings[Math.floor(Math.random() * greetings.length)];

export function ScreeningDashboard() {
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
                    subjectsFormatted { name mandatory }
                    grade
                    gradeAsInt
                    openMatchRequestCount
                    verifiedAt
                    state
                    schooltype
                    onlyMatchWith
                    hasSpecialNeeds
                    descriptionForScreening
                    descriptionForMatch
                    matches {
                        createdAt
                        student { firstname lastname }
                        dissolved
                        dissolvedAt
                        dissolveReasons
                        dissolvedBy
                        pupilFirstMatchRequest
                        subjectsFormatted { name }
                    }
                    screenings {
                        id
                        invalidated
                        status
                        comment
                        knowsCoronaSchoolFrom
                        createdAt
                        updatedAt
                        screeners { firstname lastname }
                    }
                }

                student {
                    active
                    id
                    createdAt
                    email
                    firstname
                    lastname
                    languages
                    subjectsFormatted { name grade { min max } }
                    certificateOfConductDeactivationDate
                    certificateOfConduct {
                        id
                    }
                    hasSpecialExperience
                    gender
                    descriptionForMatch
                    matches {
                        createdAt
                        pupil { firstname lastname }
                        dissolved
                        dissolvedAt
                        dissolveReasons
                        dissolvedBy
                        studentFirstMatchRequest
                        subjectsFormatted { name }
                    }
                    subcoursesInstructing {
                        id
                        published
                        course { name image courseState tags { name } }
                        nextLecture { start duration }
                    }

                    tutorScreenings { id createdAt success comment screener { firstname lastname } }
                    instructorScreenings { id createdAt success comment screener { firstname lastname } }
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
                gradeAsInt
                openMatchRequestCount
                state
                schooltype
                onlyMatchWith
                hasSpecialNeeds
                descriptionForScreening
                descriptionForMatch
                matches {
                    createdAt
                    student { firstname lastname }
                    dissolved
                    dissolvedAt
                    dissolveReasons
                    dissolvedBy
                    pupilFirstMatchRequest
                    subjectsFormatted { name }
                }
                screenings {
                    id
                    invalidated
                    status
                    comment
                    knowsCoronaSchoolFrom
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

    const searchbarRef = useRef<HTMLInputElement>();

    const handleOnRefreshPupils = async () => {
        await Promise.all([refetchDisputedScreenings(), refetchUserSearch()]);
    };

    const handleOnRefreshStudents = async () => {
        await refetchUserSearch();
    };

    useShortcut('KeyF', () => searchbarRef.current?.focus(), [searchbarRef]);

    return (
        <WithNavigation headerTitle={t('screening.title')}>
            <div className="px-2 mx-auto w-full max-w-5xl">
                <SearchBar
                    inputRef={searchbarRef}
                    placeholder={t('screening.search.placeholder')}
                    onSearch={(search) => {
                        setSearchQuery(search);
                        setSelectedPupil(null);
                        setSelectedStudent(null);
                    }}
                />
                {searchLoading && <CenterLoadingSpinner className="my-4" />}
                {searchResult?.usersSearch.length === 0 && <InfoCard icon="no" title={t('not_found')} message={t('screening.search.not_found')} />}
                {!selectedPupil && !selectedStudent && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {searchResult?.usersSearch
                            .filter((it) => it.pupil)
                            .map((it, id) => (
                                <UserCard
                                    key={`pupil/${it.pupil?.id}`}
                                    onClick={() => setSelectedPupil(it.pupil!)}
                                    type="pupil"
                                    user={{ ...it.pupil!, pupilScreenings: it.pupil?.screenings }}
                                />
                            ))}
                        {searchResult?.usersSearch
                            .filter((it) => it.student)
                            .map((it, id) => (
                                <UserCard key={`student/${it.student?.id}`} onClick={() => setSelectedStudent(it.student!)} type="student" user={it.student!} />
                            ))}
                    </div>
                )}
                {selectedPupil && <PupilDetail pupil={selectedPupil} refresh={handleOnRefreshPupils} />}
                {selectedStudent && <StudentDetail student={selectedStudent} refresh={handleOnRefreshStudents} />}

                {!searchQuery && !selectedPupil && !selectedStudent && (
                    <>
                        <InfoCard key="screening-welcome" icon="loki" title={`${greeting}, ${user.firstname}!`} message={t('screening.howto')} />

                        {disputedScreenings && disputedScreenings.pupilsToBeScreened.length !== 0 && (
                            <>
                                <Typography variant="h4">{t('screening.disputed_screenings')}</Typography>
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {disputedScreenings &&
                                        disputedScreenings.pupilsToBeScreened.map((it, id) => (
                                            <UserCard
                                                key={`pupil/${it?.id}`}
                                                onClick={() => setSelectedPupil(it!)}
                                                type="pupil"
                                                user={{ ...it!, pupilScreenings: it?.screenings }}
                                            />
                                        ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </WithNavigation>
    );
}
