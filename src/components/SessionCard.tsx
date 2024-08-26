import Card from './Card';
import { Button, Divider, Flex, HStack, Image, Spacer, Text, useTheme, View, VStack } from 'native-base';
import Info from '../assets/icons/icon_info_dk_green.svg';
import { useTranslation } from 'react-i18next';

interface Props {
    device: 'Mobil' | 'Desktop';
    userAgent: string;
    lastLogin: string;
    logOut: () => void;
    buttonDisabled: boolean;
}

const SessionCard: React.FC<Props> = ({ device, userAgent, lastLogin, logOut, buttonDisabled }) => {
    const { sizes } = useTheme();
    const { t } = useTranslation();
    return (
        <Card width={450} margin={10} padding={15} isFullHeight={false}>
            <Flex justifyContent={'center'} flexDirection={'row'} alignItems="center">
                <VStack flex={1} marginRight={5} justifyContent={'center'} height="100%">
                    <Flex alignItems={'center'} justifyContent={'left'} flexDirection={'row'}>
                        <View marginRight={3}>
                            <Info width="28" height="28" />
                        </View>
                        <Text fontWeight={700} marginRight={3}>
                            {device}
                        </Text>
                        <Text fontWeight={700}>{userAgent.split(',')[2]}</Text>
                    </Flex>
                    <Spacer h={3} />
                    <Divider />
                    <Spacer h={3} />
                    <Text>
                        {t('sessionManager.lastUsed')} {lastLogin}
                    </Text>
                </VStack>
                <Button onPress={logOut} flex={0} flexBasis={'100px'} height="100%" disabled={buttonDisabled}>
                    Log out
                </Button>
            </Flex>
        </Card>
    );
};

export default SessionCard;
