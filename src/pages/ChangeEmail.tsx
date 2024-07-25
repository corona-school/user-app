import { Box, Flex, Heading, useBreakpointValue, useTheme, VStack, Row, FormControl, Stack } from 'native-base';
import WithNavigation from '../components/WithNavigation';
import Logo from '../assets/icons/lernfair/lf-logo.svg';
import { useTranslation } from 'react-i18next';
import TextInput from '../components/TextInput';
import { useCallback, useMemo, useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import AlertMessage from '../widgets/AlertMessage';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../gql';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import DisableableButton from '../components/DisablebleButton';
import SwitchLanguageButton from '../components/SwitchLanguageButton';
import NotificationAlert from '../components/notifications/NotificationAlert';

const ChangeEmail = () => {
    const [newEmail, setNewEmail] = useState<string>();
    const [showEmailSent, setShowEmailSent] = useState<boolean>();

    const { space, sizes } = useTheme();
    const { t } = useTranslation();

    const { data, loading } = useQuery(
        gql(`
            query MyEmail {
                me {
                    firstname
                    email
                }
            }
        `)
    );

    const [changeEmail] = useMutation(
        gql(`
        mutation ChangeEmail($email: String!) {
            meChangeEmail(email: $email)
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

    const canChange = useMemo(() => {
        if (newEmail) {
            return isEmail(newEmail);
        }
    }, [newEmail]);

    const resetEmail = useCallback(async () => {
        if (newEmail) {
            const res = await changeEmail({ variables: { email: newEmail } });
            if (res) setShowEmailSent(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newEmail]);

    return (
        <WithNavigation
            showBack={isMobileSM ? true : false}
            hideMenu={isMobileSM ? true : false}
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
            {loading || !data ? (
                <CenterLoadingSpinner />
            ) : (
                <Flex overflowY="auto" height="100dvh">
                    <Box position="relative" paddingY={space['2']} justifyContent="center" alignItems="center">
                        <Logo />
                        <Heading mt={space['1']}>{t('login.setNewEmail')}</Heading>
                    </Box>
                    <VStack space={space['1']} paddingX={space['1']} mt={space['1']} marginX="auto" width={ContainerWidth} justifyContent="center">
                        <Row>
                            <FormControl>
                                <TextInput isReadOnly placeholder={t('login.currentEmail')} value={data?.me?.email} />
                            </FormControl>
                        </Row>
                        <Row marginBottom={3}>
                            <FormControl>
                                <TextInput width="100%" isRequired={true} value={newEmail} placeholder={'Neue E-Mail'} onChangeText={setNewEmail} />
                            </FormControl>
                        </Row>
                        {showEmailSent && <AlertMessage content={t('login.email.sent')} />}
                        <Row justifyContent="center">
                            <DisableableButton
                                isDisabled={!canChange}
                                reasonDisabled={t('reasonsDisabled.invalidEMail')}
                                width={buttonWidth}
                                onPress={resetEmail}
                            >
                                {t('login.changeEmail')}
                            </DisableableButton>
                        </Row>
                    </VStack>
                </Flex>
            )}
        </WithNavigation>
    );
};

export default ChangeEmail;
