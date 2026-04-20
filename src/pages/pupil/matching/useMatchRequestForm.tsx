import { gql } from '@/gql';
import { Subject, CalendarPreferences, Language, SchoolType } from '@/gql/graphql';
import { logError } from '@/log';
import { Appointment } from '@/types/lernfair/Appointment';
import { useMutation, useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { pupilMatchRequestFlow, MatchRequestStep } from './util';

interface MatchRequestForm {
    subjects: Subject[];
    languages: Language[];
    grade: number;
    calendarPreferences?: CalendarPreferences;
    currentStep?: MatchRequestStep;
    schooltype?: SchoolType;
    learningGermanSince?: '<1' | '1-2' | '2-4' | '>4';
    isNativeGermanSpeaker?: boolean;
    shouldSkipSubjectPriority?: boolean;
    screeningAppointment?: Appointment & {
        actionUrls: {
            cancelUrl?: string | null;
            rescheduleUrl?: string | null;
        };
    };
    needScreening?: boolean;
    isCompleted?: boolean;
    isEdit?: boolean;
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
    currentStep: MatchRequestStep.updateData,
    shouldSkipSubjectPriority: false,
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
    const [meUpdate, { loading: isUpdating }] = useMutation(ME_UPDATE_MUTATION);
    const [createMatchRequest] = useMutation(CREATE_PUPIL_MATCH_REQUEST_MUTATION);
    const [values, setValues] = useState<MatchRequestForm>(emptyState);
    const currentStepIndex = values.currentStep ? pupilMatchRequestFlow.indexOf(values.currentStep) : -1;

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

    const needsHelpInGerman = values.isNativeGermanSpeaker === false && ['<1', '1-2', '2-4'].includes(values.learningGermanSince!);
    const hasOnlyOneSubject = values.subjects.length <= 1;
    const handleOnNext = async () => {
        if (currentStepIndex === -1 || !values.currentStep) return;
        let nextStep = getNextStepFrom(values.currentStep);

        // ------------------------ Logic to determine which step to go to next based on the current values ------------------------
        // 1-2 skip priority / skip list
        // 2-4 skip priority
        // >4 no skip
        if (nextStep === MatchRequestStep.subjects) {
            if (values.isNativeGermanSpeaker === false && ['<1', '1-2'].includes(values.learningGermanSince!)) {
                nextStep = getNextStepFrom(nextStep); // skip subjects
            }
        }
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
        } else if (values.currentStep === MatchRequestStep.german) {
            try {
                await meUpdate({
                    variables: {
                        subjects: values.subjects.map((it) => ({ name: it.name, mandatory: it.mandatory })),
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
        if (previousStep === MatchRequestStep.subjects) {
            if (values.isNativeGermanSpeaker === false && ['<1', '1-2'].includes(values.learningGermanSince!)) {
                previousStep = getPrevStepFrom(previousStep); // skip subjects
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
        });
        setIsLoading(false);
    }, [data]);

    return (
        <MatchRequestContext.Provider
            value={{
                form: {
                    ...values,
                    shouldSkipSubjectPriority: values.isNativeGermanSpeaker === false && ['<1', '1-2', '2-4'].includes(values.learningGermanSince!),
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
