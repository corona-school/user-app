import { useEffect, useState } from 'react';
import NotificationAlert from '@/components/notifications/NotificationAlert';
import { Typography } from '@/components/Typography';
import WithNavigation from '@/components/WithNavigation';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

// Icons
import { IconCircleNumber1Filled, IconCircleNumber2Filled, IconCircleNumber3Filled } from '@tabler/icons-react';

// Importing Assests
import Confetti from '../assets/images/referral/Confetti.svg';
import ConfettiMobile from '../assets/images/referral/ConfettiMobile.svg';
import BGDesktop from '../assets/images/referral/BGDesktop.svg';
import BGMobile from '../assets/images/referral/BGMobile.svg';
import Character from '../assets/images/referral/Character.svg';
import LOCK from '../assets/images/referral/Lock.svg';

import { gql } from '@/gql';
import { useQuery } from '@apollo/client';
import SocialOptions from '@/components/referral/socialOptions';
import Rewards from '@/components/referral/rewards';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useUserType } from '@/hooks/useApollo';
import { Button } from '@/components/Button';
import { SHARING_MATERIALS_URL } from '@/config';

const ReferralCountQuery = gql(`
    query ReferralCount {
        me {
            referralCount
        }  
    }
`);

const SupportedHoursQuery = gql(`
    query SupportedHours {
        me {
            supportedHours
        }
    }
`);

const Referrals: React.FC<{}> = () => {
    const { t } = useTranslation();
    const [hasCopied, setHasCopied] = useState(false);
    const { trackPageView, trackEvent } = useMatomo();
    const userType = useUserType();

    const onCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy: ', error);
        }
    };

    useEffect(() => {
        trackPageView({
            documentTitle: 'Referrals',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const userID = sessionStorage.getItem('userID');
    const uniqueReferralLink = 'https://app.lern-fair.de/registration?referredById=' + userID;

    // Share Variables
    const referralMessage = t('referral.referralMessage');
    const [linkedinButtonText, setLinkedinButtonText] = useState(t('referral.share.option3.option'));

    // Fetch referral count and supported hours
    const { data: referralData, error: referralError } = useQuery(ReferralCountQuery);
    const { data: hoursData, error: hoursError } = useQuery(SupportedHoursQuery);

    // Handle errors
    useEffect(() => {
        if (referralError) {
            toast.error(referralError.message);
        }
        if (hoursError) {
            toast.error(hoursError.message);
        }
    }, [referralError, hoursError]);

    // Access the results
    const referralCount = referralData?.me?.referralCount ?? 0;
    const supportedHours = hoursData?.me?.supportedHours ?? 0;

    // Linkedin Share
    const shareToLinkedIn = () => {
        trackEvent({
            category: `${userType === 'pupil' ? 'SuS' : 'HuH'} Referral`,
            action: 'Share on Desktop',
            name: 'Click Share on LinkedIn on Desktop',
        });
        const linkedinURL = `https://www.linkedin.com/sharing/share-offsite/?text=${encodeURIComponent(referralMessage)}&url=${encodeURIComponent(
            uniqueReferralLink
        )}`;

        setLinkedinButtonText(t('referral.copiedReferralLink'));
        onCopy(referralMessage + '\n' + uniqueReferralLink);

        setTimeout(() => {
            window.open(linkedinURL, '_blank');
            setLinkedinButtonText(t('referral.share.option3.option'));
        }, 2000);
    };

    // Mobile Share
    const handleShare = () => {
        trackEvent({
            category: `${userType === 'pupil' ? 'SuS' : 'HuH'} Referral`,
            action: 'Share on Mobile',
            name: 'Click Share on Mobile',
        });
        navigator.share({
            url: uniqueReferralLink,
        });
    };

    const handleOnCopy = (text: string, version: 'Mobile' | 'Desktop') => {
        trackEvent({
            category: `${userType === 'pupil' ? 'SuS' : 'HuH'} Referral`,
            action: `Share on ${version}`,
            name: `Click copy URL on ${version}`,
        });
        onCopy(text);
    };

    return (
        <WithNavigation
            headerLeft={
                <div className="flex items-center space-x-4">
                    <SwitchLanguageButton />
                    <NotificationAlert />
                </div>
            }
        >
            <Breadcrumb className="md:mx-2" />
            {/* Desktop View */}
            <div className="hidden lg:block mt-8">
                <div className={`flex items-center px-2 my-3 max-w-full space-x-12`}>
                    <div className="flex flex-col w-[48%] z-1">
                        <div>
                            <Typography variant="h3" className="mb-2">
                                {t('referral.title')}
                            </Typography>
                            <Typography className="mb-3">{t('referral.description')}</Typography>
                            <Typography variant="h4" className="mb-1.5 font-bold">
                                {t('referral.share.title')}
                            </Typography>
                            <Typography className="mb-3">{t('referral.share.description')}</Typography>

                            {/* Options */}
                            <div className="flex space-x-2 m-3 mb-8 mt-8 items-center">
                                <IconCircleNumber1Filled className="w-6 h-6 flex-shrink-0" />
                                <Typography variant="h5">
                                    {t('referral.share.option1.option')}
                                    <Typography className="inline">{t('referral.share.option1.description')}</Typography>
                                </Typography>
                            </div>

                            <div className="flex space-x-2 m-3 mb-8 items-center">
                                <IconCircleNumber2Filled className="w-6 h-6 flex-shrink-0" />
                                <Typography variant="h5">
                                    {t('referral.share.option2.option')}
                                    <Typography className="inline">{t('referral.share.option2.description')}</Typography>
                                </Typography>
                            </div>

                            <div className="flex space-x-2 m-3 mb-4 items-center">
                                <IconCircleNumber3Filled className="w-6 h-6 flex-shrink-0" />
                                <Typography variant="h5">
                                    {t('referral.share.option3.option')}
                                    <Typography className="inline">{t('referral.share.option3.description')}</Typography>
                                </Typography>
                            </div>
                            {/* Share Buttons */}
                            <SocialOptions
                                uniqueReferralLink={uniqueReferralLink}
                                referralMessage={referralMessage}
                                onCopy={(text) => handleOnCopy(text, 'Desktop')}
                                hasCopied={hasCopied}
                                linkedinButtonText={linkedinButtonText}
                                t={t}
                                shareToLinkedIn={shareToLinkedIn}
                                handleShare={handleShare}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col w-[52%] relative">
                        <BGDesktop style={{ position: 'absolute', top: '-140px', left: 'calc(-380px + (100% - 686px) / 2)', zIndex: -1 }}></BGDesktop>

                        <div className="w-[480px] mx-auto bg-white rounded-md shadow-lg p-10 pb-0 relative">
                            <Confetti style={{ position: 'absolute', top: '-5px', right: '-5px', transform: 'scale(.8)' }}></Confetti>

                            <Rewards referralCount={referralCount} supportedHours={supportedHours} t={t} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col px-2 max-w-[40%]">
                    <Typography variant="h4" className="mt-14 mb-1.5 font-bold">
                        {t('referral.share.materials.title')}
                    </Typography>
                    <Typography>{t('referral.share.materials.description')}</Typography>
                    <Button className="mt-4" variant="outline" onClick={() => window.open(SHARING_MATERIALS_URL, '_blank')}>
                        {t('referral.share.materials.button')}
                    </Button>
                </div>
            </div>

            {/* Mobile View */}
            <div className="block lg:hidden">
                <div className="min-w-[300px] max-w-[768px] space-y-4 mx-auto">
                    <div className="h-[220px]">
                        <BGMobile style={{ position: 'absolute', right: 0 }}></BGMobile>
                        <Character style={{ position: 'absolute', top: '135px', right: 16 }}></Character>
                        <div>
                            <Typography variant="h5" className="font-bold mt-4 mb-3">
                                {t('referral.title')}
                            </Typography>
                            <Typography className="mb-3 w-2/5">{t('referral.description')}</Typography>
                        </div>
                    </div>
                    <div className="h-[140px] bg-white rounded-md shadow-lg p-5">
                        <ConfettiMobile style={{ position: 'absolute', top: '320px', right: '10px', transform: 'scale(.6)' }}></ConfettiMobile>

                        <Typography variant="h5" className="font-bold mb-3">
                            {t('referral.reward.title')}
                        </Typography>
                        <div className="flex space-x-5">
                            <Typography variant="h6" className="font-bold mb-3">
                                {t('referral.reward.RegisteredUsers')}
                            </Typography>
                            <Typography variant="h5" className="font-bold mb-3 text-primary-400">
                                {referralCount}
                            </Typography>
                        </div>
                        <div className="flex space-x-5">
                            <Typography variant="h6" className="font-bold">
                                {t('referral.reward.HoursSupported')}
                            </Typography>
                            <Typography variant="h5" className="font-bold text-primary-400">
                                {referralCount >= 3 ? (
                                    supportedHours
                                ) : (
                                    <div className="group relative">
                                        <LOCK className="w-[20px] h-[20px]" />
                                        <div className="absolute left-full top-[-10px] hidden group-hover:block w-[180px] p-3 flex flex-col items-start gap-1 bg-[#ECF3F2] text-primary-700 font-outfit text-xs font-normal leading-[10px] rounded-[6px] ml-2">
                                            <div className="text-primary-700 font-outfit text-xs font-normal leading-[10px]">
                                                {t('referral.reward.tooltip')}
                                            </div>
                                            <div className="absolute left-[-10px] top-[50%] transform -translate-y-[60%] w-0 h-0 border-t-[5px] border-r-[10px] border-b-[5px] border-transparent border-r-[#ECF3F2]"></div>
                                        </div>
                                    </div>
                                )}
                            </Typography>
                        </div>
                    </div>
                    <div className="h-[170px] bg-white rounded-md shadow-lg p-5">
                        {/* Share Buttons */}
                        <SocialOptions
                            uniqueReferralLink={uniqueReferralLink}
                            referralMessage={referralMessage}
                            onCopy={(text) => handleOnCopy(text, 'Mobile')}
                            hasCopied={hasCopied}
                            linkedinButtonText={linkedinButtonText}
                            t={t}
                            shareToLinkedIn={shareToLinkedIn}
                            handleShare={handleShare}
                        />
                    </div>
                    <div className="bg-white rounded-md shadow-lg p-5">
                        <div className="flex flex-col">
                            <Typography variant="h6" className="mb-1.5 font-bold">
                                {t('referral.share.materials.title')}
                            </Typography>
                            <Typography>{t('referral.share.materials.description')}</Typography>
                            <Button className="mt-4 w-full" variant="outline" onClick={() => window.open(SHARING_MATERIALS_URL, '_blank')}>
                                {t('referral.share.materials.button')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </WithNavigation>
    );
};

export default Referrals;
