import { useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Box, Stack, useTheme } from 'native-base';
import { createContext, Dispatch, SetStateAction, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import AsNavigationItem from '../../../components/AsNavigationItem';
import NotificationAlert from '../../../components/notifications/NotificationAlert';
import WithNavigation from '../../../components/WithNavigation';
import SchoolClasses from './SchoolClasses';
import Subjects from './Subjects';
import UpdateData from './UpdateData';
import { gql } from '../../../gql';
import { Subject } from '../../../gql/graphql';
import HelpNavigation from '../../../components/HelpNavigation';

const query = gql(`
    query StudentMatchRequestCount {
        me {
            student {
                state
                openMatchRequestCount
                subjectsFormatted { name grade { min max }}
            }
        }
    }
`);

export type MatchRequest = {
    subjects: Subject[];
};

type RequestMatchContextType = {
    matchRequest: MatchRequest;
    setSubject: (value: Subject) => void;
    removeSubject: (name: string) => void;
    setCurrentIndex: Dispatch<SetStateAction<number>>;
    isEdit: boolean;
};
export const RequestMatchContext = createContext<RequestMatchContextType>({
    matchRequest: { subjects: [] },
    setSubject: () => {},
    removeSubject: () => {},
    setCurrentIndex: () => {},
    isEdit: false,
});

const RequestMatching: React.FC = () => {
    const { space } = useTheme();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [matchRequest, setMatchRequest] = useState<MatchRequest>({
        subjects: [],
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

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const location = useLocation();
    const locationState = location.state as { edit: boolean };
    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Helfer Matching',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsEdit(locationState?.edit);
        setIsLoading(false);
    }, [locationState]);

    const { data, loading } = useQuery(query);

    useEffect(() => {
        if (data) {
            setMatchRequest({
                subjects: data.me.student!.subjectsFormatted.map((it) => ({ name: it.name!, grade: { min: it.grade!.min, max: it.grade!.max } })),
            });
        }
    }, [data]);

    return (
        <AsNavigationItem path="matching">
            <WithNavigation
                showBack
                previousFallbackRoute="/matching"
                isLoading={loading || isLoading}
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
            >
                <RequestMatchContext.Provider value={{ matchRequest, setSubject, removeSubject, setCurrentIndex, isEdit }}>
                    {!loading && !isLoading && data && (
                        <Box paddingX={space['1']} paddingBottom={space['1']} pt={6}>
                            {currentIndex === 0 && <UpdateData state={data.me.student!.state} refetchQuery={query} />}
                            {currentIndex === 1 && <Subjects />}
                            {currentIndex === 2 && <SchoolClasses />}
                        </Box>
                    )}
                </RequestMatchContext.Provider>
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default RequestMatching;
