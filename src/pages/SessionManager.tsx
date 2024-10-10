import { useMutation, useQuery } from '@apollo/client';
import { Spacer, Stack, useToast } from 'native-base';
import { gql } from '@/gql';
import { useTranslation } from 'react-i18next';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import SessionCard from '../components/SessionCard';
import { Secret_Type_Enum } from '@/gql/graphql';
import { getDeviceId } from '@/hooks/useApollo';
import { Typography } from '@/components/Typography';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import React from 'react';

const SessionManager: React.FC = () => {
    const { t } = useTranslation();
    const toast = useToast();

    const sessionQuery = useQuery(
        gql(`
        query session {
            me { secrets { id type description lastUsed lastUsedDeviceId } }
        }
        `)
    );

    const [revokeQuery, { loading }] = useMutation(
        gql(`
        mutation revoke($id: Float!) {
            tokenRevoke(id: $id, invalidateSessions: true)
        }
        `)
    );
    const revokeSecret = async (id: number) => {
        await revokeQuery({ variables: { id: id } });
        toast.show({ description: t('sessionManager.toast'), placement: 'top' });
        await sessionQuery.refetch();
    };

    return (
        <WithNavigation
            showBack
            previousFallbackRoute="/settings"
            headerTitle={t('sessionManager.title')}
            headerLeft={
                <Stack alignItems="center" direction="row">
                    <SwitchLanguageButton />
                    <NotificationAlert />
                </Stack>
            }
        >
            <Typography variant="h2" className="mb-4">
                {t('sessionManager.title')}
            </Typography>
            <Typography>{t('sessionManager.description')}</Typography>
            <Spacer h={5} />
            <div className="p-10 flex flex-col gap-10 w-full">
                {sessionQuery.data?.me.secrets
                    .filter((x) => x.type === Secret_Type_Enum.Token)
                    .map((secret) => {
                        const description = secret.description;
                        let device = {
                            type: undefined,
                            description,
                            lastUsedDeviceId: secret.lastUsedDeviceId,
                            lastUsed: secret.lastUsed,
                            secretId: secret.id,
                        };
                        // try to parse the description as JSON
                        try {
                            const parsed = JSON.parse(description!);
                            device.type = parsed.type;
                            device.description =
                                (parsed.device?.model ?? parsed.browser?.name ?? t('sessionManager.unknownDevice')) +
                                (parsed.os?.name ? ` ${t('sessionManager.deviceOnOs')} ` + parsed.os?.name : '');
                        } catch (e) {
                            // ignore
                        }
                        return device;
                    })
                    .map((device: any) => (
                        <SessionCard
                            userAgent={device.description}
                            deviceType={device.type}
                            lastLogin={device.lastUsed}
                            logOut={() => revokeSecret(device.secretId)}
                            fetching={loading}
                            isCurrentSession={device.lastUsedDeviceId && getDeviceId() === device.lastUsedDeviceId}
                            key={device.secretId}
                        />
                    ))}
            </div>
        </WithNavigation>
    );
};

export default SessionManager;
