import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useEffect, useRef, useState } from 'react';
import { BeforeInstallPromptEvent } from '../types/window';

export enum PromotionType {
    native = 'native',
    iPhone = 'iPhone',
    iPad = 'iPad',
    none = 'none',
}

const useInstallation = () => {
    const { trackEvent } = useMatomo();
    const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
    const [promotionType, setPromotionType] = useState<PromotionType>(PromotionType.none);

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

    useEffect(() => {
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

    const install = async () => {
        if (deferredPromptRef.current) {
            deferredPromptRef.current.prompt();
            const choiceResult = await deferredPromptRef.current.userChoice;
            trackEvent({
                category: 'pwa',
                action: 'click-event',
                name: choiceResult.outcome === 'accepted' ? 'App-Installation abgeschlossen' : 'App-Installation abgebrochen',
            });
            deferredPromptRef.current = null;
            setPromotionType(PromotionType.none);
        }
    };

    return { shouldPromote: promotionType !== PromotionType.none, promotionType, install };
};

export default useInstallation;
