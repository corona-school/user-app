import React from 'react';
import { VStack, HStack, Box, Tooltip } from 'native-base';
import { Typography } from '@/components/Typography';

import HandsPhone1 from '../../assets/images/referral/HandsPhone1.svg';
import HandsPhone2 from '../../assets/images/referral/HandsPhone2.svg';
import LOCK from '../../assets/images/referral/Lock.svg';

type Props = {
    referralCount: number;
    supportedHours: number;
    colors: any;
    t: (key: string) => string;
};

const Rewards: React.FC<Props> = ({ referralCount, supportedHours, colors, t }) => (
    <VStack>
        <Typography variant="h4" className=" font-bold">
            {t('referral.reward.title')}
        </Typography>
        <Typography variant="h6" className="w-3/4 mb-5">
            {t('referral.reward.description')}
        </Typography>
        <HStack space={4} justifyContent="center" textAlign="center">
            <VStack alignItems="center" maxW="200px">
                <Typography variant="h5" className="mb-4 font-bold underline">
                    {t('referral.reward.RegisteredUsers')}
                </Typography>
                <Typography variant="h2" className="font-bold" style={{ color: colors.primary[400] }}>
                    {referralCount}
                </Typography>
                <HandsPhone1 style={{ marginTop: '5px' }}></HandsPhone1>
            </VStack>

            <VStack alignItems="center" maxW="200px">
                <Typography variant="h5" className="mb-4 font-bold underline">
                    {t('referral.reward.HoursSupported')}
                </Typography>
                <Typography variant="h2" className="font-bold" style={{ color: colors.primary[400] }}>
                    {referralCount >= 3 ? (
                        supportedHours
                    ) : (
                        <Tooltip
                            maxW={250}
                            label={'to unlock this you need to have 3 or more registered users'}
                            bg={'primary.100'}
                            placement="right"
                            _text={{ lineHeight: '1rem', color: colors.primary[700] }}
                            p={3}
                            hasArrow
                            children={
                                <Box>
                                    <LOCK />
                                </Box>
                            }
                        ></Tooltip>
                    )}
                </Typography>
                <HandsPhone2 style={{ marginTop: referralCount >= 3 ? '5px' : '0px' }}></HandsPhone2>
            </VStack>
        </HStack>
    </VStack>
);

export default Rewards;
