import { Box, Button, Flex, Heading, Image, Text, useBreakpointValue, useTheme, VStack } from 'native-base';
import { createContext, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/icons/lernfair/lf-logo.svg';
import useModal from '../hooks/useModal';
import VerifyEmailModal from '../modals/VerifyEmailModal';
import UserType from './registration/UserType';
import PersonalData from './registration/PersonalData';
import SchoolClass from './registration/SchoolClass';
import SchoolTypeUI from './registration/SchoolType';
import UserState from './registration/UserState';
import Legal from './registration/Legal';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../gql';
import { ExternalSchoolSearch, PupilEmailOwner, SchoolType, State } from '../gql/graphql';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import SchoolSearch from './registration/SchoolSearch';
import SwitchLanguageButton from '../components/SwitchLanguageButton';
import { SCHOOL_SEARCH_ACTIVE } from '../config';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import useApollo, { useRoles } from '@/hooks/useApollo';

interface SelectedSchool extends Partial<ExternalSchoolSearch> {
    hasPredefinedType?: boolean;
    hasPredefinedState?: boolean;
}

type RegistrationContextType = {
    userType: 'pupil' | 'student';
    setUserType: Dispatch<SetStateAction<'pupil' | 'student'>>;
    firstname: string;
    setFirstname: Dispatch<SetStateAction<string>>;
    lastname: string;
    setLastname: Dispatch<SetStateAction<string>>;
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
    password: string;
    setPassword: Dispatch<SetStateAction<string>>;
    passwordRepeat: string;
    setPasswordRepeat: Dispatch<SetStateAction<string>>;
    school?: SelectedSchool;
    setSchool: Dispatch<SetStateAction<SelectedSchool | undefined>>;
    schoolClass: number;
    setSchoolClass: (value: number) => void;
    newsletter: boolean;
    setNewsletter: Dispatch<SetStateAction<boolean>>;
    currentStep: RegistrationStep;
    emailOwner: PupilEmailOwner;
    setEmailOwner: Dispatch<SetStateAction<PupilEmailOwner>>;
    pupilAge?: '<= 15' | '> 15';
    setPupilAge: Dispatch<SetStateAction<'<= 15' | '> 15' | undefined>>;
    onNext: () => void;
    onPrev: () => void;
    isRegisteringManually: boolean;
};

export const RegistrationContext = createContext<RegistrationContextType>({} as RegistrationContextType);

// Add the referredById variable to the GraphQL mutation for mutPupil and mutStudent
const MUTATION_REGISTER_PUPIL = gql(`
    mutation registerPupil(
        $firstname: String!
        $lastname: String!
        $email: String!
        $newsletter: Boolean!
        $grade: Int!
        $school: RegistrationSchool!
        $referredById: String
        $emailOwner: PupilEmailOwner!
    ) {
        meRegisterPupil(
            noEmail: true
            data: { firstname: $firstname, lastname: $lastname, email: $email, newsletter: $newsletter, registrationSource: normal, school: $school, referredById: $referredById, emailOwner: $emailOwner }
        ) {
            id
        }
        meUpdate(update: { pupil: { gradeAsInt: $grade } })
    }
`);

const MUTATION_REGISTER_STUDENT = gql(`
    mutation registerStudent($firstname: String!, $lastname: String!, $email: String!, $newsletter: Boolean!, $cooperationTag: String, $referredById: String) {
        meRegisterStudent(
            noEmail: true
            data: { firstname: $firstname, lastname: $lastname, email: $email, newsletter: $newsletter, registrationSource: normal, cooperationTag: $cooperationTag, referredById: $referredById }
        ) {
            id
        }
    }
`);

const MUTATION_CREATE_CREDENTIALS = gql(`
    mutation createCredentials($email: String!, $password: String!, $retainPath: String!) {
        passwordCreate(password: $password)
        tokenRequest(action: "user-verify-email", email: $email, redirectTo: $retainPath)
    }
`);

export const TRAINEE_GRADE = 14;

export enum RegistrationStep {
    userType = 'userType',
    personalData = 'personalData',
    grade = 'grade',
    schoolType = 'schoolType',
    school = 'school',
    state = 'state',
    legal = 'legal',
}

const Registration: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { show, hide } = useModal();
    const { trackEvent } = useMatomo();
    const { refreshSessionState, user: sessionUser } = useApollo();
    const roles = useRoles();
    const navigate = useNavigate();

    const location = useLocation();
    const locState = location.state as { retainPath?: string };
    const retainPath = locState?.retainPath ?? '/start';

    const [currentStep, setCurrentStep] = useState<RegistrationStep>(
        location?.pathname === '/registration/student' || location?.pathname === '/registration/helper' || location?.pathname === '/registration/pupil'
            ? RegistrationStep.personalData
            : RegistrationStep.userType
    );
    const [userType, setUserType] = useState<'pupil' | 'student'>(
        location?.pathname === '/registration/student' || location?.pathname === '/registration/helper' ? 'student' : 'pupil'
    );
    // If the user registers through an IDP, we prefill the registration form using the IDP info
    const [firstname, setFirstname] = useState<string>(sessionUser?.firstname ?? '');
    const [lastname, setLastname] = useState<string>(sessionUser?.lastname ?? '');
    const [email, setEmail] = useState<string>(sessionUser?.email ?? '');
    const [password, setPassword] = useState<string>('');
    const [passwordRepeat, setPasswordRepeat] = useState<string>('');
    const [schoolClass, setSchoolClass] = useState<number>(0);
    const [newsletter, setNewsletter] = useState<boolean>(false);
    const [school, setSchool] = useState<SelectedSchool>();
    const [emailOwner, setEmailOwner] = useState<PupilEmailOwner>(PupilEmailOwner.Unknown);
    const [pupilAge, setPupilAge] = useState<'<= 15' | '> 15' | undefined>();
    const isRegisteringManually = !roles.includes('SSO_REGISTERING_USER');

    const [registerPupil] = useMutation(MUTATION_REGISTER_PUPIL);
    const [registerStudent] = useMutation(MUTATION_REGISTER_STUDENT);
    const [createCredentials] = useMutation(MUTATION_CREATE_CREDENTIALS);

    const { data: corpData } = useQuery(
        gql(
            `query Cooperations {
            cooperations {
                id
                tag
                name
                welcomeTitle
                welcomeMessage
            }
        }`
        )
    );

    const cooperationTag = new URL(window.location.toString()).searchParams.get('cooperation');

    const referredById = new URL(window.location.toString()).searchParams.get('referredById'); // Extracting referredById from URL
    const cooperation = useMemo(() => {
        const result = corpData?.cooperations?.find((it) => it.tag === cooperationTag);

        if (cooperationTag && corpData && !result) {
            throw new Error(`Invalid Cooperation Tag '${cooperationTag}'`);
        }

        return result;
    }, [cooperationTag, corpData]);

    useEffect(() => {
        if (cooperationTag) {
            sessionStorage.setItem('cooperationTag', cooperationTag);
        }
        if (referredById) {
            sessionStorage.setItem('referredById', referredById);
        }
    }, [cooperationTag, referredById]);

    //Pass the referredbyId as a Mutation variable in the attemptRegister function (access it from Registration data here)
    const attemptRegister = useCallback(async () => {
        try {
            const validMail = email.toLowerCase();
            const basicData = {
                firstname,
                lastname,
                email: validMail,
                newsletter,
            };
            const referredBy = sessionStorage.getItem('referredById');
            const cooperation = sessionStorage.getItem('cooperationTag');

            let createAccountResult =
                userType === 'pupil'
                    ? await registerPupil({
                          variables: {
                              ...basicData,
                              emailOwner,
                              grade: schoolClass,
                              school: {
                                  name: school?.name,
                                  city: school?.city,
                                  email: school?.email,
                                  schooltype: school?.schooltype || SchoolType.Other,
                                  state: school?.state || State.Other,
                                  zip: school?.zip,
                              },
                              referredById: referredBy,
                          },
                      })
                    : await registerStudent({
                          variables: { ...basicData, cooperationTag: cooperation, referredById: referredBy },
                      });

            sessionStorage.removeItem('referredById');
            sessionStorage.removeItem('cooperationTag');

            if (isRegisteringManually) {
                await createCredentials({ variables: { email: validMail, password, retainPath: retainPath } });
            }

            if (!createAccountResult.errors) {
                if (userType === 'pupil') {
                    const eventNameAge = pupilAge === '<= 15' ? '15 or younger' : '16 or older';
                    const eventNameEmailOwner = {
                        [PupilEmailOwner.Pupil]: 'Pupil Email',
                        [PupilEmailOwner.Parent]: 'Parent Email',
                        [PupilEmailOwner.Other]: 'Other',
                        [PupilEmailOwner.Unknown]: 'Unknown Email',
                    };
                    trackEvent({
                        category: 'SuS Registration',
                        action: 'Radiobutton Age and Email',
                        name: `${eventNameAge} and ${eventNameEmailOwner[emailOwner]}`,
                    });
                }

                if (isRegisteringManually) {
                    show({ variant: 'dark' }, <VerifyEmailModal email={email} retainPath={retainPath} userType={userType} />);

                    // Remove /registration from the URL so that a refresh of the page won't show the registration form again
                    window.history.replaceState({}, '', '/');
                } else {
                    await refreshSessionState();
                    navigate('/');
                }
            } else {
                show(
                    { variant: 'dark' },
                    <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
                        <Text color="lightText">
                            {t(`registration.result.error.message.${createAccountResult.errors[0].message}` as unknown as TemplateStringsArray, {
                                defaultValue: createAccountResult.errors[0].message,
                            })}
                        </Text>
                        <Button
                            onPress={() => {
                                hide();
                                attemptRegister();
                            }}
                        >
                            {t('registration.result.error.tryagain')}
                        </Button>
                        <Button onPress={hide}>{t('back')}</Button>
                    </VStack>
                );
            }
        } catch (e: any) {
            show(
                { variant: 'light' },
                <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
                    <Text color="lightText">
                        {t(`registration.result.error.message.${e.message}` as unknown as TemplateStringsArray, {
                            defaultValue: e.message,
                        })}
                    </Text>
                    <Button
                        onPress={() => {
                            hide();
                            attemptRegister();
                        }}
                    >
                        {t('registration.result.error.tryagain')}
                    </Button>
                    <Button onPress={hide}>{t('back')}</Button>
                </VStack>
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, hide, email, firstname, lastname, password, newsletter, userType, registerPupil, registerStudent, schoolClass, space, t, school]);

    const logoSize = useBreakpointValue({
        base: '50px',
        lg: '100px',
    });

    const headerDirection = useBreakpointValue({
        base: 'row',
        lg: 'column',
    });

    const headerSpace = useBreakpointValue({
        base: space['1'],
        lg: space['2'],
    });

    if (cooperationTag && !corpData) {
        return <CenterLoadingSpinner />;
    }

    const studentFlow = [RegistrationStep.userType, RegistrationStep.personalData, RegistrationStep.legal];
    const pupilFlow = [
        RegistrationStep.userType,
        RegistrationStep.personalData,
        ...(SCHOOL_SEARCH_ACTIVE ? [RegistrationStep.school] : []),
        RegistrationStep.grade,
        RegistrationStep.schoolType,
        RegistrationStep.state,
        RegistrationStep.legal,
    ];

    const flow = userType === 'pupil' ? pupilFlow : studentFlow;
    const currentStepIndex = flow.indexOf(currentStep);

    const handleOnNext = () => {
        if (currentStepIndex === -1) return;

        if (
            (!school?.schooltype && currentStep === RegistrationStep.schoolType) ||
            (schoolClass === 0 && currentStep === RegistrationStep.grade) ||
            (!school?.state && currentStep === RegistrationStep.state)
        ) {
            return;
        }

        const getNextStepFrom = (step: RegistrationStep) => {
            const currentIndex = flow.indexOf(step);
            return flow[currentIndex + 1];
        };
        let nextStep = getNextStepFrom(currentStep);

        const shouldSkipSchoolType = schoolClass === TRAINEE_GRADE || !!school?.hasPredefinedType;
        if (nextStep === RegistrationStep.schoolType && shouldSkipSchoolType) {
            nextStep = getNextStepFrom(nextStep); // skip
        }

        if (currentStep === RegistrationStep.grade) {
            setCurrentStep(schoolClass === TRAINEE_GRADE ? RegistrationStep.state : RegistrationStep.schoolType);
            return;
        }

        const shouldSkipState = !!school?.hasPredefinedState;
        if (nextStep === RegistrationStep.state && shouldSkipState) {
            nextStep = getNextStepFrom(nextStep); // skip
        }
        setCurrentStep(nextStep);
    };

    const handleOnPrev = () => {
        if (currentStepIndex === -1) return;

        const getPrevStepFrom = (step: RegistrationStep) => {
            const currentIndex = flow.indexOf(step);
            return flow[currentIndex - 1];
        };
        let prevStep = getPrevStepFrom(currentStep);

        const shouldSkipState = !!school?.hasPredefinedState;
        if (prevStep === RegistrationStep.state && shouldSkipState) {
            prevStep = getPrevStepFrom(prevStep); // skip
        }

        const shouldSkipSchoolType = schoolClass === TRAINEE_GRADE || !!school?.hasPredefinedType;
        if (prevStep === RegistrationStep.schoolType && shouldSkipSchoolType) {
            prevStep = getPrevStepFrom(prevStep); // skip
        }
        setCurrentStep(prevStep);
    };

    return (
        <Flex alignItems="center" w="100%" h="100dvh">
            <Box w="100%" display="flex" flexDirection={headerDirection} position="relative" padding={headerSpace} justifyContent="center" alignItems="center">
                <Image
                    alt="Lernfair"
                    position="absolute"
                    zIndex="-1"
                    borderBottomRadius={15}
                    width="100%"
                    height="100%"
                    source={{
                        uri: require('../assets/images/globals/lf-bg.png'),
                    }}
                />
                <Logo viewBox="0 0 100 100" width={logoSize} height={logoSize} />
                <Heading m={space['1']}>{t(`registration.steps.${currentStep}.title` as unknown as TemplateStringsArray)}</Heading>
                <SwitchLanguageButton />
            </Box>
            <Flex flex="1" p={space['1']} w="100%" alignItems="center" overflowY={'scroll'}>
                <RegistrationContext.Provider
                    value={{
                        userType,
                        setUserType,
                        firstname,
                        setFirstname,
                        lastname,
                        setLastname,
                        email,
                        setEmail,
                        password,
                        setPassword,
                        passwordRepeat,
                        setPasswordRepeat,
                        school,
                        setSchool,
                        schoolClass,
                        setSchoolClass,
                        newsletter,
                        setNewsletter,
                        currentStep,
                        onNext: handleOnNext,
                        onPrev: handleOnPrev,
                        emailOwner,
                        setEmailOwner,
                        pupilAge,
                        setPupilAge,
                        isRegisteringManually,
                    }}
                >
                    <Box w="100%" maxW={'contentContainerWidth'}>
                        {currentStep === RegistrationStep.userType && <UserType />}
                        {currentStep === RegistrationStep.personalData && <PersonalData cooperation={cooperation} />}
                        {currentStep === RegistrationStep.school && <SchoolSearch />}
                        {currentStep === RegistrationStep.grade && <SchoolClass />}
                        {currentStep === RegistrationStep.schoolType && <SchoolTypeUI />}
                        {currentStep === RegistrationStep.state && <UserState />}
                        {currentStep === RegistrationStep.legal && <Legal onRegister={attemptRegister} />}
                    </Box>
                </RegistrationContext.Provider>
            </Flex>
        </Flex>
    );
};
export default Registration;
