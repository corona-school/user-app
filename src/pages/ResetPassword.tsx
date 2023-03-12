import { VStack, Flex, Box, useTheme, Image, Heading, Row, Button, useBreakpointValue, Modal, Text } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import Logo from '../assets/icons/lernfair/lf-logo.svg';
import { gql } from './../gql';
import { useMutation } from '@apollo/client';
import useApollo from '../hooks/useApollo';
import AlertMessage from '../widgets/AlertMessage';
import { log } from '../log';

type Props = {
    layout: 'new-pw' | 'reset-pw';
};

const ResetPassword: React.FC<Props> = ({ layout }) => {
    const { onLogin, client, sessionState } = useApollo();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [password, setPassword] = useState<string>('');
    const [passwordRepeat, setPasswordRepeat] = useState<string>('');
    const { space, sizes } = useTheme();
    const [showResetPassword, setShowResetPassword] = useState<string>();
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
    const [showPasswordLength, setShowPasswordLength] = useState<boolean>(false);
    const [showPasswordConfirmNoMatch, setShowPasswordConfirmNoMatch] = useState(false);

    const [changePassword] = useMutation(
        gql(`
        mutation changePassword($password: String!) {
            passwordCreate(password: $password)
        }
    `)
    );

    const ContainerWidth = useBreakpointValue({
        base: '90%',
        lg: sizes['formsWidth'],
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const resetPassword = useCallback(async () => {
        const passwordLengthCheck = password.length >= 6;
        const passwordMismatchCheck = password === passwordRepeat;
        setShowPasswordLength(!passwordLengthCheck);
        setShowPasswordConfirmNoMatch(!passwordMismatchCheck);

        if (!passwordLengthCheck || !passwordMismatchCheck) return;

        const res = await changePassword({ variables: { password } });
        if (res.data?.passwordCreate) {
            setShowSuccessModal(true);
        } else {
            setShowErrorModal(true);
        }
    }, [changePassword, password, passwordRepeat]);

    useEffect(() => {
        (async function () {
            // Ensure the user is logged in
            // Either they already have a session ...
            if (sessionState === 'logged-in') {
                log('PasswordReset', 'Already logged in');
                setShowResetPassword('success');
                return;
            }

            const token = searchParams?.get('secret_token');
            if (!token) {
                log('PasswordReset', 'No token present');
                setShowResetPassword('error');
                return;
            }

            try {
                const loginResult = await client.mutate({
                    mutation: gql(`
                        mutation LoginToken($token: String!) {
                            loginToken(token: $token)
                        }
                    `),
                    variables: { token },
                });
                log('PasswordReset', 'Logged in with token');
                onLogin(loginResult);
                setShowResetPassword('success');
            } catch (error) {
                log('Password Reset', 'Failed to log in with token', error);
                setShowResetPassword('error');
            }
        })();
    }, [searchParams, setShowResetPassword, client, onLogin, sessionState]);

    const onNext = () => {
        const redirectTo = searchParams?.get('redirectTo');
        navigate(redirectTo || '/');
    };

    return (
        <>
            <Flex overflowY={'auto'} height="100vh">
                <>
                    {layout === 'new-pw' ? (
                        <Box paddingY={space['2']} justifyContent="center" alignItems="center">
                            <Logo />
                            <Heading mt={space['1']}>Passwort neu setzen</Heading>
                        </Box>
                    ) : (
                        <Box position="relative" paddingY={space['2']} mb={space['3']} justifyContent="center" alignItems="center">
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
                            <Logo />
                            <Heading mt={space['1']}>Passwort neu setzen</Heading>
                        </Box>
                    )}
                    <VStack space={space['1']} paddingX={space['1']} mt={space['1']} marginX="auto" width={ContainerWidth} justifyContent="center">
                        {showResetPassword === 'success' && (
                            <>
                                <PasswordInput placeholder={'Neues Passwort'} value={password} onChangeText={setPassword} />
                                <PasswordInput placeholder={'Neues Passwort wiederholen'} value={passwordRepeat} onChangeText={setPasswordRepeat} />
                                <Text paddingBottom="10px" fontSize="xs" color="primary.grey">
                                    {t('registration.hint.password.length')}
                                </Text>
                                {showPasswordLength && <AlertMessage content={t('registration.hint.password.length')} />}
                                {showPasswordConfirmNoMatch && <AlertMessage content={t('registration.hint.password.nomatch')} />}
                                <Row justifyContent="center">
                                    <Button
                                        width={buttonWidth}
                                        onPress={resetPassword}
                                        isDisabled={!password.length || password.length != passwordRepeat.length}
                                    >
                                        Passwort ändern
                                    </Button>
                                </Row>
                            </>
                        )}
                        {showResetPassword === 'error' && (
                            <>
                                <Heading>Es ist ein Fehler aufgetreten. Bitte versuche es erneut.</Heading>
                            </>
                        )}
                    </VStack>
                </>
            </Flex>
            <Modal isOpen={showSuccessModal} onClose={onNext}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Passwort erfolgreich geändert</Modal.Header>
                    <Modal.Body>Dein Passwort wurde erfolgreich geändert. Du kannst dich nun mit dem neuen Passwort einloggen</Modal.Body>
                    <Modal.Footer>
                        <Row space={space['0.5']}>
                            <Button onPress={onNext}>Weiter</Button>
                        </Row>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={showErrorModal} onClose={() => navigate('/login')}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Fehler: Passwort nicht geändert</Modal.Header>
                    <Modal.Body>
                        Dein Passwort konnte leider nicht geändert werden. Bitte versuche es erneut. Sollte der Fehler weiterhin auftreten, schicke eine neue
                        E-Mail oder wende dich bitte an den Support.
                    </Modal.Body>
                    <Modal.Footer>
                        <Row space={space['0.5']}>
                            <Button onPress={() => navigate('/login')}>Weiter</Button>
                        </Row>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
};
export default ResetPassword;
