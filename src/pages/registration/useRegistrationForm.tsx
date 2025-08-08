import { gql } from '@/gql';
import { Language, PupilEmailOwner } from '@/gql/graphql';
import useApollo from '@/hooks/useApollo';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Appointment } from '@/types/lernfair/Appointment';
import { NetworkStatus, useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getPupilScreeningAppointment, getStudentScreeningAppointment, PUPIL_FLOW, RegistrationStep, STUDENT_FLOW } from './util';

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
}

interface RegistrationContextValue {
    form: RegistrationForm;
    onFormChange: (data: Partial<RegistrationForm>) => void;
    reset: () => void;
    isLoading: boolean;
    refetchProfile: () => void;
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
};

const RegistrationContext = createContext<RegistrationContextValue>({
    form: emptyState,
    isLoading: false,
    onFormChange: () => {},
    reset: () => {},
    refetchProfile: () => {},
});

const REGISTRATION_PROFILE_QUERY = gql(`  
    query RegistrationProfile {
        me {
            firstname
            lastname
            email
            pupil {
                screenings {
                    status,
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
                    }
                }
                verifiedAt
                languages
                emailOwner
            }
            student {
                tutorScreenings { status, appointment { id, title, description, start, override_meeting_link, duration, actionUrls { cancelUrl rescheduleUrl } } }
                instructorScreenings { status, appointment { id, title, description, start, override_meeting_link, duration, actionUrls { cancelUrl rescheduleUrl } } }
                verifiedAt
                languages
            }
        }
    }
`);

export const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
    const { sessionState } = useApollo();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const { data, refetch, networkStatus } = useQuery(REGISTRATION_PROFILE_QUERY, { skip: sessionState !== 'logged-in', notifyOnNetworkStatusChange: true });
    const registrationProfile = data?.me;

    const [values, setValues, removeValues] = useLocalStorage<RegistrationForm>({
        key: 'registration',
        initialValue: {
            ...emptyState,
        },
    });
    const [password, setPassword] = useState('');

    const handleOnChange = ({ password, ...data }: Partial<RegistrationForm>) => {
        if (password !== undefined) {
            setPassword(password);
        }
        setValues({ ...values, ...data });
    };

    const reset = () => {
        removeValues();
        setValues({ ...emptyState, currentStep: RegistrationStep.userType });
        setPassword('');
    };

    useEffect(() => {
        // At this point we still don't know what to do with the user as we're checking if it's already logged in or not
        if (sessionState === 'unknown' || networkStatus !== NetworkStatus.ready) return;
        // If it's logged in but we don't have their profile yet, we need to wait a bit more
        if (sessionState === 'logged-in' && !registrationProfile) return;
        // If it's authenticated, we update the form state with the user information
        if (!!registrationProfile) {
            const screeningAppointment = registrationProfile?.pupil
                ? getPupilScreeningAppointment(registrationProfile?.pupil?.screenings ?? [])
                : getStudentScreeningAppointment(registrationProfile?.student?.instructorScreenings ?? [], registrationProfile?.student?.tutorScreenings ?? []);
            handleOnChange({
                email: registrationProfile.email,
                firstname: registrationProfile.firstname,
                lastname: registrationProfile.lastname,
                userType: registrationProfile.pupil ? 'pupil' : 'student',
                screeningAppointment: screeningAppointment ?? undefined,
            });
        }
        // And stop showing the loader, this should trigger the next effect
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionState, registrationProfile, networkStatus]);

    useEffect(() => {
        if (isLoading) return;

        const isPupil = !!registrationProfile?.pupil;
        const isVerified = !!(registrationProfile?.pupil ?? registrationProfile?.student)?.verifiedAt;
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
                // User was on dataPrivacy step and reloaded the page, need to enter the password again
                if (values.currentStep === RegistrationStep.dataPrivacy && !password) {
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

        // Minimum step for verified users with an screening appointment
        if (currentStepIsLessThan(RegistrationStep.screeningAppointmentDetail)) {
            return handleOnChange({ currentStep: RegistrationStep.screeningAppointmentDetail });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, registrationProfile]);

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
        <RegistrationContext.Provider value={{ form: { ...values, password }, onFormChange: handleOnChange, reset, isLoading, refetchProfile: refetch }}>
            {children}
        </RegistrationContext.Provider>
    );
};

export const useRegistrationForm = () => {
    return useContext(RegistrationContext);
};
