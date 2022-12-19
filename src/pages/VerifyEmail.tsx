import { gql } from './../gql';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { VStack, Heading, Button, Flex, Box, Image, useTheme, useBreakpointValue } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import Logo from '../assets/icons/lernfair/lf-logo.svg';
import useApollo from '../hooks/useApollo';
import useLernfair from '../hooks/useLernfair';
import { LFUserType } from '../types/lernfair/User';

type Props = {};

const VerifyEmail: React.FC<Props> = () => {
    const { space, sizes } = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams?.get('secret_token') || '';
    const redirectTo = searchParams?.get('redirectTo');
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const { onLogin } = useApollo();

    const [loginToken, loginResult] = useMutation(
        gql(`
        mutation LoginTokenOnEmailVerification($token: String!) {
            loginToken(token: $token)
        }
    `)
    );

    const [meQuery, { data: meData }] = useLazyQuery(
        gql(`
        query GetMyId {
            me {
                pupil {
                    id
                }
                student {
                    id
                }
            }
        }
    `)
    );

    const login = useCallback(async () => {
        const res = (await loginToken({ variables: { token } })) as {
            errors?: GraphQLError[];
            data?: {
                loginToken?: boolean;
            };
        };
        onLogin(res);

        if (!res.errors) {
            if (res.data?.loginToken) {
                await meQuery();
                setShowSuccess(true);
            } else {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginToken, navigate, token]);

    useEffect(() => {
        if (token) login();
    }, [login, token]);

    // determine user type based on data available
    const userType: LFUserType = useMemo(() => {
        if (meData?.me?.student?.id) return 'student';
        else if (meData?.me?.pupil?.id) return 'pupil';
        else return 'unknown';
    }, [meData?.me]);

    const ContainerWidth = useBreakpointValue({
        base: '90%',
        lg: sizes['formsWidth'],
    });

    if (loginResult.loading) return <CenterLoadingSpinner />;

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
                    <Heading mt={space['1']}>E-Mail Verifizierung</Heading>
                </Box>
                <VStack space={space['1']} paddingX={space['1']} mt={space['4']} marginX="auto" width={ContainerWidth} justifyContent="center">
                    {(showSuccess && (
                        <VStack>
                            <Heading>Dein Account wurde aktiviert!</Heading>
                            <Button marginTop={space['1']} onPress={() => navigate(redirectTo || '/', { state: { token } })}>
                                Fortfahren
                            </Button>
                        </VStack>
                    )) || <Heading>Token ungültig</Heading>}
                </VStack>
            </>
        </Flex>
    );
};
export default VerifyEmail;
