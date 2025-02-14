import React from 'react';
import { Typography } from '@/components/Typography';

import HandsPhone1 from '../../assets/images/referral/HandsPhone1.svg';
import HandsPhone2 from '../../assets/images/referral/HandsPhone2.svg';
import LOCK from '../../assets/images/referral/Lock.svg';

type Props = {
    referralCount: number;
    supportedHours: number;
    t: (key: string) => string;
};

const Rewards: React.FC<Props> = ({ referralCount, supportedHours, t }) => (
    <div>
        <Typography variant="h4" className=" font-bold">
            {t('referral.reward.title')}
        </Typography>
        <Typography className="w-3/4 mb-5">{t('referral.reward.description')}</Typography>
        <div className="flex justify-center space-x-4 text-center">
            <div className="flex flex-col items-center max-w-[200px]">
                <Typography variant="h5" className="mb-4 font-bold underline">
                    {t('referral.reward.RegisteredUsers')}
                </Typography>
                <Typography variant="h2" className="font-bold text-primary-400">
                    {referralCount}
                </Typography>
                <HandsPhone1 style={{ marginTop: '5px' }}></HandsPhone1>
            </div>

            <div className="flex flex-col items-center max-w-[200px]">
                <Typography variant="h5" className="mb-4 font-bold underline">
                    {t('referral.reward.HoursSupported')}
                </Typography>
                <Typography variant="h2" className="font-bold text-primary-400">
                    {referralCount >= 3 ? (
                        supportedHours
                    ) : (
                        <div className="group relative">
                            <LOCK className="w-[48px] h-[50px]" />
                            <div className="absolute left-full top-0 hidden group-hover:block w-[192px] h-[41px] p-[6px_14px] flex flex-col items-start gap-1 bg-[#ECF3F2] text-[#64748B] font-outfit text-[10px] font-normal leading-[10px] rounded-[6px] ml-2">
                                <div className="text-[#64748B] font-outfit text-[10px] font-normal leading-[10px]">{t('referral.reward.tooltip')}</div>
                                <div className="absolute left-[-10px] top-[50%] transform -translate-y-1/2 w-0 h-0 border-t-[5px] border-r-[10px] border-b-[5px] border-transparent border-r-[#ECF3F2]"></div>
                            </div>
                        </div>
                    )}
                </Typography>
                <HandsPhone2 style={{ marginTop: referralCount >= 3 ? '5px' : '0px' }}></HandsPhone2>
            </div>
        </div>
    </div>
);

export default Rewards;
