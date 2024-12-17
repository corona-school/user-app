import { useState } from 'react';
import NotificationAlert from '@/components/notifications/NotificationAlert';
import { Typography } from '@/components/Typography';
import WithNavigation from '@/components/WithNavigation';
import { Button } from '../components/Button';
import { HStack, Stack, VStack, Box, useTheme, useBreakpointValue, Image, Input, IconButton, Icon, useClipboard } from 'native-base';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { useTranslation } from 'react-i18next';
import NavigationTabs from '../components/NavigationTabs';
import { WhatsappShareButton } from 'react-share';
import CopyIcon from '../assets/icons/lernfair/copy_button.svg';
import CheckIcon from '../assets/icons/check_outlined.svg';

// Importing Assests
import Medal from '../assets/images/referral/Medal.png';
import Character from '../assets/images/referral/Character.png';
import BLOB1 from '../assets/images/referral/Blob1.png';

const Referrals: React.FC<{}> = () => {
    const { t } = useTranslation();
    const { colors, space, sizes } = useTheme();

    const userID = sessionStorage.getItem('userID');
    const [uniqueReferralLink, setUniqueReferralLink] = useState('https://www.lern-fair.de/referral/' + userID);
    const { onCopy, hasCopied } = useClipboard();

    // Whatsapp Share
    const message = 'Check out this awesome referral link!';

    // Linkedin Share
    const shareToLinkedIn = () => {
        const imageURL = 'https://user-app-files.fra1.digitaloceanspaces.com/static/images/share_image.jpg';
        const linkedinURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(imageURL)}`;
        window.open(linkedinURL, '_blank');
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
                <VStack paddingX={space['1']} maxWidth={ContainerWidth} width="100%" height="85vh" marginY="10px">
                    <HStack space={4} w="100%" maxW="5xl">
                        <VStack w="50%">
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

                            <VStack space={2}>
                                <label className="block"> {t('referral.share.title')}</label>
                                <Input
                                    value={uniqueReferralLink}
                                    placeholder="Enter link"
                                    isReadOnly
                                    InputRightElement={
                                        <IconButton
                                            icon={hasCopied ? <CheckIcon style={{ color: colors.success[400] }} /> : <CopyIcon />}
                                            onPress={() => onCopy(uniqueReferralLink)}
                                            borderRadius="full"
                                        />
                                    }
                                />
                                <HStack space={4}>
                                    <Button variant="success" className="w-full py-2">
                                        <WhatsappShareButton url={uniqueReferralLink} title={message}>
                                            WhatsApp
                                        </WhatsappShareButton>
                                    </Button>

                                    <Button variant="default" className="w-full py-2" onClick={shareToLinkedIn}>
                                        Linkedin
                                    </Button>
                                </HStack>
                            </VStack>

                            {/* <VStack marginTop="5">
                                <Typography variant="h4" className="mb-1.5 font-bold">
                                    {t('referral.social.title')}
                                </Typography>
                                <Typography variant="h6" className="mb-3">
                                    {t('referral.social.description')}
                                </Typography>

                                <NavigationTabs
                                    tabs={[
                                        {
                                            title: 'Instagram',
                                            content: (
                                                <>
                                                    <Typography variant="sm">
                                                        Post a message in your timeline including a description and image for you to use.
                                                    </Typography>
                                                    <Typography className="underline font-bold my-3">Show Preview of Instagram Post</Typography>
                                                    <Button variant="secondary" className="w-full py-2 lg:w-fit" onClick={shareToLinkedIn}>
                                                        Instagram
                                                    </Button>
                                                </>
                                            ),
                                        },
                                        {
                                            title: 'LinkedIn',
                                            content: (
                                                <>
                                                    <Typography variant="sm">
                                                        Post a message in your timeline including a description and image for you to use.
                                                    </Typography>
                                                    <Typography className="underline font-bold my-3">Show Preview of LinkedIn Post</Typography>
                                                    <Button variant="secondary" className="w-full py-2 lg:w-fit" onClick={shareToLinkedIn}>
                                                        LinkedIn
                                                    </Button>
                                                </>
                                            ),
                                        },
                                    ]}
                                />
                            </VStack> */}
                        </VStack>
                        <VStack w="50%" position="relative" top="50%" justifyContent="center" alignItems="center">
                            <Box w="95%" h="420px" maxW="480px" backgroundColor="white" borderRadius="md" shadow={4} padding="10" position="relative">
                                <Image w="200px" height="120px" alt={'group'} source={{ uri: Medal }} position="absolute" top={1} right={1}></Image>
                                <Typography variant="h4" className="mt-12 font-bold">
                                    My Impact
                                </Typography>
                                <Typography variant="h6" className="mb-5">
                                    For every volunteer that joins, you get points towards your ........
                                </Typography>
                                <VStack space={4} alignItems="center">
                                    <HStack space={8} justifyContent="center">
                                        <VStack alignItems="center" position="relative">
                                            <Typography variant="h5" className="mb-4 font-bold underline">
                                                Registered Users
                                            </Typography>
                                            <Typography variant="h2" className="font-bold" style={{ color: colors.primary[400] }}>
                                                6
                                            </Typography>
                                        </VStack>

                                        <VStack alignItems="center" position="relative">
                                            <Typography variant="h5" className="mb-4 font-bold underline">
                                                Hours Supported
                                            </Typography>
                                            <Typography variant="h2" className="font-bold" style={{ color: colors.primary[400] }}>
                                                25
                                            </Typography>
                                        </VStack>
                                    </HStack>
                                </VStack>
                            </Box>
                        </VStack>
                    </HStack>
                </VStack>
            </Box>

            {/* Mobile View */}
            <Box display={{ base: 'block', xl: 'none' }}>
                <VStack minW="300px" maxW="768px" space={4} marginX="auto">
                    <Box h="280px">
                        {/* <Box w="100%" h="200px">
                            <Image size={48} source={{ uri: Character }} zIndex="1" position="absolute" right={0} bottom={0}></Image>
                            <Image size={48} source={{ uri: BLOB1 }} zIndex="0"></Image>
                        </Box> */}
                        <Typography variant="h5" className="font-bold mt-6 mb-3">
                            {t('referral.title')}
                        </Typography>
                        <Typography variant="h6" className="mb-3">
                            {t('referral.description')}
                        </Typography>
                    </Box>
                    <Box h="140px" backgroundColor="white" borderRadius="md" shadow={4} padding="5">
                        <Typography variant="h5" className="font-bold mb-3">
                            My Impact
                        </Typography>
                        <HStack space={5}>
                            <Typography variant="h6" className="font-bold mb-3">
                                Registered Users
                            </Typography>
                            <Typography variant="h5" className="font-bold mb-3" style={{ color: colors.primary[400] }}>
                                6
                            </Typography>
                        </HStack>
                        <HStack space={5}>
                            <Typography variant="h6" className="font-bold">
                                Hours Supported
                            </Typography>
                            <Typography variant="h5" className="font-bold" style={{ color: colors.primary[400] }}>
                                25
                            </Typography>
                        </HStack>
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
                                        icon={hasCopied ? <CheckIcon style={{ color: colors.success[400] }} /> : <CopyIcon />}
                                        onPress={() => onCopy(uniqueReferralLink)}
                                        borderRadius="full"
                                    />
                                }
                            />

                            <HStack space={4}>
                                {/* <Button variant="success" className="w-full py-2">
                                    <WhatsappShareButton url={uniqueReferralLink} title={message}>
                                        WhatsApp
                                    </WhatsappShareButton>
                                </Button> */}
                                <Button variant="default" className="w-full py-2" onClick={handleShare}>
                                    Share
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                    {/* <Box minH="250px" maxH="320px" backgroundColor="white" borderRadius="md" shadow={4} padding="5">
                        <label className="block mb-2"> {t('referral.social.title')}</label>

                        <NavigationTabs
                            tabs={[
                                {
                                    title: 'Instagram',
                                    content: (
                                        <>
                                            <Typography variant="sm">
                                                Post a message in your timeline including a description and image for you to use.
                                            </Typography>
                                            <Typography className="underline font-bold my-3">Show Preview of Instagram Post</Typography>
                                            <Button variant="secondary" className="w-full py-2 lg:w-fit" onClick={shareToLinkedIn}>
                                                Instagram
                                            </Button>
                                        </>
                                    ),
                                },
                                {
                                    title: 'LinkedIn',
                                    content: (
                                        <>
                                            <Typography variant="sm">
                                                Post a message in your timeline including a description and image for you to use.
                                            </Typography>
                                            <Typography className="underline font-bold my-3">Show Preview of LinkedIn Post</Typography>
                                            <Button variant="secondary" className="w-full py-2 lg:w-fit" onClick={shareToLinkedIn}>
                                                LinkedIn
                                            </Button>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </Box> */}
                </VStack>
            </Box>
        </WithNavigation>
    );
};

export default Referrals;
