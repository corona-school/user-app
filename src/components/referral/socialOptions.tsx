import React from 'react';
import { VStack, HStack, Input, IconButton } from 'native-base';
import { WhatsappShareButton } from 'react-share';
import { Button } from '@/components/Button';

import CopyIcon from '../../assets/icons/lernfair/copy_button.svg';
import CopiedIcon from '../../assets/icons/lernfair/referral/copyticked.svg';
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
    <VStack space={2}>
        <label className="block"> {t('referral.share.title')}</label>
        <Input
            value={uniqueReferralLink}
            isReadOnly
            placeholder="Enter link"
            InputRightElement={
                <IconButton
                    icon={
                        hasCopied ? (
                            <>
                                <CopiedIcon style={{ marginRight: '8px' }} /> {t('referral.copied')}
                            </>
                        ) : (
                            <>
                                <CopyIcon style={{ marginRight: '8px' }} /> {t('referral.copy')}
                            </>
                        )
                    }
                    onPress={() => onCopy(uniqueReferralLink)}
                    borderRadius="full"
                />
            }
        />
        <HStack space={4}>
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
        </HStack>
    </VStack>
);

export default SocialOptions;
