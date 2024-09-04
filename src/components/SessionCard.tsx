import Card from './Card';
import { Button, Divider, Flex, Spacer, Spinner, Text, View, VStack } from 'native-base';
import Info from '../assets/icons/icon_info_dk_green.svg';
import { useTranslation } from 'react-i18next';
import { toTimerString } from '@/Utility';
import { DateTime } from 'luxon';

interface Props {
    userAgent: string;
    lastLogin: string;
    logOut: () => void;
    fetching: boolean;
    isCurrentSession: boolean;
}

const SessionCard: React.FC<Props> = ({ userAgent, lastLogin, logOut, fetching, isCurrentSession }) => {
    const { t } = useTranslation();
    return (
        <Card width={450} margin={10} padding={15} isFullHeight={false}>
            <Flex justifyContent={'center'} flexDirection={'row'} alignItems="center">
                <VStack flex={1} marginRight={5} justifyContent={'center'} height="100%">
                    <Flex alignItems={'center'} justifyContent={'left'} flexDirection={'row'}>
                        <View marginRight={3}>
                            <Info width="28" height="28" />
                        </View>
                        <Text fontWeight={700}>{userAgent.split(',')[2]}</Text>
                    </Flex>
                    <Spacer h={3} />
                    <Divider />
                    <Spacer h={3} />
                    {lastLogin ? (
                        <Text>
                            {t('sessionManager.lastUsed')} {toTimerString(DateTime.now(), DateTime.fromJSDate(new Date(lastLogin)))}
                        </Text>
                    ) : (
                        <Text>Nie benutzt</Text>
                    )}
                </VStack>
                {isCurrentSession ? (
                    <Flex>
                        <Text>Dieses Gerät</Text>
                    </Flex>
                ) : fetching ? (
                    <Spinner />
                ) : (
                    <Button onPress={logOut} flex={0} flexBasis={'100px'} height="100%" disabled={fetching}>
                        Log out
                    </Button>
                )}
            </Flex>
        </Card>
    );
};

export default SessionCard;
