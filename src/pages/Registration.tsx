import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { ProgressBar } from '@/components/ProgressBar';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import useApollo from '@/hooks/useApollo';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { AcceptanceCheck } from './registration/AcceptanceCheck';
import { AcceptanceCheckFailed } from './registration/AcceptanceCheckFailed';
import { AuthenticationInfo } from './registration/AuthenticationInfo';
import { BookAppointment } from './registration/BookAppointment';
import { ConfirmEmail } from './registration/ConfirmEmail';
import { DataPrivacy } from './registration/DataPrivacy';
import { EmailOwner } from './registration/EmailOwner';
import { NotificationPreferences } from './registration/NotificationPreferences';
import { OurRules } from './registration/OurRules';
import PupilGrade from './registration/PupilGrade';
import { DropdownRegistrationMenu } from './registration/DropdownRegistrationMenu';
import SchoolSearch from './registration/SchoolSearch';
import SchoolType from './registration/SchoolType';
import { ScreeningAppointmentDetail } from './registration/ScreeningAppointmentDetails';
import { UserAge } from './registration/UserAge';
import { useRegistrationForm } from './registration/useRegistrationForm';
import { UserLanguages } from './registration/UserLanguages';
import { UserName } from './registration/UserName';
import { UserTypeSelector } from './registration/UserTypeSelector';
import { PUPIL_FLOW, RegistrationStep, STUDENT_FLOW } from './registration/util';
import { ZipCode } from './registration/ZipCode';
import { ERole } from '@/types/lernfair/User';
import { StudentLanguage } from '@/gql/graphql';
import { UserGender } from './registration/UserGender';

export const TRAINEE_GRADE = 14;

const QUERY_COOPERATIONS = gql(`
    query Cooperations {
        cooperations {
            id
            tag
            name
            welcomeTitle
            welcomeMessage
        }
    }
`);

const MUTATION_REGISTER_PUPIL = gql(`
    mutation registerPupil(
        $firstname: String!
        $lastname: String!
        $email: String!
        $referredById: String
        $emailOwner: PupilEmailOwner!
        $languages: [Language!]
        $age: Int!
    ) {
        meRegisterPupil(
            noEmail: true
            data: { firstname: $firstname, lastname: $lastname, email: $email, newsletter: false, registrationSource: normal, referredById: $referredById, emailOwner: $emailOwner }
        ) {
            id
        }
        meUpdate(update:  {
           pupil:  {
              languages: $languages
              age: $age
           }
        })
    }
`);

const MUTATION_REGISTER_STUDENT = gql(`
    mutation registerStudent($firstname: String!, $lastname: String!, $email: String!, $zipCode: String, $cooperationTag: String, $referredById: String, $gender: Gender, $languages: [StudentLanguage!], $isAdult: Boolean!) {
        meRegisterStudent(
            noEmail: true
            data: { firstname: $firstname, lastname: $lastname, email: $email, newsletter: false, registrationSource: normal, cooperationTag: $cooperationTag, referredById: $referredById isAdult: $isAdult }
        ) {
            id
        }
        meUpdate(update:  {
           student:  {
              zipCode: $zipCode
              languages: $languages
              gender: $gender
           }
        })
    }
`);

const MUTATION_CREATE_CREDENTIALS = gql(`
    mutation createCredentials($email: String!, $password: String!, $retainPath: String!) {
        passwordCreate(password: $password)
        tokenRequest(action: "user-verify-email", email: $email, redirectTo: $retainPath)
    }
`);

const Registration = () => {
    const location = useLocation();
    const { user, refreshSessionState, sessionState, roles } = useApollo();
    const locState = location.state as { retainPath?: string };
    const retainPath = locState?.retainPath ?? '/start';
    const [registerPupil] = useMutation(MUTATION_REGISTER_PUPIL);
    const [registerStudent] = useMutation(MUTATION_REGISTER_STUDENT);
    const [createCredentials] = useMutation(MUTATION_CREATE_CREDENTIALS);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const container = useRef<HTMLDivElement>(null);
    const { data: corpData } = useQuery(QUERY_COOPERATIONS);
    const cooperationTag = new URL(window.location.toString()).searchParams.get('cooperation');
    const referredById = new URL(window.location.toString()).searchParams.get('referredById');

    const { form, reset, onFormChange, isLoading: isLoadingRegistrationForm, flow, goBack, goNext } = useRegistrationForm();

    const currentStepIndex = form.currentStep ? flow.indexOf(form.currentStep) : -1;

    const onAcceptanceCheckFailed = () => {
        onFormChange({ currentStep: RegistrationStep.acceptanceCheckFailed });
    };
    const onResetFunnel = () => {
        reset();
    };

    // These don't count visually in the progress bar. At this point we don't know
    // how many steps are there in total. It will depend on user type
    const getSetupStepsCount = () => {
        if (form.userType === 'pupil') {
            return [RegistrationStep.userType, RegistrationStep.acceptanceCheck].length;
        }
        return [RegistrationStep.userType].length;
    };

    const getStepsCount = () => {
        if (form.userType === 'pupil') {
            return PUPIL_FLOW.length - getSetupStepsCount();
        }
        return STUDENT_FLOW.length - getSetupStepsCount();
    };

    const getCurrentStepNumber = () => {
        return currentStepIndex + 1 - getSetupStepsCount();
    };

    const handleOnRegisterWithPassword = async () => {
        const basicData = {
            firstname: form.firstname,
            lastname: form.lastname,
            email: form.email,
            languages: form.languages,
        };
        const referredBy = sessionStorage.getItem('referredById');
        const cooperation = sessionStorage.getItem('cooperationTag');

        if (form.userType === 'pupil') {
            await registerPupil({
                variables: {
                    ...basicData,
                    emailOwner: form.emailOwner!,
                    referredById: referredBy,
                    age: form.age,
                },
            });
        } else {
            await registerStudent({
                variables: {
                    ...basicData,
                    cooperationTag: cooperation,
                    referredById: referredBy,
                    zipCode: form.zipCode,
                    isAdult: !!form.isAdult,
                    languages: form.languages as unknown as StudentLanguage[],
                    gender: form.gender,
                },
            });
        }

        sessionStorage.removeItem('referredById');
        sessionStorage.removeItem('cooperationTag');
        if (form.isRegisteringManually) {
            await createCredentials({ variables: { email: form.email, password: form.password, retainPath: retainPath } });
            await refreshSessionState();
        } else {
            await refreshSessionState();
        }
        goNext();
    };

    const cooperation = useMemo(() => {
        const result = corpData?.cooperations?.find((it) => it.tag === cooperationTag);
        return result;
    }, [cooperationTag, corpData]);

    useEffect(() => {
        if (cooperation?.tag) {
            sessionStorage.setItem('cooperationTag', cooperation.tag);
        }
        if (referredById) {
            sessionStorage.setItem('referredById', referredById);
        }
    }, [referredById, cooperation?.tag]);

    useEffect(() => {
        container.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStepIndex]);

    useEffect(() => {
        if (sessionState === 'logged-in') {
            const wasScreened = [ERole.TUTEE, ERole.PARTICIPANT, ERole.INSTRUCTOR, ERole.TUTOR].some((role) => roles.includes(role));
            if (user && (user.pupil || user.student) && wasScreened) {
                reset();
                navigate('/start', { replace: true });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, roles, sessionState]);

    return (
        <div className="bg-primary-lighter flex flex-col h-dvh justify-between flex-1 overflow-y-auto overflow-x-hidden" ref={container}>
            <div className="flex flex-col flex-1">
                <div className="py-2 pr-4 pl-6 flex justify-end items-center">
                    <div className="flex gap-x-2 w-full items-center">
                        {getCurrentStepNumber() > 0 && !form.isWaitingScreeningResults && (
                            <>
                                <Typography className="text-[14px] whitespace-pre min-w-14">
                                    {t('registration.stepStateCount', { current: getCurrentStepNumber(), total: getStepsCount() })}
                                </Typography>
                                <ProgressBar className="h-4" value={(currentStepIndex / (flow.length - 1)) * 100} />
                            </>
                        )}
                    </div>
                    <div className="flex ml-5 ">
                        <SwitchLanguageButton variant="dropdown" />
                        {sessionState === 'logged-in' && <DropdownRegistrationMenu />}
                    </div>
                </div>
                {isLoadingRegistrationForm ? (
                    <CenterLoadingSpinner />
                ) : (
                    <>
                        {form.currentStep === RegistrationStep.userType && <UserTypeSelector onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.acceptanceCheck && (
                            <AcceptanceCheck onBack={goBack} onNext={goNext} onFail={onAcceptanceCheckFailed} />
                        )}
                        {form.currentStep === RegistrationStep.acceptanceCheckFailed && <AcceptanceCheckFailed onTryAgain={onResetFunnel} />}
                        {form.currentStep === RegistrationStep.userName && <UserName onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.userAge && <UserAge onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.userGender && <UserGender onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.languages && <UserLanguages onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.emailOwner && <EmailOwner onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.authenticationInfo && <AuthenticationInfo onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.dataPrivacy && (
                            <DataPrivacy onBack={goBack} onRegisterWithPassword={handleOnRegisterWithPassword} />
                        )}
                        {form.currentStep === RegistrationStep.confirmEmail && <ConfirmEmail retainPath={retainPath} />}
                        {form.currentStep === RegistrationStep.bookAppointment && <BookAppointment onNext={goNext} />}
                        {form.currentStep === RegistrationStep.screeningAppointmentDetail && <ScreeningAppointmentDetail onNext={goNext} />}
                        {form.currentStep === RegistrationStep.grade && <PupilGrade onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.school && <SchoolSearch onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.schoolType && <SchoolType onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.zipCode && <ZipCode onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.notifications && <NotificationPreferences onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.rules && <OurRules onBack={goBack} onNext={goNext} />}
                        {form.currentStep === RegistrationStep.registrationCompleted && <ScreeningAppointmentDetail variant="completed" />}
                    </>
                )}
            </div>
        </div>
    );
};

export default Registration;
