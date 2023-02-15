import { useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Box, useTheme } from 'native-base';
import { createContext, Dispatch, SetStateAction, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import AsNavigationItem from '../../../components/AsNavigationItem';
import WithNavigation from '../../../components/WithNavigation';
import { gql } from '../../../gql';
import { Subject } from '../../../gql/graphql';
import Details from './Details';
import Filter from './Filter';
import German from './German';
import Priority from './Priority';
import Subjects from './Subjects';
import UpdateData from './UpdateData';

const query = gql(`
    query PupilMatchRequestInfo {
        me {
            pupil {
                schooltype
                gradeAsInt
                state
                openMatchRequestCount
                subjectsFormatted { name mandatory }
            }
        }
    }
`);

export type MatchRequest = {
    subjects: Subject[];
    message: string;
};

type RequestMatchContextType = {
    matchRequest: MatchRequest;
    setSubject: (value: Subject) => void;
    removeSubject: (name: string) => void;
    setMessage: (message: string) => void;
    setCurrentIndex: Dispatch<SetStateAction<number>>;
    isEdit: boolean;
};
export const RequestMatchContext = createContext<RequestMatchContextType>({
    matchRequest: { subjects: [], message: '' },
    setSubject: () => {},
    removeSubject: () => {},
    setMessage: () => {},
    setCurrentIndex: () => null,
    isEdit: false,
});

const RequestMatch: React.FC = () => {
    const { space } = useTheme();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [matchRequest, setMatchRequest] = useState<MatchRequest>({
        subjects: [],
        message: '',
    });
    const setSubject = useCallback(
        (subject: Subject) =>
            setMatchRequest((prev) => {
                let exists = prev.subjects.some((it) => it.name === subject.name);
                return { ...prev, subjects: exists ? prev.subjects.map((it) => (it.name === subject.name ? subject : it)) : prev.subjects.concat(subject) };
            }),
        [setMatchRequest]
    );
    const removeSubject = useCallback(
        (subjectName: string) => setMatchRequest((prev) => ({ ...prev, subjects: prev.subjects.filter((it) => it.name !== subjectName) })),
        [setMatchRequest]
    );
    const setMessage = useCallback((message: string) => setMatchRequest((prev) => ({ ...prev, message })), [setMatchRequest]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const location = useLocation();
    const locationState = location.state as { edit: boolean };
    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler Matching',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsEdit(locationState?.edit);
        if (locationState?.edit) {
            setCurrentIndex(1);
        }
        setIsLoading(false);
    }, [locationState]);

    const { data, loading } = useQuery(query);

    useEffect(() => {
        if (data)
            setMatchRequest({
                subjects: data.me.pupil!.subjectsFormatted.map((it) => ({ name: it.name, mandatory: it.mandatory })),
                message: '',
            });
    }, [data]);

    return (
        <AsNavigationItem path="matching">
            <WithNavigation showBack isLoading={loading || isLoading}>
                <RequestMatchContext.Provider value={{ isEdit, matchRequest, setSubject, removeSubject, setCurrentIndex, setMessage }}>
                    {!loading && !isLoading && data && (
                        <Box paddingX={space['1']} paddingBottom={space['1']}>
                            {currentIndex === 0 && <Filter />}
                            {currentIndex === 1 && (
                                <UpdateData
                                    schooltype={data.me.pupil!.schooltype}
                                    gradeAsInt={data.me.pupil!.gradeAsInt}
                                    state={data.me.pupil!.state}
                                    refetchQuery={query}
                                />
                            )}
                            {currentIndex === 2 && <German />}
                            {currentIndex === 3 && <Subjects />}
                            {currentIndex === 4 && <Priority />}
                            {currentIndex === 5 && <Details />}
                        </Box>
                    )}
                </RequestMatchContext.Provider>
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default RequestMatch;
