import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import { gql } from '@/gql';
import { useTranslation } from 'react-i18next';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import SessionCard from '../components/SessionCard';
import { Secret_Type_Enum } from '@/gql/graphql';
import { getDeviceId } from '@/hooks/useApollo';
import { Typography } from '@/components/Typography';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import React from 'react';
import { toast } from 'sonner';
import { Breadcrumb } from '@/components/Breadcrumb';

const SessionManager: React.FC = () => {
    const { t } = useTranslation();

    const {
        data: sessions,
        loading: fetchingSecrets,
        refetch: refetchSessions,
        networkStatus,
    } = useQuery(
        gql(`
        query session {
            me { secrets { id type description lastUsed lastUsedDeviceId } }
        }
        `),
        { notifyOnNetworkStatusChange: true }
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
        toast.success(t('sessionManager.toast'));
        await refetchSessions();
    };

    return (
        <WithNavigation
            previousFallbackRoute="/settings"
            headerTitle={t('sessionManager.title')}
            headerLeft={
                <div className="flex items-center flex-row">
                    <SwitchLanguageButton />
                    <NotificationAlert />
                </div>
            }
        >
            <Breadcrumb />
            <Typography variant="h2" className="mb-4">
                {t('sessionManager.title')}
            </Typography>
            <Typography>{t('sessionManager.description')}</Typography>
            <div className="p-10 flex flex-col gap-10 w-full">
                {fetchingSecrets || networkStatus === NetworkStatus.refetch ? (
                    <CenterLoadingSpinner />
                ) : (
                    sessions?.me.secrets
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
                        ))
                )}
            </div>
        </WithNavigation>
    );
};

export default SessionManager;
