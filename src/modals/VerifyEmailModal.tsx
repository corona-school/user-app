import { gql } from './../gql';
import { useMutation } from '@apollo/client';
import { Text, VStack, Heading, Button, useTheme, useBreakpointValue, Flex, Box } from 'native-base';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../assets/icons/lernfair/ic_email.svg';
import AlertMessage from '../widgets/AlertMessage';
import { REDIRECT_OPTIN } from '../Utility';
import useModal from '../hooks/useModal';

type Props = {
    email?: string;
};

const VerifyEmailModal: React.FC<Props> = ({ email }) => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { hide } = useModal();

    const [showSendEmailResult, setShowSendEmailResult] = useState<'success' | 'error' | undefined>();

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const [sendVerification, _sendVerification] = useMutation(
        gql(`
        mutation RequestVerifyEmail($email: String!, $redirectTo: String!) {
        tokenRequest(email: $email, action: "user-verify-email", redirectTo: $redirectTo)
        }
    `)
    );

    const requestEmailVerification = useCallback(async () => {
        const res = await sendVerification({
            variables: {
                email: email!,
                redirectTo: REDIRECT_OPTIN,
            },
        });

        setShowSendEmailResult(res.data?.tokenRequest ? 'success' : 'error');
    }, [email, sendVerification]);

    return (
        <Flex p={space['1']} flex="1" alignItems="center" justifyContent="center" bgColor="primary.900">
            <VStack w={ContentContainerWidth} space={space['1']} flex="1" alignItems="center">
                <Icon />
                <Heading size="md" textAlign="center" color="lightText">
                    {t('registration.verifyemail.title')}
                </Heading>
                {email && (
                    <>
                        <Text color="lightText">
                            {t('registration.verifyemail.mailsendto', {
                                email: email,
                            })}
                        </Text>
                    </>
                )}
                <Text color="lightText" textAlign={'center'}>
                    {t('registration.verifyemail.description')}
                </Text>
                <Text bold color="lightText">
                    {t('registration.verifyemail.notreceived')}
                </Text>
                <Button isDisabled={_sendVerification?.loading} onPress={requestEmailVerification} variant={'link'}>
                    {t('registration.verifyemail.resend.button')}
                </Button>
                {showSendEmailResult && (
                    <Box width="100%">
                        <AlertMessage
                            content={
                                showSendEmailResult === 'success'
                                    ? t('registration.verifyemail.resend.successAlert')
                                    : t('registration.verifyemail.resend.failedAlert')
                            }
                        />
                    </Box>
                )}
            </VStack>
        </Flex>
    );
};
export default VerifyEmailModal;
