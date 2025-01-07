import { useState } from 'react';
import NotificationAlert from '@/components/notifications/NotificationAlert';
import { Typography } from '@/components/Typography';
import WithNavigation from '@/components/WithNavigation';
import { Button } from '../components/Button';
import { HStack, Stack, VStack, Box, useTheme, useBreakpointValue, Input, IconButton, useClipboard } from 'native-base';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { useTranslation } from 'react-i18next';
import { WhatsappShareButton } from 'react-share';

// Icons
import CopyIcon from '../assets/icons/lernfair/copy_button.svg';
import CopiedIcon from '../assets/icons/lernfair/referral/copyticked.svg';
import WhatsAppIcon from '../assets/icons/lernfair/referral/Whatsapp.svg';
import LinkedInIcon from '../assets/icons/lernfair/referral/LinkedIn.svg';
import Option1Icon from '../assets/icons/lernfair/referral/bulletOne.svg';
import Option2Icon from '../assets/icons/lernfair/referral/bulletTwo.svg';
import Option3Icon from '../assets/icons/lernfair/referral/bulletThree.svg';

// Importing Assests
import Confetti from '../assets/images/referral/Confetti.svg';
import ConnfettiMobile from '../assets/images/referral/ConfettiMobile.svg';
import BGDesktop from '../assets/images/referral/BGDesktop.svg';
import BGMobile from '../assets/images/referral/BGMobile.svg';
import Character from '../assets/images/referral/Character.svg';
import HandsPhone1 from '../assets/images/referral/HandsPhone1.svg';
import HandsPhone2 from '../assets/images/referral/HandsPhone2.svg';

const Referrals: React.FC<{}> = () => {
    const { t } = useTranslation();
    const { colors, space, sizes } = useTheme();

    const userID = sessionStorage.getItem('userID');
    const [uniqueReferralLink, setUniqueReferralLink] = useState('https://www.lern-fair.de/referral?referredById=' + userID);
    const [buttonText, setButtonText] = useState('Share on LinkedIn');
    const { onCopy, hasCopied } = useClipboard();

    // Whatsapp Share
    const message =
        '📣 HIRING VOLUNTEERS  📣Want to give back to the community? Now is the perfect time! We are currently looking for volunteers to teach german school children grade 1- 13. #lernfair #education #e-learning';

    // Linkedin Share
    const shareToLinkedIn = () => {
        const imageURL = 'https://user-app-files.fra1.digitaloceanspaces.com/static/images/share_image.jpg';
        const linkedinURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(imageURL)}`;

        setButtonText('Referral link copied!');
        onCopy(message + '\n' + uniqueReferralLink);

        setTimeout(() => {
            window.open(linkedinURL, '_blank');
            setButtonText('Share on LinkedIn');
        }, 2000);
    };

    // Mobile Share
    const handleShare = () => {
        navigator.share({
            url: uniqueReferralLink,
        });
    };

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
                                <Option1Icon />
                                <Typography variant="h5">
                                    {t('referral.share.option1.option')}
                                    <Typography variant="h6" className="inline">
                                        {t('referral.share.option1.description')}
                                    </Typography>
                                </Typography>
                            </HStack>
                            <HStack space={2} margin={space['1']}>
                                <Option2Icon />
                                <Typography variant="h5">
                                    {t('referral.share.option2.option')}
                                    <Typography variant="h6" className="inline">
                                        {t('referral.share.option2.description')}
                                    </Typography>
                                </Typography>
                            </HStack>
                            <HStack space={2} margin={space['1']}>
                                <Option3Icon />
                                <Typography variant="h5">
                                    {t('referral.share.option3.option')}
                                    <Typography variant="h6" className="inline">
                                        {t('referral.share.option3.description')}
                                    </Typography>
                                </Typography>
                            </HStack>

                            {/* Share Buttons */}
                            <VStack space={2}>
                                <label className="block"> {t('referral.share.title')}</label>
                                <Input
                                    value={uniqueReferralLink}
                                    placeholder="Enter link"
                                    isReadOnly
                                    InputRightElement={
                                        // 👉 Remove icon hover effect
                                        <IconButton
                                            icon={
                                                hasCopied ? (
                                                    <>
                                                        <CopiedIcon style={{ marginRight: '8px' }} /> Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <CopyIcon style={{ marginRight: '8px' }} /> Copy Link
                                                    </>
                                                )
                                            }
                                            onPress={() => onCopy(uniqueReferralLink)}
                                            borderRadius="full"
                                        />
                                    }
                                />
                                <HStack space={4}>
                                    <WhatsappShareButton url={uniqueReferralLink} title={message} className="w-full">
                                        <Button variant="success" className="w-full">
                                            <WhatsAppIcon />
                                            Share on WhatsApp
                                        </Button>
                                    </WhatsappShareButton>

                                    <Button variant="linkedIn" className="w-full" onClick={shareToLinkedIn}>
                                        <LinkedInIcon /> {buttonText}
                                    </Button>
                                </HStack>
                            </VStack>
                        </Box>
                    </VStack>
                    <VStack w="52%">
                        <BGDesktop style={{ position: 'absolute', top: '-150px', left: 'calc(-380px + (100% - 686px) / 2)', zIndex: -1 }}></BGDesktop>

                        <Box w="480px" h="440px" marginX={'auto'} backgroundColor="white" borderRadius="md" shadow={4} padding="10" position="relative">
                            <Confetti style={{ position: 'absolute', top: '-5px', right: '-5px', transform: 'scale(.8)' }}></Confetti>

                            <Typography variant="h4" className=" font-bold">
                                {t('referral.reward.title')}
                            </Typography>
                            <Typography variant="h6" className="w-3/4 mb-5">
                                {t('referral.reward.description')}
                            </Typography>
                            <VStack space={4} alignItems="center">
                                <HStack space={8} justifyContent="center">
                                    <VStack alignItems="center" position="relative">
                                        <Typography variant="h5" className="mb-4 font-bold underline">
                                            {t('referral.reward.RegisteredUsers')}
                                        </Typography>
                                        <Typography variant="h2" className="font-bold" style={{ color: colors.primary[400] }}>
                                            6
                                        </Typography>
                                        <HandsPhone1
                                            style={{
                                                position: 'absolute',
                                                bottom: '-150px',
                                            }}
                                        ></HandsPhone1>
                                    </VStack>

                                    <VStack alignItems="center" position="relative">
                                        <Typography variant="h5" className="mb-4 font-bold underline">
                                            {t('referral.reward.HoursSupported')}
                                        </Typography>
                                        <Typography variant="h2" className="font-bold" style={{ color: colors.primary[400] }}>
                                            25
                                        </Typography>
                                        <HandsPhone2
                                            style={{
                                                position: 'absolute',
                                                bottom: '-150px',
                                            }}
                                        ></HandsPhone2>
                                    </VStack>
                                </HStack>
                            </VStack>
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
                        <ConnfettiMobile style={{ position: 'absolute', top: '-5px', right: '-5px', transform: 'scale(.6)' }}></ConnfettiMobile>

                        <Typography variant="h5" className="font-bold mb-3">
                            {t('referral.reward.title')}
                        </Typography>
                        <HStack space={5}>
                            <Typography variant="h6" className="font-bold mb-3">
                                {t('referral.reward.RegisteredUsers')}
                            </Typography>
                            <Typography variant="h5" className="font-bold mb-3" style={{ color: colors.primary[400] }}>
                                6
                            </Typography>
                        </HStack>
                        <HStack space={5}>
                            <Typography variant="h6" className="font-bold">
                                {t('referral.reward.HoursSupported')}
                            </Typography>
                            <Typography variant="h5" className="font-bold" style={{ color: colors.primary[400] }}>
                                25
                            </Typography>
                        </HStack>
                    </Box>
                    <Box backgroundColor="white" borderRadius="md" shadow={4} padding="5">
                        <label className="block mb-2">How it works</label>

                        <Typography variant="h5">
                            <Option1Icon className="inline mr-1 mb-1" />
                            Copy your Referral Link
                            <Typography variant="h6" className="inline">
                                - copy your unique link below
                            </Typography>
                        </Typography>

                        <Typography variant="h5">
                            <Option2Icon className="inline mr-1 mb-1" />
                            Choose where to Share
                            <Typography variant="h6" className="inline">
                                - with the copied link, hit Share and select your preferred app to share on WhatsApp, LinkedIn, Email or Social Media apps
                            </Typography>
                        </Typography>
                    </Box>
                    <Box h="170px" backgroundColor="white" borderRadius="md" shadow={4} padding="5">
                        <VStack space={2}>
                            <label className="block"> {t('referral.share.title')}</label>
                            <Input
                                value={uniqueReferralLink}
                                placeholder="Enter link"
                                isReadOnly
                                InputRightElement={
                                    <IconButton
                                        icon={
                                            hasCopied ? (
                                                <>
                                                    <CopiedIcon />
                                                </>
                                            ) : (
                                                <>
                                                    <CopyIcon />
                                                </>
                                            )
                                        }
                                        onPress={() => onCopy(uniqueReferralLink)}
                                        borderRadius="full"
                                    />
                                }
                            />

                            <HStack space={4}>
                                <Button variant="default" className="w-full py-2" onClick={handleShare}>
                                    Share
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                </VStack>
            </Box>
        </WithNavigation>
    );
};

export default Referrals;
