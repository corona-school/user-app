import { VStack, Heading, Button, Flex, Box, Image, useTheme, useBreakpointValue } from 'native-base';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../assets/icons/lernfair/lf-logo.svg';
import useApollo from '../hooks/useApollo';
import { useTranslation } from 'react-i18next';

const VerifyEmail: React.FC = () => {
    const { space, sizes } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams?.get('redirectTo');
    const redirectEncoded = redirectTo ? window.atob(redirectTo) : '/';

    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const { sessionState } = useApollo();

    useEffect(() => {
        if (sessionState === 'logged-in') {
            setShowSuccess(true);
        }
        if (sessionState === 'error') {
            navigate('/login', { state: { error: 'token-invalid' } });
        }
    }, [navigate, sessionState, redirectEncoded]);

    const ContainerWidth = useBreakpointValue({
        base: '90%',
        lg: sizes['formsWidth'],
    });

    return (
        <Flex overflowY={'auto'} height="100dvh">
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
                    <Heading mt={space['1']}>{t('verify_email.title')}</Heading>
                </Box>
                <VStack space={space['1']} paddingX={space['1']} mt={space['4']} marginX="auto" width={ContainerWidth} justifyContent="center">
                    {(showSuccess && (
                        <VStack>
                            <Heading>{t('verify_email.success')}</Heading>
                            <Button marginTop={space['1']} onPress={() => navigate(redirectEncoded, { state: {} })}>
                                {t('verify_email.proceed')}
                            </Button>
                        </VStack>
                    )) || <Heading>{t('verify_email.invalid')}</Heading>}
                </VStack>
            </>
        </Flex>
    );
};
export default VerifyEmail;
