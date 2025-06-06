import { createContext, useContext, useEffect, useState } from 'react';
import ActivateNotificationsModal from '@/modals/ActivateNotificationsModal';
import { InstallationContext } from './InstallationProvider';
import { useWebPush } from '@/lib/WebPush';
import { useUserPreferences } from '@/hooks/useNotificationPreferences';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import useApollo from '@/hooks/useApollo';

export const RecommendationsContext = createContext<{
    recommend: (recommendation: RecommendationEnum) => void;
}>({
    recommend: () => {},
});

export enum RecommendationEnum {
    PUSH_NOTIFICATIONS_INITIAL = 'PUSH_NOTIFICATIONS_INITIAL',
    PUSH_NOTIFICATIONS_JOINED_COURSE = 'PUSH_NOTIFICATIONS_JOINED_COURSE',
    PUSH_NOTIFICATIONS_CREATED_APPOINTMENT = 'PUSH_NOTIFICATIONS_CREATED_APPOINTMENT',
}

export const RecommendationsProvider = ({ children }: { children: React.ReactNode }) => {
    const { sessionState } = useApollo();
    const { isInstalled } = useContext(InstallationContext);
    const { status } = useWebPush();
    const { hasPushSystemNotificationsEnabled, userPreferences } = useUserPreferences();
    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

    const [recommendations, setRecommendations] = useLocalStorage<RecommendationEnum[]>({
        key: 'recommendations',
        initialValue: [],
    });

    const recommend = (recommendation: RecommendationEnum) => {
        if (recommendations.includes(recommendation)) {
            return;
        }
        setRecommendations(recommendations.concat(recommendation));
        switch (recommendation) {
            case RecommendationEnum.PUSH_NOTIFICATIONS_INITIAL:
            case RecommendationEnum.PUSH_NOTIFICATIONS_CREATED_APPOINTMENT:
            case RecommendationEnum.PUSH_NOTIFICATIONS_JOINED_COURSE:
                setIsNotificationsModalOpen(true);
                break;

            default:
                break;
        }
    };

    // If user already took a decision (approved/denied) we don't ask again
    const hasProvidedPushPermissions = !['ask-user', 'not-subscribed', 'loading'].includes(status);
    const canEnablePushNotifications = isInstalled && (!hasPushSystemNotificationsEnabled || !hasProvidedPushPermissions);
    useEffect(() => {
        if (sessionState === 'logged-in' && canEnablePushNotifications && !!Object.keys(userPreferences).length) {
            recommend(RecommendationEnum.PUSH_NOTIFICATIONS_INITIAL);
        }
    }, [sessionState, canEnablePushNotifications, userPreferences]);

    return (
        <RecommendationsContext.Provider value={{ recommend }}>
            {children}
            {canEnablePushNotifications && <ActivateNotificationsModal isOpen={isNotificationsModalOpen} onOpenChange={setIsNotificationsModalOpen} />}
        </RecommendationsContext.Provider>
    );
};
