import { useUser } from '@/hooks/useApollo';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import { Typography } from '../Typography';

interface MatchAvailabilityStatusProps {
    onContactMatch: () => void;
    learningPartnerName: string;
    areMyPreferencesSetup: boolean;
    areMyMatchPreferencesSetup: boolean;
}

export const MatchAvailabilityStatus = ({
    onContactMatch,
    learningPartnerName,
    areMyMatchPreferencesSetup,
    areMyPreferencesSetup,
}: MatchAvailabilityStatusProps) => {
    const { firstname } = useUser();
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-y-2 lg:flex-row lg:gap-x-8 mb-5">
            {areMyPreferencesSetup && areMyMatchPreferencesSetup && (
                <>
                    <div className="flex items-center gap-x-2">
                        <div className="size-[14px] border border-gray-300 bg-green-200 rounded-full"></div>{' '}
                        <Typography>{t('matching.availability.bothOfYouHaveTime')}</Typography>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <div className="size-[14px] border border-gray-300 bg-primary-lighter rounded-full"></div>{' '}
                        <Typography>
                            {t('matching.availability.youDoNotHaveTime')}{' '}
                            <Link to="/calendar-preferences" className="underline decoration-1">
                                ({t('matching.availability.editAvailability')})
                            </Link>
                        </Typography>
                    </div>
                </>
            )}
            {!areMyMatchPreferencesSetup && (
                <div className="flex items-center gap-x-2">
                    <div className="size-[14px] border border-orange-400 bg-orange-400 rounded-full"></div>{' '}
                    <Typography>
                        ({t('matching.availability.editAvailability')})&nbsp;
                        <Trans
                            i18nKey="matching.availability.matchHasNotSetupPreferencesYet"
                            values={{ learningPartnerName: learningPartnerName, myName: firstname }}
                            components={{
                                chatLink: <Button className="size-fit p-0 underline" variant="link" onClick={onContactMatch} />,
                            }}
                        />
                    </Typography>
                </div>
            )}
        </div>
    );
};
