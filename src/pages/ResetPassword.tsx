import { VStack, Flex, Box, useTheme, Image, Heading, Row, Button, useBreakpointValue, Modal, Stack, Text } from 'native-base';
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
import WithNavigation from '../components/WithNavigation';
import SwitchLanguageButton from '../components/SwitchLanguageButton';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { Breadcrumb } from '@/components/Breadcrumb';

type Props = {
    layout: 'new-pw' | 'reset-pw';
};

const ResetPassword: React.FC<Props> = ({ layout }) => {
    const { sessionState } = useApollo();
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

    const isMobileSM = useBreakpointValue({
        base: true,
        sm: false,
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
        if (sessionState === 'logged-in') {
            log('PasswordReset', 'Already logged in');
            setShowResetPassword('success');
            return;
        }
        if (sessionState === 'error') {
            log('PasswordReset', 'Session state changed to error');
            setShowResetPassword('error');
            return;
        }
    }, [setShowResetPassword, sessionState]);

    const onNext = () => {
        const redirectTo = searchParams?.get('redirectTo');
        navigate(redirectTo || '/');
    };

    return (
        <WithNavigation
            hideMenu={isMobileSM}
            previousFallbackRoute="/settings"
            headerLeft={
                !isMobileSM && (
                    <Stack alignItems="center" direction="row">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </Stack>
                )
            }
        >
            <Flex overflowY={'auto'} height="100dvh">
                <>
                    {layout === 'new-pw' ? (
                        <>
                            <Breadcrumb />
                            <Box paddingY={space['2']} justifyContent="center" alignItems="center">
                                <Logo />
                                <Heading mt={space['1']}>{t('set_password.title')}</Heading>
                            </Box>
                        </>
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
                            <Heading mt={space['1']}>{t('set_password.title')}</Heading>
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
                                        isDisabled={!password.length || password.length !== passwordRepeat.length}
                                    >
                                        {t('set_password.change')}
                                    </Button>
                                </Row>
                            </>
                        )}
                        {showResetPassword === 'error' && (
                            <>
                                <Heading>{t('set_password.error')}</Heading>
                            </>
                        )}
                    </VStack>
                </>
            </Flex>
            <Modal isOpen={showSuccessModal} onClose={onNext}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>{t('set_password.success_title')}</Modal.Header>
                    <Modal.Body>{t('set_password.success_subtitle')}</Modal.Body>
                    <Modal.Footer>
                        <Row space={space['0.5']}>
                            <Button onPress={onNext}>{t('next')}</Button>
                        </Row>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={showErrorModal} onClose={() => navigate('/login')}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>{t('set_password.failure_title')}</Modal.Header>
                    <Modal.Body>{t('set_password.failure_subtitle')}</Modal.Body>
                    <Modal.Footer>
                        <Row space={space['0.5']}>
                            <Button onPress={() => navigate('/login')}>{t('next')}</Button>
                        </Row>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </WithNavigation>
    );
};
export default ResetPassword;
