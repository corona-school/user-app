import { useUser } from '@/hooks/useApollo';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import { Skeleton } from '../Skeleton';
import { Typography } from '../Typography';

interface MatchAvailabilityStatusProps {
    onContactMatch: () => void;
    learningPartnerName: string;
    areMyPreferencesSetup: boolean;
    areMyMatchPreferencesSetup: boolean;
    isContactingMatch: boolean;
    isLoading: boolean;
}

export const MatchAvailabilityStatus = ({
    onContactMatch,
    learningPartnerName,
    areMyMatchPreferencesSetup,
    areMyPreferencesSetup,
    isContactingMatch,
    isLoading,
}: MatchAvailabilityStatusProps) => {
    const { firstname } = useUser();
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-y-2 lg:flex-row lg:gap-x-8 mb-5">
            <Skeleton isLoading={isLoading}>
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
            </Skeleton>
            <Skeleton isLoading={isLoading}>
                {!areMyMatchPreferencesSetup && (
                    <div className="flex items-center gap-x-2">
                        <div className="size-[14px] border border-orange-400 bg-orange-400 rounded-full"></div>{' '}
                        <Typography>
                            <Trans
                                i18nKey="matching.availability.matchHasNotSetupPreferencesYet"
                                values={{ learningPartnerName: learningPartnerName, myName: firstname }}
                                t={t}
                                components={{
                                    chatLink: (
                                        <Button isLoading={isContactingMatch} className="size-fit p-0 underline" variant="link" onClick={onContactMatch} />
                                    ),
                                }}
                            />
                        </Typography>
                    </div>
                )}
            </Skeleton>
        </div>
    );
};
