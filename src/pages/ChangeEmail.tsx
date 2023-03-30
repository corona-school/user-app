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
import { useUserAuth } from '../hooks/useApollo';

const ChangeEmail = () => {
    const [newEmail, setNewEmail] = useState<string>();
    const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
    const [showEmailSent, setShowEmailSent] = useState<boolean>();
    const { userId } = useUserAuth();

    const { space, sizes } = useTheme();
    const { t } = useTranslation();

    const [changeEmail] = useMutation(
        gql(`
        mutation changeEmail($email: String!, $userId: String!) {
            meEmailChange(email: $email, userId: $userId) 
        }`)
    );
    const ContainerWidth = useBreakpointValue({
        base: '90%',
        lg: sizes['formsWidth'],
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const handleKeyPress = useCallback(() => {
        if (!newEmail || !isEmail(newEmail)) {
            setIsValidEmail(false);
            return;
        }
        setIsValidEmail(true);
    }, [newEmail]);

    const resetEmail = useCallback(async () => {
        if (newEmail && userId) {
            const res = await changeEmail({ variables: { email: newEmail, userId: userId } });
            if (res) setShowEmailSent(true);
        }
    }, [changeEmail, newEmail, userId]);

    return (
        <WithNavigation showBack hideMenu>
            <Flex overflowY="auto" height="100vh">
                <Box position="relative" paddingY={space['2']} justifyContent="center" alignItems="center">
                    <Logo />
                    <Heading mt={space['1']}>{t('login.setNewEmail')}</Heading>
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
                        <Button width={buttonWidth} isDisabled={!isValidEmail} onPress={resetEmail}>
                            {t('login.changeEmail')}
                        </Button>
                    </Row>
                </VStack>
            </Flex>
        </WithNavigation>
    );
};

export default ChangeEmail;
