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
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

const ChangeEmail = () => {
    const [newEmail, setNewEmail] = useState<string>();
    const [isInvalidEmail, setIsInvalidEmail] = useState<boolean>(false);
    const [canCreate, setCanCreate] = useState<boolean>(false);
    const [showEmailSent, setShowEmailSent] = useState<boolean>();

    const { space, sizes } = useTheme();
    const { t } = useTranslation();

    const [changeEmail] = useMutation(
        gql(`
        mutation changeEmail($email: String!) {
            meEmailChange(email: $email) 
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

    const handleKeyPress = useCallback(
        (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
            if (e.nativeEvent.key === 'Enter') {
                if (!newEmail || !isEmail(newEmail)) {
                    console.log('email is invalid');
                    setIsInvalidEmail(true);
                    setCanCreate(false);
                    return;
                }
                console.log('email is valid');
                setCanCreate(true);
                setIsInvalidEmail(false);
            }
        },
        [newEmail]
    );

    const resetEmail = useCallback(async () => {
        if (newEmail) {
            const res = await changeEmail({ variables: { email: newEmail } });
            if (res) setShowEmailSent(true);
        }
    }, [changeEmail, newEmail]);

    return (
        <WithNavigation showBack hideMenu>
            <Flex overflowY="auto" height="100vh">
                <Box position="relative" paddingY={space['2']} justifyContent="center" alignItems="center">
                    <Logo />
                    <Heading mt={space['1']}>{t('login.setNewEmail')}</Heading>
                </Box>
                <VStack space={space['1']} paddingX={space['1']} mt={space['1']} marginX="auto" width={ContainerWidth} justifyContent="center">
                    <Row marginBottom={3}>
                        <FormControl isInvalid={isInvalidEmail}>
                            <TextInput
                                width="100%"
                                isRequired={true}
                                value={newEmail}
                                placeholder={'Neue E-Mail'}
                                onChangeText={setNewEmail}
                                onKeyPress={handleKeyPress}
                                isInvalid={isInvalidEmail}
                            />
                            <FormControl.ErrorMessage>{t('login.invalidMailMessage')}</FormControl.ErrorMessage>
                        </FormControl>
                    </Row>
                    {showEmailSent && <AlertMessage content={t('login.email.sent')} />}
                    <Row justifyContent="center">
                        <Button width={buttonWidth} isDisabled={!canCreate} onPress={resetEmail}>
                            {t('login.changeEmail')}
                        </Button>
                    </Row>
                </VStack>
            </Flex>
        </WithNavigation>
    );
};

export default ChangeEmail;
