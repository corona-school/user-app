import NotificationAlert from '@/components/notifications/NotificationAlert';
import { Typography } from '@/components/Typography';
import WithNavigation from '@/components/WithNavigation';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { HStack, Stack, VStack, Box, Image } from 'native-base';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NavigationTabs from '../components/NavigationTabs';
import { useLocation, useNavigate } from 'react-router-dom';
import BGLGICON from '../assets/icons/lernfair/referral/bg_lg.svg';
import BGSMICON from '../assets/icons/lernfair/referral/bg_sm.svg';
import MEDAL from '../assets/icons/lernfair/referral/medal.svg';
import MOBILE1 from '../assets/icons/lernfair/referral/hands_mobile1.svg';
import MOBILE2 from '../assets/icons/lernfair/referral/hands_mobile2.svg';
import CELEBRATE from '../assets/icons/lernfair/referral/celebrate.svg';

const tabs = ['Instagram', 'Linkedin'];

const Referrals: React.FC<{}> = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [inputValue, setInputValue] = useState('');
    const [submittedValue, setSubmittedValue] = useState('');

    const path = pathname.split('/').pop() || '';
    const currentTabFromRoute = tabs.includes(path) ? path : tabs[0];

    const handleButtonClick = () => {
        setSubmittedValue(inputValue);
        console.log('Submitted value:', inputValue);
    };

    return (
        <WithNavigation
            headerLeft={
                <Stack alignItems="center" direction="row">
                    <SwitchLanguageButton />
                    <NotificationAlert />
                </Stack>
            }
        >
            {/* <BGSMICON
                style={{
                    position: 'absolute',
                    bottom: 0,
                    zIndex: -1,
                    transform: 'scale(1)',
                    transition: 'transform 0.3s ease',
                }}
            ></BGSMICON> */}
            <Box display={{ base: 'none', md: 'block' }}>
                <VStack flex="1" alignItems="center" padding="5">
                    <HStack w="100%" maxW="5xl" justifyContent="space-between">
                        <VStack w="45%">
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

                            <VStack space="2">
                                <label className="block text-sm font-bold"> {t('referral.share.title')}</label>
                                <HStack space="2">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="w-full font-bold"
                                        placeholder="Enter link"
                                    />
                                    <Button variant="default" className="w-full py-2 px-3 ml-2 lg:mt-0 lg:w-fit ml-auto" onClick={handleButtonClick}>
                                        Copy Link
                                    </Button>
                                </HStack>
                            </VStack>

                            <VStack marginTop="5">
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
                                                    <Button variant="secondary" className="w-full py-2 lg:w-fit" onClick={handleButtonClick}>
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
                                                    <Button variant="secondary" className="w-full py-2 lg:w-fit" onClick={handleButtonClick}>
                                                        LinkedIn
                                                    </Button>
                                                </>
                                            ),
                                        },
                                    ]}
                                />
                            </VStack>
                        </VStack>
                        <VStack w="55%" position="relative" justifyContent="center" alignItems="center">
                            <Box w="480px" h="420px" backgroundColor="white" borderRadius="md" shadow={4} padding="10" position="relative" zIndex={1}>
                                <MEDAL
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        scale: '0.9',
                                    }}
                                ></MEDAL>

                                <Typography variant="h4" className="mt-12 font-bold">
                                    My Impact
                                </Typography>
                                <Typography variant="h6" className="mb-5 w-3/4">
                                    For every volunteer that joins, you get points towards your ........
                                </Typography>
                                <VStack space={4} alignItems="center">
                                    <HStack space={8} justifyContent="center">
                                        <VStack alignItems="center">
                                            <Typography variant="h5" className="mb-4 font-bold underline">
                                                Registered Users
                                            </Typography>
                                            <Typography variant="h2">6</Typography>
                                            <MOBILE1></MOBILE1>
                                        </VStack>

                                        <VStack alignItems="center">
                                            <Typography variant="h5" className="mb-4 font-bold underline">
                                                Hours Supported
                                            </Typography>
                                            <Typography variant="h2">25</Typography>
                                            <MOBILE2></MOBILE2>
                                        </VStack>
                                    </HStack>
                                </VStack>
                            </Box>

                            <BGLGICON
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    zIndex: -1,
                                    transform: 'scale(1)',
                                    transition: 'transform 0.3s ease',
                                }}
                            />
                        </VStack>
                    </HStack>
                </VStack>
            </Box>
            <Box display={{ base: 'block', md: 'none' }}>
                <Typography variant="h4" className="font-bold mb-3">
                    {t('referral.title')}
                </Typography>
                <Typography variant="h6" className="mb-3">
                    {t('referral.description')}
                </Typography>
                <VStack minW="300px" maxW="767px" alignItems="center" space={4}>
                    <Box w="85%" h="140px" backgroundColor="white" borderRadius="md" shadow={4} padding="5">
                        <CELEBRATE
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: 0,
                                scale: '0.9',
                            }}
                        ></CELEBRATE>

                        <Typography variant="h5" className="font-bold mb-3">
                            My Impact
                        </Typography>
                        <HStack space={5}>
                            <Typography variant="h6" className="font-bold mb-3">
                                Registered Users
                            </Typography>
                            <Typography variant="h5" className="font-bold mb-3">
                                6
                            </Typography>
                        </HStack>
                        <HStack space={5}>
                            <Typography variant="h6" className="font-bold">
                                Hours Supported
                            </Typography>
                            <Typography variant="h5" className="font-bold">
                                25
                            </Typography>
                        </HStack>
                    </Box>
                    <Box w="85%" h="170px" backgroundColor="white" borderRadius="md" shadow={4} padding="5">
                        <VStack space={2}>
                            <label className="block"> {t('referral.share.title')}</label>
                            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full" placeholder="Enter link" />

                            <HStack space={4}>
                                <Button variant="success" className="w-full py-2" onClick={handleButtonClick}>
                                    WhatsApp
                                </Button>
                                <Button variant="default" className="w-full py-2" onClick={handleButtonClick}>
                                    Copy Link
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                    <Box w="85%" h="250px" backgroundColor="white" borderRadius="md" shadow={4} padding="5">
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
                                            <Button variant="secondary" className="w-full py-2 lg:w-fit" onClick={handleButtonClick}>
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
                                            <Button variant="secondary" className="w-full py-2 lg:w-fit" onClick={handleButtonClick}>
                                                LinkedIn
                                            </Button>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </Box>
                </VStack>
            </Box>
        </WithNavigation>
    );
};

export default Referrals;
