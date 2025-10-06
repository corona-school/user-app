import { gql } from '@/gql';
import { Language, PupilEmailOwner, SchoolType, School_Schooltype_Enum } from '@/gql/graphql';
import useApollo from '@/hooks/useApollo';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Appointment } from '@/types/lernfair/Appointment';
import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    getIsPupilWaitingScreeningResults,
    getPupilScreeningAppointment,
    getStudentScreeningAppointment,
    PUPIL_FLOW,
    RegistrationStep,
    STUDENT_FLOW,
} from './util';
import { TRAINEE_GRADE } from '@/Utility';

export interface RegistrationForm {
    userType?: 'pupil' | 'student';
    acceptanceCheck: {
        needHelpInSchool?: boolean;
        familyCannotHelp?: boolean;
        familyCannotAffordTutoring?: boolean;
    };
    firstname: string;
    lastname: string;
    age: number;
    isAdult?: boolean;
    languages: Language[];
    emailOwner?: PupilEmailOwner;
    email: string;
    password: string;
    isRegisteringManually: boolean;
    privacyConsent: boolean;
    currentStep?: RegistrationStep;
    screeningAppointment?: Appointment & {
        actionUrls: {
            cancelUrl?: string | null;
            rescheduleUrl?: string | null;
        };
    };
    grade?: number | null;
    school: {
        id?: string;
        name: string;
        zip?: string | null;
        city?: string | null;
        schooltype?: School_Schooltype_Enum | null;
    };
    zipCode: string;
    hasAcceptedRules: boolean;
    isWaitingScreeningResults?: boolean;
}

interface RegistrationContextValue {
    form: RegistrationForm;
    onFormChange: (data: Partial<RegistrationForm>) => void;
    reset: () => void;
    isLoading: boolean;
    refetchProfile: () => void;
    flow: RegistrationStep[];
    goNext: () => void;
    goBack: () => void;
    isWaitingScreeningResults?: boolean;
}

const emptyState: RegistrationForm = {
    acceptanceCheck: {},
    languages: [],
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    privacyConsent: false,
    isRegisteringManually: true,
    age: 0,
    grade: 0,
    school: {
        name: '',
    },
    zipCode: '',
    hasAcceptedRules: false,
};

const RegistrationContext = createContext<RegistrationContextValue>({
    form: emptyState,
    isLoading: false,
    onFormChange: () => {},
    reset: () => {},
    refetchProfile: () => {},
    flow: [],
    goNext: () => {},
    goBack: () => {},
});

const REGISTRATION_PROFILE_QUERY = gql(`  
    query RegistrationProfile {
        me {
            userID
            firstname
            lastname
            email
            pupil {
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
                        actionUrls {
                            cancelUrl
                            rescheduleUrl
                        }
                        appointmentType
                    }
                }
                school {
                    name
                    zip
                    city
                    state
                    schooltype
                }
                verifiedAt
                languages
                emailOwner
                gradeAsInt
            }
            student {
                tutorScreenings { status, appointment { id, title, description, start, appointmentType, override_meeting_link, duration, actionUrls { cancelUrl rescheduleUrl } } }
                instructorScreenings { status, appointment { id, title, description, start, appointmentType, override_meeting_link, duration, actionUrls { cancelUrl rescheduleUrl } } }
                verifiedAt
                languages
                zipCode
            }
        }
    }
`);

const ME_UPDATE_MUTATION = gql(`
    mutation meUpdateRegistrationProfile($gradeAsInt: Int, $school: RegistrationSchool) {
        meUpdate(update: { pupil: { gradeAsInt: $gradeAsInt, school: $school } })
    }
`);

export const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { sessionState, user } = useApollo();
    const [isLoading, setIsLoading] = useState(true);
    const { data, refetch, networkStatus } = useQuery(REGISTRATION_PROFILE_QUERY, { skip: sessionState !== 'logged-in', notifyOnNetworkStatusChange: true });
    const registrationProfile = data?.me;
    const [updateProfile] = useMutation(ME_UPDATE_MUTATION);
    const [values, setValues, removeValues] = useLocalStorage<RegistrationForm>({
        key: 'registration',
        initialValue: {
            ...emptyState,
        },
    });
    const [password, setPassword] = useState('');
    const flow = values.userType === 'pupil' ? PUPIL_FLOW : STUDENT_FLOW;
    const currentStepIndex = values.currentStep ? flow.indexOf(values.currentStep) : -1;

    const getNextStepFrom = (step: RegistrationStep) => {
        const currentIndex = flow.indexOf(step);
        return flow[currentIndex + 1];
    };

    const handleOnChange = ({ password, ...data }: Partial<RegistrationForm>) => {
        if (password !== undefined) {
            setPassword(password);
        }
        setValues({ ...values, ...data });
    };

    const handleOnNext = async () => {
        if (currentStepIndex === -1 || !values.currentStep) return;

        let nextStep = getNextStepFrom(values.currentStep);
        const shouldSkipSchoolType = values.grade === TRAINEE_GRADE || values.school.schooltype;
        const shouldSkipZipCode = values.school.zip && values.zipCode;

        if (values.userType === 'pupil') {
            if (values.currentStep === RegistrationStep.grade) {
                await updateProfile({ variables: { gradeAsInt: values.grade } });
            } else if (values.currentStep === RegistrationStep.zipCode || (values.currentStep === RegistrationStep.school && shouldSkipZipCode)) {
                await updateProfile({
                    variables: {
                        school: {
                            schooltype: values.school?.schooltype as unknown as SchoolType,
                            zip: values.school?.zip ?? values.zipCode?.toString(),
                            city: values.school?.city,
                            name: values.school?.name,
                        },
                    },
                });
            }
        }

        if (nextStep === RegistrationStep.schoolType && shouldSkipSchoolType) {
            nextStep = getNextStepFrom(nextStep); // skip
        }

        if (nextStep === RegistrationStep.zipCode && shouldSkipZipCode) {
            nextStep = getNextStepFrom(nextStep); // skip
        }

        handleOnChange({ currentStep: nextStep });
    };
    const handleOnBack = async () => {
        if (currentStepIndex === -1 || !values.currentStep) return;

        if (values.currentStep === RegistrationStep.userType) {
            reset();
            navigate('/login');
            return;
        }

        const getPrevStepFrom = (step: RegistrationStep) => {
            const currentIndex = flow.indexOf(step);
            return flow[currentIndex - 1];
        };
        let prevStep = getPrevStepFrom(values.currentStep);

        const shouldSkipSchoolType = values.grade === TRAINEE_GRADE || values.school.schooltype;
        const shouldSkipZipCode = values.school.zip && values.zipCode;

        if (prevStep === RegistrationStep.zipCode && shouldSkipZipCode) {
            prevStep = getPrevStepFrom(prevStep); // skip
        }
        if (prevStep === RegistrationStep.schoolType && shouldSkipSchoolType) {
            prevStep = getPrevStepFrom(prevStep); // skip
        }
        handleOnChange({ currentStep: prevStep });
    };

    const reset = () => {
        removeValues();
        setValues({ ...emptyState, currentStep: RegistrationStep.userType });
        setPassword('');
    };

    useEffect(() => {
        // At this point we still don't know what to do with the user as we're checking if it's already logged in or not
        if (sessionState === 'unknown' || networkStatus !== NetworkStatus.ready) return;
        // Login with IDP Scenario / User has a temporary session
        if (sessionState === 'logged-out' && !!user?.userID && !(!!user.pupil || !!user.student)) {
            handleOnChange({
                isRegisteringManually: false,
                email: user.email,
                firstname: currentStepIndex > 0 ? values.firstname : user.firstname,
                lastname: currentStepIndex > 0 ? values.lastname : user.lastname,
                currentStep: currentStepIndex > 0 ? RegistrationStep.dataPrivacy : RegistrationStep.userType,
            });
        }

        if (sessionState === 'error') {
            if (currentStepIndex >= flow.indexOf(RegistrationStep.confirmEmail)) {
                reset();
            }
        }

        if (!!registrationProfile) {
            // If it's authenticated, we update the form state with the user information
            const screeningAppointment = registrationProfile?.pupil
                ? getPupilScreeningAppointment(registrationProfile?.pupil?.screenings ?? [])
                : getStudentScreeningAppointment(registrationProfile?.student?.instructorScreenings ?? [], registrationProfile?.student?.tutorScreenings ?? []);
            handleOnChange({
                email: registrationProfile.email,
                firstname: registrationProfile.firstname,
                lastname: registrationProfile.lastname,
                userType: registrationProfile.pupil ? 'pupil' : 'student',
                screeningAppointment: screeningAppointment ?? undefined,
                grade: registrationProfile.pupil?.gradeAsInt,
                school: registrationProfile.pupil?.school ?? emptyState.school,
                zipCode: registrationProfile.student?.zipCode ?? registrationProfile.pupil?.school?.zip ?? '',
                // Students don't have a "waiting results" (dispute) state
                isWaitingScreeningResults: registrationProfile.pupil ? getIsPupilWaitingScreeningResults(registrationProfile.pupil.screenings ?? []) : false,
            });
        }
        // And stop showing the loader, this should trigger the next effect
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionState, registrationProfile, networkStatus]);

    const hasRegistrationProfile = !!registrationProfile;
    const isPupil = !!registrationProfile?.pupil;
    const isVerified = !!(registrationProfile?.pupil ?? registrationProfile?.student)?.verifiedAt;
    useEffect(() => {
        if (isLoading) return;

        const hasScreeningAppointment = !!values.screeningAppointment?.start;

        const currentStepIsLessThan = (minStep: RegistrationStep) => {
            if (isPupil) {
                return PUPIL_FLOW.indexOf(values.currentStep!) < PUPIL_FLOW.indexOf(minStep);
            }
            return STUDENT_FLOW.indexOf(values.currentStep!) < STUDENT_FLOW.indexOf(minStep);
        };

        // From here we determine in which step the user should land on

        // Rules for when the user is not authenticated
        if (!registrationProfile) {
            if (values.currentStep) {
                // Data Privacy step can only be completed if there is a password or if the user is registering via IDP
                if (values.currentStep === RegistrationStep.dataPrivacy && !password && values.isRegisteringManually) {
                    return handleOnChange({ currentStep: RegistrationStep.authenticationInfo });
                }
                return;
            }

            if (values.userType === 'pupil') {
                return handleOnChange({ currentStep: RegistrationStep.acceptanceCheck });
            }
            if (values.userType === 'student') {
                return handleOnChange({ currentStep: RegistrationStep.userName });
            }
            return handleOnChange({ currentStep: RegistrationStep.userType });
        }

        // Blocker to verify email
        if (!isVerified) {
            return handleOnChange({ currentStep: RegistrationStep.confirmEmail });
        }

        // Blocker to book a screening appointment
        if (!hasScreeningAppointment) {
            return handleOnChange({ currentStep: RegistrationStep.bookAppointment });
        }

        // Pupils have post-screening-appointment steps
        if (values.userType === 'pupil') {
            // Minimum step for verified pupils with an screening appointment (but no post-appointment-booking steps)
            if (currentStepIsLessThan(RegistrationStep.registrationCompleted)) {
                return handleOnChange({ currentStep: RegistrationStep.screeningAppointmentDetail });
            }
        }
        // If everything is done, then go to the registration completed step
        handleOnChange({ currentStep: RegistrationStep.registrationCompleted });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, hasRegistrationProfile, isVerified, isPupil]);

    useEffect(() => {
        if (location.pathname !== '/registration') {
            reset();
        }

        if (['/registration/student', '/registration/helper'].includes(location?.pathname)) {
            handleOnChange({ userType: 'student' });
        }
        if (location?.pathname === '/registration/pupil') {
            handleOnChange({ userType: 'pupil' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    return (
        <RegistrationContext.Provider
            value={{
                form: { ...values, password },
                onFormChange: handleOnChange,
                reset,
                isLoading,
                refetchProfile: refetch,
                flow,
                goNext: handleOnNext,
                goBack: handleOnBack,
            }}
        >
            {children}
        </RegistrationContext.Provider>
    );
};

export const useRegistrationForm = () => {
    return useContext(RegistrationContext);
};
