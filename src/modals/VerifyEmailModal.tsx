import { gql, useMutation } from '@apollo/client';
import { Text, VStack, Heading, Button, useTheme, useBreakpointValue, Flex, Box } from 'native-base';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../assets/icons/lernfair/ic_email.svg';
import AlertMessage from '../widgets/AlertMessage';
import { REDIRECT_OPTIN } from '../Utility';
import useModal from '../hooks/useModal';

type Props = {
    email?: string;
};

const VerifyEmailModal: React.FC<Props> = ({ email }) => {
    const { space, sizes } = useTheme();
    const navigate = useNavigate();
    const { setShow } = useModal();

    const goToWelcome = useCallback(() => {
        navigate('/welcome');
        setShow(false);
    }, [navigate, setShow]);

    const [showSendEmailResult, setShowSendEmailResult] = useState<'success' | 'error' | undefined>();

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const [sendVerification, _sendVerification] = useMutation(gql`
    mutation RequestVerifyEmail($email: String!) {
      tokenRequest(email: $email, action: "user-verify-email", redirectTo: "${REDIRECT_OPTIN}")
    }
  `);

    const requestEmailVerification = useCallback(async () => {
        const res = await sendVerification({
            variables: {
                email,
            },
        });

        setShowSendEmailResult(res.data?.tokenRequest ? 'success' : 'error');
    }, [email, sendVerification]);

    return (
        <Flex p={space['1']} flex="1" alignItems="center" justifyContent="center" bgColor="primary.900">
            <VStack w={ContentContainerWidth} space={space['1']} flex="1" alignItems="center">
                <Icon />
                <Heading size="md" textAlign="center" color="lightText">
                    Fast geschafft!
                </Heading>
                {email && (
                    <>
                        <Text color="lightText">{`Wir haben eine E-Mail an`}</Text>
                        <Text color="lightText">{email} gesendet. </Text>
                    </>
                )}
                <Text color="lightText" textAlign={'center'}>
                    Bevor du unser Angebot nutzen kannst, musst du deine E-Mailadresse bestätigen und den AGB zustimmen. Wenn du deine E-Mailadresse bestätigt
                    hast, wirst du automatisch weitergeleitet.
                </Text>
                <Text bold color="lightText">
                    Keine E-Mail erhalten?
                </Text>
                <Button onPress={goToWelcome}>Fenster schließen</Button>
                <Button isDisabled={_sendVerification?.loading} onPress={requestEmailVerification} variant={'link'}>
                    Erneut senden
                </Button>
                {showSendEmailResult && (
                    <Box width="100%">
                        <AlertMessage
                            content={
                                showSendEmailResult === 'success'
                                    ? 'Wir haben dir eine E-Mail gesendet. Bitte überprüfe deinen Posteingang.'
                                    : 'Leider ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
                            }
                        />
                    </Box>
                )}
            </VStack>
        </Flex>
    );
};
export default VerifyEmailModal;
