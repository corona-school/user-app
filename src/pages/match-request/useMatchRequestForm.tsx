import { combineSpecialExperience, SpecialTeachingExperienceEnum, splitSpecialExperience } from '@/components/SpecialTeachingExperienceSelector';
import { TeachingExperienceLevelEnum } from '@/components/TeachingExperienceLevelSelector';
import { gql } from '@/gql';
import { Subject, CalendarPreferences, Language, SchoolType, Learning_Offer_Constraints_Enum, StudentLanguage } from '@/gql/graphql';
import { useUserType } from '@/hooks/useApollo';
import { logError } from '@/log';
import { Appointment } from '@/types/lernfair/Appointment';
import { MIN_MAX_GRADE_RANGE } from '@/Utility';
import { SubjectOption } from '@/widgets/SubjectSelector';
import { useMutation, useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { pupilMatchRequestFlow, studentMatchRequestFlow, MatchRequestStep } from './util';

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
    subjectsOptions: SubjectOption[];
    userType?: 'pupil' | 'student';
    learningOfferConstraints?: Learning_Offer_Constraints_Enum[];
    teachingExperience: {
        '1:1': TeachingExperienceLevelEnum | undefined;
        group: TeachingExperienceLevelEnum | undefined;
    };
    specialTeachingExperience: {
        selectValues: SpecialTeachingExperienceEnum[];
        freeTextValue: string;
    };
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
    learningOfferConstraints: [],
    subjectsOptions: [],
    teachingExperience: {
        '1:1': undefined,
        group: undefined,
    },
    specialTeachingExperience: {
        selectValues: [],
        freeTextValue: '',
    },
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
    query MatchRequestInfo {
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
            student {
                languages
                calendarPreferences
                subjectsFormatted { name grade { min, max } }
                specialTeachingExperience
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

const STUDENT_SUBJECTS_QUERY = gql(`
    query StudentSubjects {
        subjectsForStudents {
            subject
            pupilsWaiting
            gradesAvailable
        }
    }
`);

const ME_UPDATE_PUPIL = gql(`
    mutation changePupilMatchingInfoData($languages: [Language!], $calendarPreferences: CalendarPreferences, $gradeAsInt: Int, $schooltype: SchoolType, $subjects: [SubjectInput!]) {
        meUpdate(update: { pupil: { languages: $languages, calendarPreferences: $calendarPreferences, gradeAsInt: $gradeAsInt, schooltype: $schooltype, subjects: $subjects } })
    }
`);

const ME_UPDATE_STUDENT = gql(`
    mutation changeStudentMatchingInfoData($languages: [StudentLanguage!], $calendarPreferences: CalendarPreferences, $subjects: [SubjectInput!], $specialTeachingExperience: [String!]) {
        meUpdate(update: { student: { languages: $languages, calendarPreferences: $calendarPreferences, subjects: $subjects, specialTeachingExperience: $specialTeachingExperience } })
    }
`);

const CREATE_PUPIL_MATCH_REQUEST_MUTATION = gql(`
    mutation PupilCreateMatchRequest {
        pupilCreateMatchRequest
    }
`);

const CREATE_STUDENT_MATCH_REQUEST_MUTATION = gql(`
    mutation StudentCreateMatchRequest {
        studentCreateMatchRequest
    }
`);

export const MatchRequestProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { data, refetch, networkStatus } = useQuery(MATCH_REQUEST_INFO_QUERY, { notifyOnNetworkStatusChange: true });
    const [meUpdatePupil] = useMutation(ME_UPDATE_PUPIL);
    const [meUpdateStudent] = useMutation(ME_UPDATE_STUDENT);
    const [createPupilMatchRequest] = useMutation(CREATE_PUPIL_MATCH_REQUEST_MUTATION);
    const [createStudentMatchRequest] = useMutation(CREATE_STUDENT_MATCH_REQUEST_MUTATION);
    const { data: pupilSubjectsData } = useQuery(PUPIL_SUBJECTS_QUERY, { skip: !data?.me.pupil });
    const { data: studentSubjectsData } = useQuery(STUDENT_SUBJECTS_QUERY, { skip: !data?.me.student });
    const [values, setValues] = useState<MatchRequestForm>(emptyState);
    const flow = values.userType === 'pupil' ? pupilMatchRequestFlow : studentMatchRequestFlow;
    const currentStepIndex = values.currentStep ? flow.indexOf(values.currentStep) : -1;
    const location = useLocation();
    const userType = useUserType();
    const isAppointmentStepForced = location.pathname.split('/').includes('screening-appointment') && values.userType === 'pupil';
    const needsHelpInGerman = values.learningOfferConstraints?.includes(Learning_Offer_Constraints_Enum.DazSubjectRequiredForMatching);
    const hasOnlyOneSubject = values.subjects.length <= 1;

    const getNextStepFrom = (step: MatchRequestStep) => {
        const currentIndex = flow.indexOf(step);
        return flow[currentIndex + 1];
    };

    const getPrevStepFrom = (step: MatchRequestStep) => {
        const currentIndex = flow.indexOf(step);
        return flow[currentIndex - 1];
    };

    const handleOnChange = (data: Partial<MatchRequestForm>) => {
        setValues((values) => ({ ...values, ...data }));
    };

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

        // ------------------------ Save current form state ------------------------
        if (values.userType === 'pupil') {
            try {
                await meUpdatePupil({
                    variables: {
                        calendarPreferences: values.calendarPreferences,
                        languages: values.languages,
                        gradeAsInt: values.grade,
                        schooltype: values.schooltype,
                        subjects: values.subjects.map((it) => ({ name: it.name, mandatory: it.mandatory })),
                    },
                });

                // If it's the last step, create the match request and mark the flow as complete
                if (nextStep === MatchRequestStep.bookScreeningAppointment && (!values.needScreening || values.isEdit)) {
                    if (!values.needScreening && !data?.me.pupil?.openMatchRequestCount && !values.isEdit) {
                        await createPupilMatchRequest();
                    }
                    handleOnChange({ isCompleted: true });
                    return;
                } else if (values.currentStep === MatchRequestStep.bookScreeningAppointment) {
                    handleOnChange({ isCompleted: true });
                    return;
                }
            } catch (error: any) {
                logError('[matchRequest]', error?.message, error);
            }
        }

        if (values.userType === 'student') {
            try {
                await meUpdateStudent({
                    variables: {
                        calendarPreferences: values.calendarPreferences,
                        languages: values.languages as unknown as StudentLanguage[],
                        subjects: values.subjects.map((it) => ({ name: it.name, grade: it.grade })),
                        specialTeachingExperience: combineSpecialExperience(
                            values.specialTeachingExperience.selectValues,
                            values.specialTeachingExperience.freeTextValue,
                            values.teachingExperience
                        ),
                    },
                });
                // If it's the last step, create the match request and mark the flow as complete
                if (values.currentStep === MatchRequestStep.updateData) {
                    if (!values.isEdit) {
                        await createStudentMatchRequest();
                    }
                    handleOnChange({ isCompleted: true });
                }
            } catch (error: any) {
                logError('[matchRequest]', error?.message, error);
            }
        }

        handleOnChange({ currentStep: nextStep });
    };

    const handleOnBack = () => {
        if (currentStepIndex === -1 || !values.currentStep) return;
        let previousStep = flow[currentStepIndex - 1];

        // Do the same logic as in handleOnNext but reversed to determine which step to go back to
        if (previousStep === MatchRequestStep.priority) {
            if (needsHelpInGerman || hasOnlyOneSubject) {
                previousStep = getPrevStepFrom(previousStep); // skip priority
            }
        }
        handleOnChange({ currentStep: previousStep });
    };

    // Setup the initial state of the form based on the data from the query and the user type
    useEffect(() => {
        if (!data || !userType || (!pupilSubjectsData && !studentSubjectsData)) return;
        const pupil = data.me.pupil;
        const student = data.me.student;
        const currentBookedScreening = data?.me.pupil?.screenings?.find((e) => ['pending', 'dispute'].includes(e.status) && !e.invalidated);
        const subjectsFormatted = pupil?.subjectsFormatted ?? student?.subjectsFormatted ?? [];
        const languages = pupil?.languages ?? student?.languages ?? [];
        const calendarPreferences = pupil?.calendarPreferences ?? student?.calendarPreferences ?? undefined;
        const { specialTeachingExperience, teachingExperienceLevel, freeText } = splitSpecialExperience(data.me.student?.specialTeachingExperience ?? []);
        handleOnChange({
            subjects:
                subjectsFormatted.map((it: any) => ({
                    name: it.name,
                    mandatory: it.mandatory,
                    grade: { min: it.grade?.min ?? MIN_MAX_GRADE_RANGE.min, max: it.grade?.max ?? MIN_MAX_GRADE_RANGE.max },
                })) ?? [],
            languages: (languages as unknown as Language[]) ?? [],
            grade: pupil?.gradeAsInt ?? 0,
            calendarPreferences: calendarPreferences,
            schooltype: (pupil?.schooltype as unknown as SchoolType) || undefined,
            screeningAppointment: currentBookedScreening?.appointment as any,
            needScreening: pupil?.needScreening ?? false,
            learningOfferConstraints: pupil?.learningOfferConstraints,
            specialTeachingExperience: {
                selectValues: specialTeachingExperience,
                freeTextValue: freeText ?? '',
            },
            teachingExperience: {
                '1:1': teachingExperienceLevel['1:1'],
                group: teachingExperienceLevel.group,
            },
            userType: userType === 'pupil' ? 'pupil' : 'student',
        });
        setIsLoading(false);
    }, [data, userType, pupilSubjectsData, studentSubjectsData]);

    if (data?.me.pupil?.openMatchRequestCount === 0 && isAppointmentStepForced) {
        return <Navigate to="/request-match" replace />;
    }

    const mappedPupilSubjects = pupilSubjectsData?.subjectsForPupils.map((e) => ({ subject: e.subject, waitingDaysRange: e.waitingDaysRange }));
    const mappedStudentSubjects = studentSubjectsData?.subjectsForStudents.map((e) => ({
        subject: e.subject,
        pupilsWaiting: e.pupilsWaiting,
        gradesAvailable: e.gradesAvailable,
    }));
    const subjectsOptions = (values.userType === 'pupil' ? mappedPupilSubjects ?? [] : mappedStudentSubjects ?? []) as SubjectOption[];

    return (
        <MatchRequestContext.Provider
            value={{
                form: {
                    ...values,
                    isAppointmentStepForced: isAppointmentStepForced,
                    currentStep: isAppointmentStepForced ? MatchRequestStep.bookScreeningAppointment : values.currentStep,
                    isCompleted: isAppointmentStepForced && values.screeningAppointment ? true : values.isCompleted,
                    subjectsOptions,
                },
                onFormChange: handleOnChange,
                isLoading: isLoading,
                isRefetching: networkStatus === 4,
                goNext: handleOnNext,
                goBack: handleOnBack,
                refetch,
                createMatchRequest: values.userType === 'pupil' ? createPupilMatchRequest : createStudentMatchRequest,
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
