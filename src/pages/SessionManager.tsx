import { useQuery } from '@apollo/client';
import { Column, Flex, Heading, Row, Stack, Text, useBreakpointValue, useTheme, useToast, View, VStack } from 'native-base';
import { gql } from '../gql';
import { useTranslation } from 'react-i18next';
import HelpNavigation from '../components/HelpNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import SessionCard from '../components/SessionCard';
import Info from '../../../assets/icons/icon_info_dk_green.svg';

const SessionManager: React.FC = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();

    const sessionQuery = useQuery(
        gql(`
        query session {
            me { secrets { id type description } }
        }
        `)
    );

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const width = useBreakpointValue({
        base: '90%',
        lg: '90%',
    });

    return (
        <WithNavigation
            showBack
            previousFallbackRoute="/settings"
            headerTitle={t('sessionManager.title')}
            headerLeft={
                <Stack alignItems="center" direction="row">
                    <HelpNavigation />
                    <NotificationAlert />
                </Stack>
            }
        >
            <View py={5} width={width}>
                {!isMobile && (
                    <Column space={space['1']} marginBottom={space['2']} ml={3}>
                        <Heading>{t('sessionManager.title')}</Heading>
                    </Column>
                )}
                <Column space={space['1']} marginBottom={space['2']} ml={3}>
                    <Row>
                        <Text>{t('sessionManager.description')}</Text>
                    </Row>
                </Column>
            </View>
            <Flex>
                {sessionQuery.data?.me.secrets.map((secret: any) => (
                    <SessionCard device={'Mobil'} userAgent={'userAgent'} lastLogin={'lastLogin'} logOut={() => console.log('dummy')} />
                ))}
            </Flex>
        </WithNavigation>
    );
};

export default SessionManager;
