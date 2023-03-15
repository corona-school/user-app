import { useCallback, useEffect, useState } from 'react';
import { gql } from '../gql';
import { FetchResult, useMutation } from '@apollo/client';
import Logo from '../assets/icons/lernfair/lf-logo.svg';

import { Box, Button, Heading, Image, Modal, Row, Text, useBreakpointValue, useTheme, VStack, Link } from 'native-base';
import useApollo from '../hooks/useApollo';
import { useLocation, useNavigate } from 'react-router-dom';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { useTranslation } from 'react-i18next';
import TextInput from '../components/TextInput';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import PasswordInput from '../components/PasswordInput';
import AlertMessage from '../widgets/AlertMessage';
import { REDIRECT_PASSWORD } from '../Utility';

export default function Login() {
    const { t } = useTranslation();
    const { onLogin, sessionState, loginWithPassword } = useApollo();
    const { space, sizes } = useTheme();
    const [showNoAccountModal, setShowNoAccountModal] = useState(false);
    const [email, setEmail] = useState<string>();
    const [showEmailSent, setShowEmailSent] = useState(false);
    const [loginEmail, setLoginEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [showPasswordField, setShowPasswordField] = useState<boolean>(false);
    const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
    const [showPasswordResetResult, setShowPasswordResetResult] = useState<'success' | 'error' | 'unknown' | undefined>();
    const [loginResult, setLoginResult] = useState<FetchResult>();

    const location = useLocation();
    const locState = location.state as { retainPath: string };
    const retainPath = locState?.retainPath;

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

    useEffect(() => {
        if (sessionState === 'logged-in') navigate(retainPath);
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
    }, [email, sendToken]);

    const attemptLogin = useCallback(async () => {
        loginButton();
        const res = await loginWithPassword(email!, password!);
        onLogin(res);
        setLoginResult(res);
    }, [email, loginButton, password]);

    const getLoginOption = useCallback(async () => {
        if (!email || email.length < 6) return;
        const res = await determineLoginOptions({ variables: { email } });
        if (res.data!.userDetermineLoginOptions === 'password') {
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
                            <Button isDisabled={pwEmail.length < 6 || _resetPW?.loading} onPress={() => resetPassword(pwEmail)}>
                                {t('login.passwordReset.btn')}
                            </Button>
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
                            <Button onPress={() => setShowNoAccountModal(false)}>{t('ok')}</Button>
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
            <VStack overflowY={'auto'} height="100vh">
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
                            <TextInput width="100%" isRequired={true} placeholder={t('email')} onChangeText={setEmail} onKeyPress={handleKeyPress} />
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
                        <Button
                            onPress={showPasswordField ? attemptLogin : getLoginOption}
                            width="100%"
                            isDisabled={!email || email.length < 6 || _determineLoginOptions.loading || _sendToken.loading}
                        >
                            {t('signin')}
                        </Button>
                    </Box>

                    <Box paddingTop={10} paddingBottom={1}>
                        <Text textAlign="center">{t('login.noaccount')}</Text>

                        <Button onPress={loginRegisterLink} variant="link">
                            {t('login.signupNew')}
                        </Button>
                        <Text textAlign="center" paddingTop="70px">
                            <Link onPress={() => window.open('/datenschutz', '_blank')}>{t('settings.legal.datapolicy')}</Link>
                            <Text>{'  '}</Text>
                            <Link onPress={() => window.open('/impressum', '_blank')}>{t('settings.legal.imprint')}</Link>
                        </Text>
                    </Box>
                </Row>
            </VStack>
            <PasswordModal showModal={showPasswordModal} email={email || ''} />
            <NoAccountModal showModal={showNoAccountModal} email={email || ''} />
        </>
    );
}
