import { Box, Flex, Heading, useBreakpointValue, useTheme, VStack, Row, FormControl, Button } from 'native-base';
import WithNavigation from '../components/WithNavigation';
import Logo from '../assets/icons/lernfair/lf-logo.svg';
import { useTranslation } from 'react-i18next';
import TextInput from '../components/TextInput';
import { useCallback, useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import AlertMessage from '../widgets/AlertMessage';
import { useMutation } from '@apollo/client';
import { gql } from '../gql/gql';

const ChangeEmail = () => {
    const [newEmail, setNewEmail] = useState<string>();
    const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
    const [showEmailSent, setShowEmailSent] = useState<boolean>();

    const retainPath = '/start';

    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const ContainerWidth = useBreakpointValue({
        base: '90%',
        lg: sizes['formsWidth'],
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const [sendToken, _sendToken] = useMutation(
        gql(`
        mutation Authenticate($email: String!, $redirectTo: String!) {
            tokenRequest(email: $email, action: "user-authenticate", redirectTo: $redirectTo)
        }
    `)
    );

    const requestToken = useCallback(async () => {
        const res = await sendToken({
            variables: {
                email: newEmail!,
                redirectTo: retainPath,
            },
        });
        if (res.data!.tokenRequest) {
            setShowEmailSent(true);
        } else if (res.errors) {
            setShowEmailSent(false);
        }
    }, [newEmail, sendToken]);

    const handleKeyPress = useCallback(() => {
        if (!newEmail || !isEmail(newEmail)) {
            setIsValidEmail(false);
            return;
        }
        setIsValidEmail(true);
    }, [newEmail]);

    const sendVerificationEmail = useCallback(() => {
        console.log('verify email');
        requestToken();
        setShowEmailSent(true);
    }, []);

    return (
        <WithNavigation showBack hideMenu>
            <Flex overflowY="auto" height="100vh">
                <Box position="relative" paddingY={space['2']} justifyContent="center" alignItems="center">
                    <Logo />
                    <Heading mt={space['1']}>E-Mail neu setzen</Heading>
                </Box>
                <VStack space={space['1']} paddingX={space['1']} mt={space['1']} marginX="auto" width={ContainerWidth} justifyContent="center">
                    <Row marginBottom={3}>
                        <FormControl isInvalid={!isValidEmail}>
                            <TextInput
                                width="100%"
                                isRequired={true}
                                value={newEmail}
                                placeholder={'Neue E-Mail'}
                                onChangeText={setNewEmail}
                                onKeyPress={handleKeyPress}
                                isInvalid={!isValidEmail}
                            />
                            <FormControl.ErrorMessage>{t('login.invalidMailMessage')}</FormControl.ErrorMessage>
                        </FormControl>
                    </Row>
                    {showEmailSent && <AlertMessage content={t('login.email.sent')} />}
                    <Row justifyContent="center">
                        <Button width={buttonWidth} isDisabled={!isValidEmail} onPress={sendVerificationEmail}>
                            E-Mail ändern
                        </Button>
                    </Row>
                </VStack>
            </Flex>
        </WithNavigation>
    );
};

export default ChangeEmail;
