import { useTranslation } from 'react-i18next';
import { toTimerString } from '@/Utility';
import { DateTime } from 'luxon';
import { IconDeviceMobile, IconDeviceIpadHorizontal, IconDeviceLaptop, IconInfoCircle } from '@tabler/icons-react';
import { Typography } from '@/components/Typography';
import { Button } from './Button';

interface Props {
    deviceType: 'mobile' | 'tablet' | 'desktop';
    userAgent: string;
    lastLogin: string;
    logOut: () => void;
    fetching: boolean;
    isCurrentSession: boolean;
}

const SessionCard: React.FC<Props> = ({ userAgent, deviceType, lastLogin, logOut, isCurrentSession }) => {
    const { t } = useTranslation();
    let icon = <IconInfoCircle />;
    if (deviceType === 'mobile') {
        icon = <IconDeviceMobile size={32} />;
    }
    if (deviceType === 'tablet') {
        icon = <IconDeviceIpadHorizontal size={32} />;
    }
    if (deviceType === 'desktop') {
        icon = <IconDeviceLaptop size={32} />;
    }

    // rewrite the component at the very top (native-base) in tailwind:
    return (
        <div className="flex justify-between items-center rounded-lg px-4 py-3 bg-primary-lighter text-foreground gap-5 flex-grow flex-shrink-0 max-w-xl min-h-20">
            <div className="pt-1">{icon}</div>
            <div className="flex flex-col items-start ">
                <Typography className="font-bold">{userAgent}</Typography>
                {lastLogin && (
                    <Typography className="text-form font-normal [&_p]:leading-relaxed">
                        {t('sessionManager.lastUsed')} {toTimerString(DateTime.now(), DateTime.fromJSDate(new Date(lastLogin)))}
                    </Typography>
                )}
            </div>
            {!isCurrentSession ? (
                <Button variant="secondary" onClick={logOut}>
                    {t('logout')}
                </Button>
            ) : (
                <Typography className="font-medium">{t('sessionManager.thisDevice')}</Typography>
            )}
        </div>
    );
};

export default SessionCard;
