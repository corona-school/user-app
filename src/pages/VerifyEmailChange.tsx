import { useMutation } from '@apollo/client';
import { gql } from '../gql/gql';
import { VStack, Heading, Button, Flex, Box, Image, useTheme, useBreakpointValue } from 'native-base';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../assets/icons/lernfair/lf-logo.svg';
import useApollo from '../hooks/useApollo';
import { useTranslation } from 'react-i18next';

const VerifyEmailChange: React.FC = () => {
    const { space, sizes } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const token = searchParams?.get('secret_token') || '';

    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const { sessionState } = useApollo();

    const [verifyNewEmail] = useMutation(
        gql(`mutation verifyNewEmail($token: String!) {
            meChangeEmailVerify(token: $token)
        }
    `)
    );

    useEffect(() => {
        verifyNewEmail({ variables: { token } });
    }, [token, verifyNewEmail]);

    useEffect(() => {
        if (sessionState === 'logged-in') {
            setShowSuccess(true);
        }
        if (sessionState === 'error') {
            navigate('/login');
        }
    }, [navigate, sessionState]);

    const ContainerWidth = useBreakpointValue({
        base: '90%',
        lg: sizes['formsWidth'],
    });

    return (
        <Flex overflowY={'auto'} height="100vh">
            <>
                <Box position="relative" paddingY={space['2']} justifyContent="center" alignItems="center">
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
                    <Heading mt={space['1']}>{t('login.emailVerification')}</Heading>
                </Box>
                <VStack space={space['1']} paddingX={space['1']} mt={space['4']} marginX="auto" width={ContainerWidth} justifyContent="center">
                    {(showSuccess && (
                        <VStack>
                            <Heading></Heading>
                            <Button marginTop={space['1']} onPress={() => navigate('/start', { state: { token } })}>
                                {t('continue')}
                            </Button>
                        </VStack>
                    )) || <Heading>{t('login.invalidToken')}</Heading>}
                </VStack>
            </>
        </Flex>
    );
};
export default VerifyEmailChange;
