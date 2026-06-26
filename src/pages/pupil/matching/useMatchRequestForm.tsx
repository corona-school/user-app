import { gql } from '@/gql';
import { Subject, CalendarPreferences, Language, SchoolType, SubjectDistribution, Learning_Offer_Constraints_Enum } from '@/gql/graphql';
import { logError } from '@/log';
import { Appointment } from '@/types/lernfair/Appointment';
import { SingleSubject } from '@/types/subject';
import { useMutation, useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { pupilMatchRequestFlow, MatchRequestStep } from './util';

interface MatchRequestForm {
    subjects: Subject[];
    languages: Language[];
    grade: number;
    calendarPreferences?: CalendarPreferences;
    currentStep?: MatchRequestStep;
    schooltype?: SchoolType;
    screeningAppointment?: Appointment & {
        actionUrls: {
            cancelUrl?: string | null;
            rescheduleUrl?: string | null;
        };
    };
    needScreening?: boolean;
    isCompleted?: boolean;
    isEdit?: boolean;
    isAppointmentStepForced?: boolean;
    subjectsOptions?: SubjectDistribution[];
    userType?: 'pupil' | 'student';
    learningOfferConstraints?: Learning_Offer_Constraints_Enum[];
}

interface MatchRequestContextValue {
    form: MatchRequestForm;
    onFormChange: (data: Partial<MatchRequestForm>) => void;
    isLoading: boolean;
    isRefetching?: boolean;
    goNext: () => void;
    goBack: () => void;
    refetch: () => void;
    createMatchRequest: () => Promise<any>;
}

const emptyState: MatchRequestForm = {
    subjects: [],
    languages: [],
    grade: 0,
    currentStep: MatchRequestStep.subjects,
    userType: 'pupil',
    learningOfferConstraints: [],
};

const MatchRequestContext = createContext<MatchRequestContextValue>({
    form: emptyState,
    onFormChange: () => {},
    isLoading: false,
    isRefetching: false,
    goNext: () => {},
    goBack: () => {},
    refetch: () => {},
    createMatchRequest: async () => {},
});

const MATCH_REQUEST_INFO_QUERY = gql(`
    query PupilMatchRequestInfo {
        me {
            pupil {
                schooltype
                gradeAsInt
                state
                openMatchRequestCount
                subjectsFormatted { name mandatory }
                calendarPreferences
                languages
                needScreening
                learningOfferConstraints
                screenings {
                    status,
                    invalidated
                    appointment {
                        id,
                        title,
                        description,
                        start,
                        override_meeting_link,
                        duration,
                        appointmentType
                    }
                }
            }
        }
    }
`);

const PUPIL_SUBJECTS_QUERY = gql(`
    query PupilSubjects {
        subjectsForPupils {
            subject
            waitingDaysRange { from, to }
        }
    }
`);

const ME_UPDATE_MUTATION = gql(`
    mutation changePupilMatchingInfoData($languages: [Language!], $calendarPreferences: CalendarPreferences, $gradeAsInt: Int, $schooltype: SchoolType, $subjects: [SubjectInput!]) {
        meUpdate(update: { pupil: { languages: $languages, calendarPreferences: $calendarPreferences, gradeAsInt: $gradeAsInt, schooltype: $schooltype, subjects: $subjects } })
    }
`);

const CREATE_PUPIL_MATCH_REQUEST_MUTATION = gql(`
    mutation PupilCreateMatchRequest {
        pupilCreateMatchRequest
    }
`);

export const MatchRequestProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { data, refetch, networkStatus } = useQuery(MATCH_REQUEST_INFO_QUERY, { notifyOnNetworkStatusChange: true });
    const [meUpdate] = useMutation(ME_UPDATE_MUTATION);
    const [createMatchRequest] = useMutation(CREATE_PUPIL_MATCH_REQUEST_MUTATION);
    const { data: subjectsData } = useQuery(PUPIL_SUBJECTS_QUERY, { skip: !data?.me.pupil });
    const [values, setValues] = useState<MatchRequestForm>(emptyState);
    const currentStepIndex = values.currentStep ? pupilMatchRequestFlow.indexOf(values.currentStep) : -1;
    const location = useLocation();
    const isAppointmentStepForced = location.pathname.split('/').includes('screening-appointment');
    const getNextStepFrom = (step: MatchRequestStep) => {
        const currentIndex = pupilMatchRequestFlow.indexOf(step);
        return pupilMatchRequestFlow[currentIndex + 1];
    };

    const getPrevStepFrom = (step: MatchRequestStep) => {
        const currentIndex = pupilMatchRequestFlow.indexOf(step);
        return pupilMatchRequestFlow[currentIndex - 1];
    };

    const handleOnChange = (data: Partial<MatchRequestForm>) => {
        setValues((values) => ({ ...values, ...data }));
    };

    const needsHelpInGerman = values.learningOfferConstraints?.includes(Learning_Offer_Constraints_Enum.DazSubjectRequiredForMatching);
    const hasOnlyOneSubject = values.subjects.length <= 1;
    const handleOnNext = async () => {
        if (currentStepIndex === -1 || !values.currentStep) return;
        if (isAppointmentStepForced) {
            handleOnChange({ currentStep: MatchRequestStep.bookScreeningAppointment, isCompleted: true });
        }
        let nextStep = getNextStepFrom(values.currentStep);

        // ------------------------ Logic to determine which step to go to next based on the current values ------------------------
        if (nextStep === MatchRequestStep.priority) {
            if (needsHelpInGerman || hasOnlyOneSubject) {
                nextStep = getNextStepFrom(nextStep); // skip priority
            }
        }

        // ------------------------ Save data from the current step before going to the next one ------------------------
        if (values.currentStep === MatchRequestStep.updateData) {
            try {
                await meUpdate({
                    variables: {
                        calendarPreferences: values.calendarPreferences,
                        languages: values.languages,
                        gradeAsInt: values.grade,
                        schooltype: values.schooltype,
                    },
                });
            } catch (error: any) {
                logError('[matchRequest]', error?.message, error);
            }
        } else if ([MatchRequestStep.subjects, MatchRequestStep.priority].includes(values.currentStep)) {
            try {
                await meUpdate({
                    variables: {
                        subjects: values.subjects.map((it) => ({ name: it.name, mandatory: it.mandatory })),
                    },
                });
            } catch (error: any) {
                logError('[matchRequest]', error?.message, error);
            }
        }

        // ------------------------ If needed. Create match request and mark the flow as complete ------------------------
        if (nextStep === MatchRequestStep.bookScreeningAppointment && (!values.needScreening || values.isEdit)) {
            if (!values.needScreening && !data?.me.pupil?.openMatchRequestCount && !values.isEdit) {
                await createMatchRequest();
            }
            handleOnChange({ isCompleted: true });
            return;
        } else if (values.currentStep === MatchRequestStep.bookScreeningAppointment) {
            handleOnChange({ isCompleted: true });
            return;
        }

        handleOnChange({ currentStep: nextStep });
    };

    const handleOnBack = () => {
        if (currentStepIndex === -1 || !values.currentStep) return;
        let previousStep = pupilMatchRequestFlow[currentStepIndex - 1];

        // Do the same logic as in handleOnNext but reversed to determine which step to go back to
        if (previousStep === MatchRequestStep.priority) {
            if (needsHelpInGerman || hasOnlyOneSubject) {
                previousStep = getPrevStepFrom(previousStep); // skip priority
            }
        }
        handleOnChange({ currentStep: previousStep });
    };

    useEffect(() => {
        if (!data) return;
        const pupil = data.me.pupil;
        const currentBookedScreening = data?.me.pupil?.screenings?.find((e) => ['pending', 'dispute'].includes(e.status) && !e.invalidated);
        handleOnChange({
            subjects: pupil?.subjectsFormatted.map((it: any) => ({ name: it.name, mandatory: it.mandatory })) ?? [],
            languages: (pupil?.languages as unknown as Language[]) ?? [],
            grade: pupil?.gradeAsInt ?? 0,
            calendarPreferences: pupil?.calendarPreferences || undefined,
            schooltype: (pupil?.schooltype as unknown as SchoolType) || undefined,
            screeningAppointment: currentBookedScreening?.appointment as any,
            needScreening: pupil?.needScreening ?? false,
            learningOfferConstraints: pupil?.learningOfferConstraints,
        });
        setIsLoading(false);
    }, [data]);

    if (data?.me.pupil?.openMatchRequestCount !== undefined && data?.me.pupil?.openMatchRequestCount === 0 && isAppointmentStepForced) {
        return <Navigate to="/request-match" replace />;
    }

    return (
        <MatchRequestContext.Provider
            value={{
                form: {
                    ...values,
                    isAppointmentStepForced: isAppointmentStepForced,
                    currentStep: isAppointmentStepForced ? MatchRequestStep.bookScreeningAppointment : values.currentStep,
                    isCompleted: isAppointmentStepForced && values.screeningAppointment ? true : values.isCompleted,
                    subjectsOptions: subjectsData?.subjectsForPupils,
                },
                onFormChange: handleOnChange,
                isLoading: isLoading,
                isRefetching: networkStatus === 4,
                goNext: handleOnNext,
                goBack: handleOnBack,
                refetch,
                createMatchRequest,
            }}
        >
            {children}
        </MatchRequestContext.Provider>
    );
};

export const useMatchRequestForm = () => {
    const context = useContext(MatchRequestContext);
    return context;
};
