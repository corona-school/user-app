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
        <Typography className="w-3/4 mb-5">{t('referral.reward.description')}</Typography>
        <div className="flex justify-center space-x-4 text-center">
            <div className="flex flex-col items-center max-w-[200px]">
                <Typography variant="h5" className="mb-4 font-bold underline">
                    {t('referral.reward.RegisteredUsers')}
                </Typography>
                <Typography variant="h2" className="font-bold text-primary">
                    {referralCount === 0 ? (
                        <div className="group relative inline-block">
                            <LOCK className="w-[48px] h-[50px]" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-[200px] p-3 bg-accent text-primary text-xs rounded-[6px] text-left font-normal z-10">
                                <div>Hier kannst du später sehen, wieviele sich mit deinem Link registriert haben.</div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        bottom: '-5px',
                                        width: 0,
                                        height: 0,
                                        borderLeft: '5px solid transparent',
                                        borderRight: '5px solid transparent',
                                        borderTop: '5px solid #ECF3F2',
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        referralCount
                    )}
                </Typography>
                <HandsPhone1 style={{ marginTop: '5px' }}></HandsPhone1>
            </div>

            <div className="flex flex-col items-center max-w-[200px]">
                <Typography variant="h5" className="mb-4 font-bold underline">
                    {t('referral.reward.HoursSupported')}
                </Typography>
                <Typography variant="h2" className="font-bold text-primary">
                    {referralCount >= 3 ? (
                        supportedHours
                    ) : (
                        <div className="group relative">
                            <LOCK className="w-[48px] h-[50px]" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-[200px] p-3 bg-accent text-primary text-xs rounded-[6px] z-10">
                                <div>{t('referral.reward.tooltip')}</div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        bottom: '-5px',
                                        width: 0,
                                        height: 0,
                                        borderLeft: '5px solid transparent',
                                        borderRight: '5px solid transparent',
                                        borderTop: '5px solid #ECF3F2',
                                    }}
                                />
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
