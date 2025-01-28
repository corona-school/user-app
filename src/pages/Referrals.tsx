import { useState } from 'react';
import NotificationAlert from '@/components/notifications/NotificationAlert';
import { Typography } from '@/components/Typography';
import WithNavigation from '@/components/WithNavigation';
import { HStack, Stack, VStack, Box, useTheme, useBreakpointValue, useClipboard, Tooltip } from 'native-base';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { useTranslation } from 'react-i18next';
import { isMobile } from 'react-device-detect';
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
    const { colors, space, sizes } = useTheme();
    const { onCopy, hasCopied } = useClipboard();

    const userID = sessionStorage.getItem('userID');
    const uniqueReferralLink = 'https://app.lern-fair.de/registration?referredById=' + userID;

    // Share Variables
    const referralMessage = t('referral.referralMessage');
    const [linkedinButtonText, setLinkedinButtonText] = useState(t('referral.share.option3.option'));

    // Fetch referral count and supported hours
    const { data: referralData, error: referralError } = useQuery(ReferralCountQuery);
    const { data: hoursData, error: hoursError } = useQuery(SupportedHoursQuery);

    // Handle errors
    if (referralError || hoursError) {
        toast.error((referralError ?? hoursError)?.message);
    }

    // Access the results
    const referralCount = referralData?.me?.referralCount ?? 0;
    const supportedHours = hoursData?.me?.supportedHours ?? 0;

    // Linkedin Share
    const shareToLinkedIn = () => {
        const imageURL = 'https://user-app-files.fra1.digitaloceanspaces.com/static/images/share_image.jpg';
        const linkedinURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(imageURL)}`;

        setLinkedinButtonText(t('referral.copiedReferralLink'));
        onCopy(referralMessage + '\n' + uniqueReferralLink);

        setTimeout(() => {
            window.open(linkedinURL, '_blank');
            setLinkedinButtonText(t('referral.share.option3.option'));
        }, 2000);
    };

    // Mobile Share
    const handleShare = () => {
        navigator.share({
            url: uniqueReferralLink,
        });
    };

    // Breakpoint
    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    return (
        <WithNavigation
            headerLeft={
                <Stack alignItems="center" direction="row">
                    <SwitchLanguageButton />
                    <NotificationAlert />
                </Stack>
            }
        >
            {/* Desktop View */}
            <Box display={{ base: 'none', xl: 'block' }}>
                <HStack padding={space['2']} marginY={space['3']} space={12} maxWidth={ContainerWidth} alignItems="center">
                    <VStack w="48%" zIndex="1">
                        <Box>
                            <Typography variant="h3" className="mb-1.5 font-bold">
                                {t('referral.title')}
                            </Typography>
                            <Typography variant="h6" className="mb-3">
                                {t('referral.description')}
                            </Typography>
                            <Typography variant="h4" className="mb-1.5 font-bold">
                                {t('referral.share.title')}
                            </Typography>
                            <Typography variant="h6" className="mb-3">
                                {t('referral.share.description')}
                            </Typography>

                            {/* Options */}
                            <HStack space={2} margin={space['1']}>
                                <IconCircleNumber1Filled />
                                <Typography variant="h5">
                                    {t('referral.share.option1.option')}
                                    <Typography variant="h6" className="inline">
                                        {t('referral.share.option1.description')}
                                    </Typography>
                                </Typography>
                            </HStack>

                            <HStack space={2} margin={space['1']}>
                                <IconCircleNumber2Filled />
                                <Typography variant="h5">
                                    {t('referral.share.option2.option')}
                                    <Typography variant="h6" className="inline">
                                        {t('referral.share.option2.description')}
                                    </Typography>
                                </Typography>
                            </HStack>

                            <HStack space={2} margin={space['1']}>
                                <IconCircleNumber3Filled />
                                <Typography variant="h5">
                                    {t('referral.share.option3.option')}
                                    <Typography variant="h6" className="inline">
                                        {t('referral.share.option3.description')}
                                    </Typography>
                                </Typography>
                            </HStack>
                            {isMobile ? 'mobile' : 'pc'}
                            {/* Share Buttons */}
                            <SocialOptions
                                uniqueReferralLink={uniqueReferralLink}
                                referralMessage={referralMessage}
                                onCopy={onCopy}
                                hasCopied={hasCopied}
                                linkedinButtonText={linkedinButtonText}
                                t={t}
                                shareToLinkedIn={shareToLinkedIn}
                                handleShare={handleShare}
                                isMobile={isMobile}
                            />
                        </Box>
                    </VStack>
                    <VStack w="52%">
                        <BGDesktop style={{ position: 'absolute', top: '-150px', left: 'calc(-380px + (100% - 686px) / 2)', zIndex: -1 }}></BGDesktop>

                        <Box w="480px" marginX={'auto'} backgroundColor="white" borderRadius="md" shadow={4} padding="10" paddingBottom="0" position="relative">
                            <Confetti style={{ position: 'absolute', top: '-5px', right: '-5px', transform: 'scale(.8)' }}></Confetti>

                            <Rewards referralCount={referralCount} supportedHours={supportedHours} colors={colors} t={t} />
                        </Box>
                    </VStack>
                </HStack>
            </Box>

            {/* Mobile View */}
            <Box display={{ base: 'block', xl: 'none' }}>
                <VStack minW="300px" maxW="768px" space={4} marginX="auto">
                    <Box h="220px">
                        <BGMobile style={{ position: 'absolute', right: 0 }}></BGMobile>
                        <Character style={{ position: 'absolute', top: '50px', right: 0 }}></Character>
                        <Box>
                            <Typography variant="h5" className="font-bold mt-4 mb-3">
                                {t('referral.title')}
                            </Typography>
                            <Typography variant="h6" className="mb-3 w-2/5">
                                {t('referral.description')}
                            </Typography>
                        </Box>
                    </Box>
                    <Box h="140px" backgroundColor="white" borderRadius="md" shadow={4} padding="5">
                        <ConfettiMobile style={{ position: 'absolute', top: '-5px', right: '-5px', transform: 'scale(.6)' }}></ConfettiMobile>

                        <Typography variant="h5" className="font-bold mb-3">
                            {t('referral.reward.title')}
                        </Typography>
                        <HStack space={5}>
                            <Typography variant="h6" className="font-bold mb-3">
                                {t('referral.reward.RegisteredUsers')}
                            </Typography>
                            <Typography variant="h5" className="font-bold mb-3" style={{ color: colors.primary[400] }}>
                                {referralCount}
                            </Typography>
                        </HStack>
                        <HStack space={5}>
                            <Typography variant="h6" className="font-bold">
                                {t('referral.reward.HoursSupported')}
                            </Typography>
                            <Typography variant="h5" className="font-bold" style={{ color: colors.primary[400] }}>
                                {referralCount >= 3 ? (
                                    supportedHours
                                ) : (
                                    <Tooltip
                                        maxW={250}
                                        label={t('referral.reward.tooltip')}
                                        bg={'primary.100'}
                                        placement="right"
                                        _text={{ lineHeight: '1rem', color: colors.primary[700] }}
                                        p={3}
                                        hasArrow
                                        children={
                                            <Box>
                                                <LOCK className="w-[20px] h-[20px]" />
                                            </Box>
                                        }
                                    ></Tooltip>
                                )}
                            </Typography>
                        </HStack>
                    </Box>
                    <Box h="170px" backgroundColor="white" borderRadius="md" shadow={4} padding="5">
                        {/* Share Buttons */}
                        <SocialOptions
                            uniqueReferralLink={uniqueReferralLink}
                            referralMessage={referralMessage}
                            onCopy={onCopy}
                            hasCopied={hasCopied}
                            linkedinButtonText={linkedinButtonText}
                            t={t}
                            shareToLinkedIn={shareToLinkedIn}
                            handleShare={handleShare}
                            isMobile={isMobile}
                        />
                    </Box>
                </VStack>
            </Box>
        </WithNavigation>
    );
};

export default Referrals;
