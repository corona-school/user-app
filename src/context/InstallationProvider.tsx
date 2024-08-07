import { createContext, useEffect, useState, useRef } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { BeforeInstallPromptEvent } from '../types/window';
import { IOSInstallAppInstructions } from '../widgets/InstallAppBanner';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PROMOTE_APP_BANNER_ACTIVE } from '../config';

export enum PromotionType {
    native = 'native',
    iPhone = 'iPhone',
    iPad = 'iPad',
    none = 'none',
}

interface InstallationContextValue {
    canInstall: boolean;
    shouldPromote: boolean;
    promotionType: PromotionType;
    install: () => Promise<void>;
    stopPromoting: () => void;
}

export const InstallationContext = createContext<InstallationContextValue>({
    canInstall: false,
    shouldPromote: false,
    promotionType: PromotionType.none,
    install: async () => {},
    stopPromoting: () => {},
});

interface InstallationProviderProps {
    children: React.ReactNode;
}

const InstallationProvider = ({ children }: InstallationProviderProps) => {
    const { trackEvent } = useMatomo();
    const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
    const [isInstructionsBannerVisible, setIsInstructionsBannerVisible] = useState(false);
    const [promotionType, setPromotionType] = useState<PromotionType>(PromotionType.none);
    const [showPromotionBanner, setShowPromotionBanner] = useLocalStorage<boolean | null>({ key: 'recommend-lern-fair-installation', initialValue: null });
    const canInstall = promotionType !== PromotionType.none;
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

    const isInStandaloneMode = () => 'standalone' in window.navigator && (window.navigator as any)?.standalone;

    const install = async () => {
        if (promotionType === PromotionType.native && deferredPromptRef.current) {
            deferredPromptRef.current.prompt();
            const choiceResult = await deferredPromptRef.current.userChoice;
            trackEvent({
                category: 'pwa',
                action: 'click-event',
                name: choiceResult.outcome === 'accepted' ? 'App-Installation abgeschlossen' : 'App-Installation abgebrochen',
            });
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
        trackEvent({
            category: 'pwa',
            action: 'click-event',
            name: 'App-Installations-Banner schließen',
        });
        setShowPromotionBanner(false);
    };

    useEffect(() => {
        if (canInstall && showPromotionBanner === null) {
            setShowPromotionBanner(true);
        }
    }, [canInstall, showPromotionBanner]);

    useEffect(() => {
        if (!PROMOTE_APP_BANNER_ACTIVE) {
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
    }, []);

    return (
        <InstallationContext.Provider value={{ install, promotionType, canInstall, shouldPromote, stopPromoting }}>
            {isInstructionsBannerVisible && promotionType === PromotionType.iPad && (
                <IOSInstallAppInstructions onClose={handleOnCloseInstallInstructions} variant={'iPad'} />
            )}
            {children}
            {isInstructionsBannerVisible && promotionType === PromotionType.iPhone && (
                <IOSInstallAppInstructions onClose={handleOnCloseInstallInstructions} variant={'iPhone'} />
            )}
        </InstallationContext.Provider>
    );
};

export default InstallationProvider;
