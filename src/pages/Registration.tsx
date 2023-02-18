import { Box, Button, Flex, Heading, Image, Text, useTheme, VStack } from 'native-base';
import { createContext, Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/icons/lernfair/lf-logo.svg';
import useModal from '../hooks/useModal';
import VerifyEmailModal from '../modals/VerifyEmailModal';
import { REDIRECT_OPTIN } from '../Utility';
import UserType from './registration/UserType';
import PersonalData from './registration/PersonalData';
import SchoolClass from './registration/SchoolClass';
import SchoolType from './registration/SchoolType';
import UserState from './registration/UserState';
import Legal from './registration/Legal';
import { gql, useMutation } from '@apollo/client';

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

const mutPupil = gql`
  mutation registerPupil(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
    $newsletter: Boolean!
    $state: State!
    $grade: Int!
    $schoolType: SchoolType!
  ) {
    meRegisterPupil(
      noEmail: true,
      data: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        newsletter: $newsletter
        registrationSource: normal
        state: $state
      }
    ) {
      id
    }
    passwordCreate(password: $password)
    meUpdate(update: { pupil: { gradeAsInt: $grade, schooltype: $schoolType }})
    tokenRequest(action: "user-verify-email", email: $email, redirectTo: "${REDIRECT_OPTIN}")
  }
`;
const mutStudent = gql`
  mutation registerStudent(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
    $newsletter: Boolean!
  ) {
    meRegisterStudent(
      noEmail: true,
      data: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        newsletter: $newsletter
        registrationSource: normal
      }
    ) {
      id
    }
    passwordCreate(password: $password)
    tokenRequest(action: "user-verify-email", email: $email, redirectTo: "${REDIRECT_OPTIN}")
  }
`;

const Registration: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { show, hide } = useModal();
    const navigate = useNavigate();

    const location = useLocation();

    const [currentIndex, setCurrentIndex] = useState<number>(
        location?.pathname === '/registration/student' || location?.pathname === '/registration/pupil' ? 1 : 0
    );
    const [userType, setUserType] = useState<'pupil' | 'student'>(location?.pathname === '/registration/student' ? 'student' : 'pupil');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordRepeat, setPasswordRepeat] = useState<string>('');
    const [schoolType, setSchoolType] = useState<string>('grundschule');
    const [schoolClass, setSchoolClass] = useState<number>(1);
    const [userState, setUserState] = useState<string>('bw');
    const [newsletter, setNewsletter] = useState<boolean>(true);

    const [register] = useMutation(userType === 'pupil' ? mutPupil : mutStudent);

    const attemptRegister = useCallback(async () => {
        try {
            const validMail = email.toLowerCase();
            const data = {
                variables: {
                    firstname,
                    lastname,
                    email: validMail,
                    password,
                    newsletter,
                },
            } as {
                variables: {
                    firstname: string;
                    lastname: string;
                    email: string;
                    password: string;
                    newsletter: boolean;
                    schoolType?: string;
                    grade?: number;
                    state?: string;
                };
            };

            if (userType === 'pupil') {
                data.variables.schoolType = schoolType;
                data.variables.grade = schoolClass;
                data.variables.state = userState;
            }

            const res = await register(data);

            if (!res.errors) {
                show({ variant: 'dark' }, <VerifyEmailModal email={email} />);
            } else {
                show(
                    { variant: 'dark' },
                    <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
                        <Text color="lightText">
                            {t(`registration.result.error.message.${res.errors[0].message}` as unknown as TemplateStringsArray, {
                                defaultValue: res.errors[0].message,
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
                        <Button onPress={hide}>{t('registration.result.error.btn')}</Button>
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
                    <Button onPress={hide}>{t('registration.result.error.btn')}</Button>
                </VStack>
            );
        }
    }, [show, hide, email, firstname, lastname, password, newsletter, userType, register, schoolType, schoolClass, userState, space, t]);

    return (
        <Flex alignItems="center" w="100%" h="100vh">
            <Box w="100%" position="relative" paddingY={space['2']} justifyContent="center" alignItems="center">
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
                {/* <Box position="absolute" left={space['1']} top={space['1']}>
          <BackButton onPress={goBack} />
        </Box> */}
                <Logo />
                <Heading mt={space['1']}>{t(`registration.steps.${currentIndex}.title` as unknown as TemplateStringsArray)}</Heading>
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
                        {currentIndex === 1 && <PersonalData />}
                        {currentIndex === 2 && <SchoolClass />}
                        {currentIndex === 3 && <SchoolType />}
                        {currentIndex === 4 && <UserState />}
                        {currentIndex === 5 && <Legal onRegister={attemptRegister} />}
                    </Box>
                </RegistrationContext.Provider>
            </Flex>
        </Flex>
    );
};
export default Registration;
