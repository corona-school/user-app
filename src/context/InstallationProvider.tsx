import { createContext, useEffect, useState, useRef, useMemo } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { BeforeInstallPromptEvent } from '../types/window';
import { InstallInstructionsModal } from '../widgets/InstallAppBanner';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PROMOTE_APP_BANNER_ACTIVE } from '../config';

export enum PromotionType {
    native = 'native',
    iPhone = 'iPhone',
    iPad = 'iPad',
    unknown = 'unknown',
    none = 'none',
}

interface InstallationContextValue {
    canInstall: boolean;
    shouldPromote: boolean;
    promotionType: PromotionType;
    install: () => Promise<void>;
    stopPromoting: () => void;
    isInstalled: boolean;
}

export const InstallationContext = createContext<InstallationContextValue>({
    canInstall: false,
    shouldPromote: false,
    promotionType: PromotionType.unknown,
    install: async () => {},
    stopPromoting: () => {},
    isInstalled: true,
});

interface InstallationProviderProps {
    children: React.ReactNode;
}

const InstallationProvider = ({ children }: InstallationProviderProps) => {
    const { trackEvent } = useMatomo();
    const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
    const [isInstructionsBannerVisible, setIsInstructionsBannerVisible] = useState(false);
    const [promotionType, setPromotionType] = useState<PromotionType>(PromotionType.unknown);
    const [showPromotionBanner, setShowPromotionBanner] = useLocalStorage<boolean | null>({ key: 'recommend-lern-fair-installation', initialValue: null });
    const canInstall = ![PromotionType.none, PromotionType.unknown].includes(promotionType);
    const shouldPromote = canInstall && !!showPromotionBanner;

    const isIphone = () => {
        const userAgent = window?.navigator?.userAgent?.toLowerCase();
        return /iphone|ipod/.test(userAgent);
    };

    const isIpad = () => {
        const userAgent = window?.navigator?.userAgent?.toLowerCase();
        const isMac = RegExp(/Macintosh/i).test(userAgent);
        const iPad = /ipad/.test(userAgent);
        return iPad || (isMac && navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    };

    const isInStandaloneMode = () =>
        ('standalone' in window.navigator && (window.navigator as any)?.standalone) || window.matchMedia('(display-mode: standalone)').matches;
    const install = async () => {
        if (promotionType === PromotionType.native && deferredPromptRef.current) {
            deferredPromptRef.current.prompt();
            const choiceResult = await deferredPromptRef.current.userChoice;
            if (choiceResult.outcome === 'accepted') {
                // Valid only for Android/Desktop (devices that allow native installations)
                trackEvent({
                    category: 'pwa',
                    action: 'app-installation',
                    name: 'Via Dialog',
                });
                setLoggedInstallation(true);
            }
            deferredPromptRef.current = null;
            setPromotionType(PromotionType.none);
        } else if ([PromotionType.iPad, PromotionType.iPhone].includes(promotionType)) {
            setIsInstructionsBannerVisible(true);
        }
    };

    const handleOnCloseInstallInstructions = () => {
        setIsInstructionsBannerVisible(false);
    };

    const stopPromoting = () => {
        setShowPromotionBanner(false);
    };

    const isInstalled = useMemo(() => {
        const UA = navigator.userAgent;
        return !!(isInStandaloneMode() || ((isIphone() || isIpad()) && !UA.match(/Safari/)));
    }, []);

    useEffect(() => {
        if (canInstall && showPromotionBanner === null) {
            setShowPromotionBanner(true);
        }
    }, [canInstall, showPromotionBanner]);

    useEffect(() => {
        if (!PROMOTE_APP_BANNER_ACTIVE || isInstalled) {
            setPromotionType(PromotionType.none);
            return;
        }

        if (isIphone() && !isInStandaloneMode()) {
            setPromotionType(PromotionType.iPhone);
            return;
        }
        if (isIpad() && !isInStandaloneMode()) {
            setPromotionType(PromotionType.iPad);
            return;
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            deferredPromptRef.current = e as BeforeInstallPromptEvent;
            setPromotionType(PromotionType.native);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [promotionType, isInstalled]);

    const [loggedInstallation, setLoggedInstallation] = useLocalStorage<boolean | null>({ key: 'logged-lern-fair-app-installation', initialValue: null });

    useEffect(() => {
        if (promotionType === PromotionType.unknown) return;
        // App is not installed
        if (!isInstalled) {
            trackEvent({
                category: 'opening',
                action: 'app-opened',
                name: 'browser',
            });
            return;
        }
        const isAndroid = navigator.userAgent.match(/Android/i);
        // App is installed and we haven't tracked the installation (Exclude android devices)
        if (!loggedInstallation && !isAndroid) {
            // iOS (Opening the app via shortcut for the first time / Devices that don't allow native installation)
            trackEvent({
                category: 'pwa',
                action: 'app-installation',
                name: 'Opening via shortcut for the first time',
            });
            setLoggedInstallation(true);
            return;
        }
        // This is not the first time a user access the app
        if (loggedInstallation) {
            let device = 'desktop';
            if (isIpad() || isIphone()) {
                device = 'ios';
            } else if (isAndroid) {
                device = 'android';
            }
            trackEvent({
                category: 'opening',
                action: 'pwa-opened-via-shortcut',
                name: device,
            });
        }
    }, [isInstalled, loggedInstallation, promotionType, setLoggedInstallation]);
    return (
        <InstallationContext.Provider value={{ install, promotionType, canInstall, shouldPromote, stopPromoting, isInstalled }}>
            <InstallInstructionsModal isOpen={isInstructionsBannerVisible} onOpenChange={handleOnCloseInstallInstructions} />
            {children}
        </InstallationContext.Provider>
    );
};

export default InstallationProvider;
