import Card from './Card';
import { Button, Divider, Flex, HStack, Image, Spacer, Text, useTheme, VStack } from 'native-base';
import Info from '../assets/icons/icon_info_dk_green.svg';
import { useTranslation } from 'react-i18next';

interface Props {
    device: 'Mobil' | 'Desktop';
    userAgent: string;
    lastLogin: string;
    logOut: () => void;
}

const SessionCard: React.FC<Props> = ({ device, userAgent, lastLogin, logOut }) => {
    const { sizes } = useTheme();
    const { t } = useTranslation();
    return (
        <Card width={350} margin={10} padding={15}>
            <Flex justifyContent={'space-between'} flexDirection={'row'}>
                <VStack>
                    <Flex alignItems={'center'} flexDirection={'row'} py={3}>
                        <Info width="24px" height="24px" />
                        <Spacer mx={3} />
                        <Text fontWeight={700}>{device}</Text>
                        <Spacer mx={3} />
                        <Text fontWeight={700}>{userAgent}</Text>
                    </Flex>
                    <Spacer m={3} />
                    <Divider />
                    <Spacer m={3} />
                    <Text>
                        {t('sessionManager.lastUsed')} {lastLogin}
                    </Text>
                </VStack>
                <Button onPress={logOut}>Log out</Button>
            </Flex>
        </Card>
    );
};

export default SessionCard;
