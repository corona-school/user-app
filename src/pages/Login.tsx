import { useCallback, useEffect, useState } from 'react';
import { gql } from '../gql';
import { FetchResult, useMutation } from '@apollo/client';
import Logo from '../assets/icons/lernfair/lf-logo.svg';
import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    Modal,
    Row,
    Text,
    useBreakpointValue,
    useTheme,
    VStack,
    FormControl,
    Alert,
    HStack,
    useToast,
    CloseIcon,
} from 'native-base';
import useApollo, { getOrCreateDeviceId } from '../hooks/useApollo';
import { useLocation, useNavigate } from 'react-router-dom';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { useTranslation } from 'react-i18next';
import TextInput from '../components/TextInput';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import PasswordInput from '../components/PasswordInput';
import AlertMessage from '../widgets/AlertMessage';
import { REDIRECT_PASSWORD } from '../Utility';
import isEmail from 'validator/lib/isEmail';
import DisableableButton from '../components/DisablebleButton';
import SwitchLanguageButton from '../components/SwitchLanguageButton';

export default function Login() {
    const { t } = useTranslation();
    const { sessionState, loginWithPassword } = useApollo();
    const { space, sizes } = useTheme();
    const [showNoAccountModal, setShowNoAccountModal] = useState(false);
    const [showAccountDeactivatedModal, setShowAccountDeactivatedModal] = useState(false);
    const [email, setEmail] = useState<string>();
    const [showEmailSent, setShowEmailSent] = useState(false);
    const [loginEmail, setLoginEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [isInvalidEmail, setIsInvalidEmail] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState<boolean>(false);
    const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
    const [showPasswordResetResult, setShowPasswordResetResult] = useState<'success' | 'error' | 'unknown' | undefined>();
    const [loginResult, setLoginResult] = useState<FetchResult>();
    const toast = useToast();

    const location = useLocation();
    const locationState = location.state as { retainPath?: string; error?: 'token-invalid' };
    const retainPath = locationState?.retainPath ?? '/start';
    const error = locationState?.error;

    const navigate = useNavigate();
    const { trackPageView, trackEvent } = useMatomo();

    const [determineLoginOptions, _determineLoginOptions] = useMutation(
        gql(`
            mutation determineLoginOptions($email: String!) {
                userDetermineLoginOptions(email: $email)
            }
        `)
    );

    const [resetPW, _resetPW] = useMutation(
        gql(`
        mutation PasswordReset($email: String!, $redirectTo: String!) {
            tokenRequest(email: $email, action: "user-password-reset", redirectTo: $redirectTo)
        }
    `)
    );
    const [sendToken, _sendToken] = useMutation(
        gql(`
        mutation Authenticate($email: String!, $redirectTo: String!) {
            tokenRequest(email: $email, action: "user-authenticate", redirectTo: $redirectTo)
        }
    `)
    );

    const onChangeEmail = useCallback(
        (text: string) => {
            if (isInvalidEmail) {
                setIsInvalidEmail(false);
            }
            setEmail(text);
        },
        [isInvalidEmail]
    );

    useEffect(() => {
        if (sessionState === 'logged-in') navigate(retainPath, { replace: true });
        if (error && error === 'token-invalid') {
            toast.show({
                render: ({ id }) => {
                    return (
                        <Alert w="100%" status="error" colorScheme="error" backgroundColor={'danger.50'}>
                            <VStack space={2} flexShrink={1} w="100%">
                                <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                                    <HStack space={2} flexShrink={1} alignItems="center">
                                        <Alert.Icon />
                                        <Text>{t('login.invalidTokenAlert.text')}</Text>
                                        <Button onPress={() => toast.close(id)} variant="subtle" backgroundColor={'danger.50'}>
                                            <CloseIcon size="sm" />
                                        </Button>
                                    </HStack>
                                </HStack>
                            </VStack>
                        </Alert>
                    );
                },
                duration: null,
                placement: 'bottom',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, sessionState]);

    useEffect(() => {
        trackPageView({
            documentTitle: 'Login',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loginButton = useCallback(() => {
        trackEvent({
            category: 'login',
            action: 'click-event',
            name: 'Login Button auf Login Page',
            documentTitle: 'Login Page',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loginRegisterLink = useCallback(() => {
        trackEvent({
            category: 'login',
            action: 'click-event',
            name: 'Registrierung auf Login Page',
            documentTitle: 'Login Page – Registrierung Link',
        });
        navigate('/registration');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    const requestToken = useCallback(async () => {
        const res = await sendToken({
            variables: {
                email: email!,
                redirectTo: retainPath,
            },
        });

        if (res.data!.tokenRequest) {
            setShowEmailSent(true);
        } else if (res.errors) {
            if (res.errors[0].message.includes('Unknown User')) {
                setShowNoAccountModal(true);
            } else {
                setShowEmailSent(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, sendToken]);

    const attemptLogin = useCallback(async () => {
        loginButton();
        const res = await loginWithPassword(email!, password!, getOrCreateDeviceId());
        setLoginResult(res);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, loginButton, password]);

    const getLoginOption = useCallback(async () => {
        if (!email || !isEmail(email)) {
            setIsInvalidEmail(true);
            return;
        }
        let res = await determineLoginOptions({ variables: { email } });
        if (res.data!.userDetermineLoginOptions === 'deactivated') {
            setShowAccountDeactivatedModal(true);
        } else if (res.data!.userDetermineLoginOptions === 'password') {
            setShowPasswordField(true);
            setLoginEmail(email);
        } else if (res.data!.userDetermineLoginOptions === 'email') {
            requestToken();
        } else {
            setShowNoAccountModal(true);
        }
    }, [determineLoginOptions, email, requestToken]);

    const handleKeyPress = useCallback(
        (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
            if (e.nativeEvent.key === 'Enter') {
                if (!showPasswordField) {
                    getLoginOption();
                } else {
                    attemptLogin();
                }
            }
        },
        [attemptLogin, getLoginOption, showPasswordField]
    );

    const ContainerWidth = useBreakpointValue({
        base: '90%',
        lg: sizes['smallWidth'],
    });

    const resetPassword = async (pw: string) => {
        try {
            const res = await resetPW({
                variables: {
                    email: pw,
                    redirectTo: REDIRECT_PASSWORD,
                },
            });

            if (res.data!.tokenRequest) {
                setShowPasswordResetResult('success');
            } else if (res.errors) {
                if (res.errors[0].message.includes('Unknown User')) {
                    setShowPasswordResetResult('unknown');
                } else {
                    setShowPasswordResetResult('error');
                }
            }
        } catch (e: any) {
            if (e.message.includes('Unknown User')) {
                setShowPasswordResetResult('unknown');
            } else {
                setShowPasswordResetResult('unknown');
            }
        } finally {
            setShowPasswordModal(false);
        }
    };

    const PasswordModal: React.FC<{ showModal: boolean; email: string }> = ({ showModal, email }) => {
        const [pwEmail] = useState<string>(email);
        return (
            <Modal isOpen={showModal} onClose={() => setShowPasswordModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Body>
                        <VStack space={space['0.5']}>
                            <Text>{t('login.passwordReset.description', { email: pwEmail })}</Text>
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row space={space['0.5']}>
                            <DisableableButton
                                isDisabled={pwEmail.length < 6 || _resetPW?.loading}
                                reasonDisabled={_resetPW?.loading ? t('reasonsDisabled.loading') : t('registration.hint.password.length')}
                                onPress={() => resetPassword(pwEmail)}
                            >
                                {t('login.passwordReset.btn')}
                            </DisableableButton>
                        </Row>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        );
    };

    const NoAccountModal: React.FC<{
        email: string;
        showModal: boolean;
    }> = ({ email, showModal }) => {
        return (
            <Modal isOpen={showModal} onClose={() => setShowNoAccountModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>{t('login.accountNotFound.title')}</Modal.Header>
                    <Modal.Body>
                        <VStack space={space['0.5']}>
                            <Text>{t('login.accountNotFound.alert_html', { email: email })}</Text>
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row space={space['0.5']}>
                            <Button onPress={() => setShowNoAccountModal(false)}>{t('back')}</Button>
                        </Row>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        );
    };

    const AccountDeactivatedModal: React.FC<{
        showModal: boolean;
    }> = ({ showModal }) => {
        return (
            <Modal isOpen={showModal} onClose={() => setShowAccountDeactivatedModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>{t('login.accountDeactivated.title')}</Modal.Header>
                    <Modal.Body>
                        <VStack space={space['0.5']}>
                            <Text>{t('login.accountDeactivated.alert_html')}</Text>
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row space={space['0.5']}>
                            <Button onPress={() => setShowAccountDeactivatedModal(false)}>{t('back')}</Button>
                        </Row>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        );
    };

    useEffect(() => {
        if (loginEmail) {
            if (loginEmail !== email) {
                setPassword('');
                setShowPasswordField(false);
            }
        }
    }, [email, loginEmail]);

    return (
        <>
            <VStack overflowY={'auto'} height="100dvh">
                <Row flexDirection="column" justifyContent="center" alignItems="center">
                    <Box position="relative" width="100%" justifyContent="center" paddingY={6} marginBottom={space['5']}>
                        <Image
                            alt="Lernfair"
                            position="absolute"
                            zIndex="-1"
                            borderBottomRightRadius={15}
                            borderBottomLeftRadius={15}
                            width="100%"
                            height="100%"
                            source={{
                                uri: require('../assets/images/globals/lf-bg.png'),
                            }}
                        />
                        <Box textAlign="center" alignItems="center" justifyContent="center">
                            <Logo />
                        </Box>
                        <Heading width="100%" textAlign="center" paddingTop={space['1.5']} paddingBottom={space['0.5']}>
                            {t('login.title')}
                        </Heading>
                    </Box>

                    <Box marginX="90px" maxWidth={ContainerWidth} width="100%">
                        <Row marginBottom={3}>
                            <FormControl isInvalid={isInvalidEmail}>
                                <TextInput
                                    width="100%"
                                    isRequired={true}
                                    placeholder={t('email')}
                                    onChangeText={onChangeEmail}
                                    onKeyPress={handleKeyPress}
                                    isInvalid={isInvalidEmail}
                                />
                                <FormControl.ErrorMessage>{t('login.invalidMailMessage')}</FormControl.ErrorMessage>
                            </FormControl>
                        </Row>
                        {showEmailSent && <AlertMessage content={t('login.email.sent')} />}
                        {(showPasswordField && (
                            <Row marginBottom={3}>
                                <PasswordInput
                                    width="100%"
                                    type="password"
                                    isRequired={true}
                                    placeholder={t('password')}
                                    onChangeText={setPassword}
                                    onKeyPress={handleKeyPress}
                                    autoFocus
                                />
                            </Row>
                        )) || <input type="password" style={{ display: 'none' }} />}
                    </Box>
                    {loginResult?.errors && (
                        <Text paddingTop={4} color="danger.700" maxWidth={360} bold textAlign="center">
                            {t('login.error')}
                        </Text>
                    )}
                    {showPasswordResetResult && (
                        <Box maxWidth={ContainerWidth} width="100%">
                            <AlertMessage
                                content={
                                    showPasswordResetResult === 'success'
                                        ? t('login.passwordReset.alert.success')
                                        : showPasswordResetResult === 'error'
                                        ? t('login.passwordReset.alert.error')
                                        : t('login.passwordReset.alert.mailNotFound')
                                }
                            />
                        </Box>
                    )}
                    {showPasswordField && (
                        <Button marginY={4} variant="link" onPress={() => setShowPasswordModal(true)}>
                            {t('login.forgotPassword')}
                        </Button>
                    )}

                    <Box paddingTop={4} marginX="90px" display="block">
                        <DisableableButton
                            isDisabled={!email || email.length < 6 || _determineLoginOptions.loading || _sendToken.loading || (showPasswordField && !password)}
                            reasonDisabled={
                                _sendToken.loading || _determineLoginOptions.loading
                                    ? t('reasonsDisabled.loading')
                                    : !email || email.length < 6
                                    ? t('reasonsDisabled.invalidEMail')
                                    : t('reasonsDisabled.formIncomplete')
                            }
                            onPress={showPasswordField ? attemptLogin : getLoginOption}
                            width={'100%'}
                        >
                            {t('signin')}
                        </DisableableButton>
                    </Box>

                    <Box paddingTop={10} paddingBottom={1}>
                        <Text textAlign="center">{t('login.noaccount')}</Text>

                        <Button onPress={loginRegisterLink} variant="link">
                            {t('login.signupNew')}
                        </Button>
                        <Flex flexDirection="row" justifyContent="center" paddingTop="70px">
                            <Button
                                onPress={() => window.open('/datenschutz', '_blank')}
                                variant={'link'}
                                colorScheme={'primary.700'}
                                _text={{ fontWeight: 'medium' }}
                            >
                                {t('settings.legal.datapolicy')}
                            </Button>
                            <Button
                                onPress={() => window.open('/impressum', '_blank')}
                                variant={'link'}
                                colorScheme={'primary.700'}
                                _text={{ fontWeight: 'medium' }}
                            >
                                {t('settings.legal.imprint')}
                            </Button>
                            <SwitchLanguageButton />
                        </Flex>
                    </Box>
                </Row>
            </VStack>
            <PasswordModal showModal={showPasswordModal} email={email || ''} />
            <NoAccountModal showModal={showNoAccountModal} email={email || ''} />
            <AccountDeactivatedModal showModal={showAccountDeactivatedModal} />
        </>
    );
}
