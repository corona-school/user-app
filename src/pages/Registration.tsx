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
import { SchoolType, State } from '../gql/graphql';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';

type RegistrationContextType = {
    currentIndex: number;
    setCurrentIndex: Dispatch<SetStateAction<number>>;
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
    schoolClass: number;
    setSchoolClass: Dispatch<SetStateAction<number>>;
    schoolType: string;
    setSchoolType: Dispatch<SetStateAction<string>>;
    userState: string;
    setUserState: Dispatch<SetStateAction<string>>;
    newsletter: boolean;
    setNewsletter: Dispatch<SetStateAction<boolean>>;
};

export const RegistrationContext = createContext<RegistrationContextType>({} as RegistrationContextType);

const mutPupil = gql(`
    mutation registerPupil(
        $firstname: String!
        $lastname: String!
        $email: String!
        $password: String!
        $newsletter: Boolean!
        $state: State!
        $grade: Int!
        $schoolType: SchoolType!
        $retainPath: String!
    ) {
        meRegisterPupil(
            noEmail: true
            data: { firstname: $firstname, lastname: $lastname, email: $email, newsletter: $newsletter, registrationSource: normal, state: $state }
        ) {
            id
        }
        passwordCreate(password: $password)
        meUpdate(update: { pupil: { gradeAsInt: $grade, schooltype: $schoolType } })
        tokenRequest(action: "user-verify-email", email: $email, redirectTo: $retainPath)
    }
`);
const mutStudent = gql(`
    mutation registerStudent($firstname: String!, $lastname: String!, $email: String!, $password: String!, $newsletter: Boolean!, $retainPath: String!, $cooperationTag: String) {
        meRegisterStudent(
            noEmail: true
            data: { firstname: $firstname, lastname: $lastname, email: $email, newsletter: $newsletter, registrationSource: normal, cooperationTag: $cooperationTag }
        ) {
            id
        }
        passwordCreate(password: $password)
        tokenRequest(action: "user-verify-email", email: $email, redirectTo: $retainPath)
    }
`);

const Registration: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { show, hide } = useModal();

    const location = useLocation();
    const locState = location.state as { retainPath?: string };
    const retainPath = locState?.retainPath ?? '/start';

    const [currentIndex, setCurrentIndex] = useState<number>(
        location?.pathname === '/registration/student' || location?.pathname === '/registration/helper' || location?.pathname === '/registration/pupil' ? 1 : 0
    );
    const [userType, setUserType] = useState<'pupil' | 'student'>(
        location?.pathname === '/registration/student' || location?.pathname === '/registration/helper' ? 'student' : 'pupil'
    );
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordRepeat, setPasswordRepeat] = useState<string>('');
    const [schoolType, setSchoolType] = useState<string>('grundschule');
    const [schoolClass, setSchoolClass] = useState<number>(1);
    const [userState, setUserState] = useState<string>('bw');
    const [newsletter, setNewsletter] = useState<boolean>(false);

    const [registerPupil] = useMutation(mutPupil);
    const [registerStudent] = useMutation(mutStudent);

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

    const cooperation = useMemo(() => {
        const result = corpData?.cooperations?.find((it) => it.tag === cooperationTag);

        if (cooperationTag && corpData && !result) {
            throw new Error(`Invalid Cooperation Tag '${cooperationTag}'`);
        }

        return result;
    }, [cooperationTag, corpData]);

    const attemptRegister = useCallback(async () => {
        try {
            const validMail = email.toLowerCase();
            const basicData = {
                firstname,
                lastname,
                email: validMail,
                password,
                newsletter,
                retainPath: retainPath,
            };

            let result =
                userType === 'pupil'
                    ? await registerPupil({
                          variables: {
                              ...basicData,
                              schoolType: schoolType as SchoolType,
                              grade: schoolClass,
                              state: userState as State,
                          },
                      })
                    : await registerStudent({
                          variables: { ...basicData, cooperationTag },
                      });

            if (!result.errors) {
                show({ variant: 'dark' }, <VerifyEmailModal email={email} retainPath={retainPath} />);

                // Remove /registration from the URL so that a refresh of the page won't show the registration form again
                window.history.replaceState({}, '', '/');
            } else {
                show(
                    { variant: 'dark' },
                    <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
                        <Text color="lightText">
                            {t(`registration.result.error.message.${result.errors[0].message}` as unknown as TemplateStringsArray, {
                                defaultValue: result.errors[0].message,
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
    }, [show, hide, email, firstname, lastname, password, newsletter, userType, registerPupil, registerStudent, schoolType, schoolClass, userState, space, t]);

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
                <Heading m={space['1']}>{t(`registration.steps.${currentIndex}.title` as unknown as TemplateStringsArray)}</Heading>
            </Box>
            <Flex flex="1" p={space['1']} w="100%" alignItems="center" overflowY={'scroll'}>
                <RegistrationContext.Provider
                    value={{
                        currentIndex,
                        setCurrentIndex,
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
                        schoolClass,
                        setSchoolClass,
                        schoolType,
                        setSchoolType,
                        userState,
                        setUserState,
                        newsletter,
                        setNewsletter,
                    }}
                >
                    <Box w="100%" maxW={'contentContainerWidth'}>
                        {currentIndex === 0 && <UserType />}
                        {currentIndex === 1 && <PersonalData cooperation={cooperation} />}
                        {currentIndex === 2 && <SchoolClass />}
                        {currentIndex === 3 && <SchoolTypeUI />}
                        {currentIndex === 4 && <UserState />}
                        {currentIndex === 5 && <Legal onRegister={attemptRegister} />}
                    </Box>
                </RegistrationContext.Provider>
            </Flex>
        </Flex>
    );
};
export default Registration;
