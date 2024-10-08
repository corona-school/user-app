import { useMutation, useQuery } from '@apollo/client';
import { Column, Flex, Heading, Row, Stack, Text, useBreakpointValue, useTheme, useToast, View, VStack } from 'native-base';
import { gql } from '../gql';
import { useTranslation } from 'react-i18next';
import HelpNavigation from '../components/HelpNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import SessionCard from '../components/SessionCard';
import { Secret_Type_Enum } from '../gql/graphql';
import { getDeviceId } from '@/hooks/useApollo';
import { useEffect } from 'react';

const SessionManager: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();

    const sessionQuery = useQuery(
        gql(`
        query session {
            me { secrets { id type description lastUsed deviceId } }
        }
        `)
    );

    const [revokeQuery, { data, loading }] = useMutation(
        gql(`
        mutation revoke($id: Float!) {
            tokenRevoke(id: $id, invalidateSessions: true)
        }
        `)
    );

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const width = useBreakpointValue({
        base: '90%',
        lg: '100%',
    });

    const revokeSecret = async (id: number) => {
        await revokeQuery({ variables: { id: id } });
    };

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
                {sessionQuery.data?.me.secrets
                    .filter((x) => x.type === Secret_Type_Enum.Token)
                    .map((secret: any) => (
                        <SessionCard
                            userAgent={secret.type + ', ' + secret.id + ', ' + secret.description}
                            lastLogin={secret.lastUsed}
                            logOut={() => revokeSecret(secret.id)}
                            fetching={loading}
                            isCurrentSession={secret.deviceId && getDeviceId() === secret.deviceId}
                            key={secret.id}
                        />
                    ))}
            </Flex>
        </WithNavigation>
    );
};

export default SessionManager;
