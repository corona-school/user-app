import { useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { createContext, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import AsNavigationItem from '../../../components/AsNavigationItem';
import NotificationAlert from '../../../components/notifications/NotificationAlert';
import WithNavigation from '../../../components/WithNavigation';
import SchoolClasses from './SchoolClasses';
import Subjects from './Subjects';
import UpdateData from './UpdateData';
import { gql } from '../../../gql';
import { Language, Subject } from '../../../gql/graphql';
import SwitchLanguageButton from '../../../components/SwitchLanguageButton';
import { Breadcrumb } from '@/components/Breadcrumb';

const query = gql(`
    query StudentMatchRequestCount {
        me {
            student {
                aboutMe
                state
                openMatchRequestCount
                subjectsFormatted { name grade { min max }}
                calendarPreferences
                languages
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
    isEdit: boolean;
};
export const RequestMatchContext = createContext<RequestMatchContextType>({
    matchRequest: { subjects: [] },
    setSubject: () => {},
    removeSubject: () => {},
    isEdit: false,
});

enum RequestMatchStep {
    profileUpdate = 'profileUpdate',
    subjects = 'subjects',
    schoolClasses = 'schoolClasses',
}

const flow = Object.values(RequestMatchStep);

const RequestMatching: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(RequestMatchStep.profileUpdate);
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

    const currentStepIndex = flow.indexOf(currentStep);

    const handleOnNext = () => {
        if (currentStepIndex === -1) return;
        const nextStep = flow[currentStepIndex + 1];

        setCurrentStep(nextStep);
    };

    const handleOnBack = () => {
        if (currentStepIndex <= 0) return;

        const nextStep = flow[currentStepIndex - 1];

        setCurrentStep(nextStep);
    };

    return (
        <AsNavigationItem path="matching">
            <WithNavigation
                previousFallbackRoute="/matching"
                isLoading={loading || isLoading}
                headerLeft={
                    <div className="flex items-center">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </div>
                }
            >
                <RequestMatchContext.Provider value={{ matchRequest, setSubject, removeSubject, isEdit }}>
                    {!loading && !isLoading && data && (
                        <div className="px-1 pb-1">
                            <Breadcrumb />
                            {currentStep === RequestMatchStep.profileUpdate && (
                                <UpdateData
                                    refetchQuery={query}
                                    onNext={handleOnNext}
                                    onBack={handleOnBack}
                                    profile={{
                                        aboutMe: data.me.student?.aboutMe,
                                        calendarPreferences: data.me.student?.calendarPreferences,
                                        languages: data.me.student?.languages as unknown as Language[],
                                    }}
                                />
                            )}
                            {currentStep === RequestMatchStep.subjects && <Subjects onNext={handleOnNext} onBack={handleOnBack} />}
                            {currentStep === RequestMatchStep.schoolClasses && <SchoolClasses onNext={handleOnNext} onBack={handleOnBack} />}
                        </div>
                    )}
                </RequestMatchContext.Provider>
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default RequestMatching;
