import React from 'react';
import { WhatsappShareButton } from 'react-share';
import { Button } from '@/components/Button';
import { IconCopy, IconCopyCheck } from '@tabler/icons-react';

import WhatsAppIcon from '../../assets/icons/lernfair/referral/Whatsapp.svg';
import LinkedInIcon from '../../assets/icons/lernfair/referral/LinkedIn.svg';

type Props = {
    uniqueReferralLink: string;
    referralMessage: string;
    onCopy: (link: string) => void;
    hasCopied: boolean;
    linkedinButtonText: string;
    shareToLinkedIn: () => void;
    handleShare: () => void;
    t: (key: string) => string;
    isMobile: boolean;
};

const SocialOptions: React.FC<Props> = ({
    uniqueReferralLink,
    referralMessage,
    onCopy,
    hasCopied,
    linkedinButtonText,
    shareToLinkedIn,
    handleShare,
    t,
    isMobile,
}) => (
    <div className="space-y-2">
        <label className="block"> {t('referral.share.title')}</label>
        <div className="relative">
            <input value={uniqueReferralLink} readOnly placeholder="Enter link" className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg" />
            <button
                onClick={() => onCopy(uniqueReferralLink)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-300"
            >
                {hasCopied ? (
                    <span className="flex items-center">
                        <IconCopyCheck className="mr-2" /> {t('referral.copied')}
                    </span>
                ) : (
                    <span className="flex items-center">
                        <IconCopy className="mr-2" /> {t('referral.copy')}
                    </span>
                )}
            </button>
        </div>
        <div className="space-x-4 flex">
            {isMobile ? (
                <Button variant="default" className="w-full py-2" onClick={handleShare}>
                    {t('referral.share.share')}
                </Button>
            ) : (
                <>
                    <WhatsappShareButton url={uniqueReferralLink} title={referralMessage} className="w-full">
                        <Button variant="success" className="w-full">
                            <WhatsAppIcon />
                            {t('referral.share.option2.option')}
                        </Button>
                    </WhatsappShareButton>

                    <Button variant="linkedIn" className="w-full" onClick={shareToLinkedIn}>
                        <LinkedInIcon /> {linkedinButtonText}
                    </Button>
                </>
            )}
        </div>
    </div>
);

export default SocialOptions;
