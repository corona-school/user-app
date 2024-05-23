import { Button, Flex, HStack, Heading, Modal, Text, VStack, useTheme } from 'native-base';
import { useWebPush } from '../lib/WebPush';
import Icon from '../assets/icons/lernfair/ic_email.svg';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import { useNavigate } from 'react-router-dom';

export function WebPush() {
    const { space } = useTheme();
    const navigate = useNavigate();
    const { status, subscribe } = useWebPush();

    return (
        <>
            <Flex p={space['1']} flex="1" alignItems="center" justifyContent="center" bgColor="primary.900">
                <VStack>
                    <HStack>
                        <Icon />
                        <Heading fontSize="lg" paddingTop="30px" paddingLeft="10px" size="sm" textAlign="left" color="lightText">
                            Push Benachrichtigungen
                        </Heading>
                    </HStack>
                    <Text color="white" paddingTop="50px">
                        {status === 'loading' && <CenterLoadingSpinner />}
                        {status === 'not-supported' && <Text>Leider werden auf diesem Gerät keine Push-Benachrichtigungen unterstützt</Text>}
                        {status === 'user-denied' && (
                            <Text>Wir können dir leider keine Push-Benachrichtigungen senden, da du uns dazu keine Erlaubnis gegeben hast.</Text>
                        )}
                        {(status === 'ask-user' || status === 'not-subscribed') && (
                            <>
                                <Text>Willst du, das wir dir Push-Benachrichtigungen senden?</Text>
                                <Button onPress={subscribe}>Ja!</Button>
                            </>
                        )}
                        {status === 'subscribed' && <Text>Push Benachrichtigungen eingerichtet!</Text>}
                    </Text>
                    <Button marginTop="20px" onPress={() => navigate('/')}>
                        Zurück zur App
                    </Button>
                </VStack>
            </Flex>
        </>
    );
}
