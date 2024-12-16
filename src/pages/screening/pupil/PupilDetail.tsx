import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { Pupil_Screening_Status_Enum } from '@/gql/graphql';
import { PupilForScreening, PupilScreening } from '@/types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PupilMatchingHistory, PupilScreeningsHistory } from './PupilHistory';
import { ScreeningSuggestionCard } from '@/widgets/screening/ScreeningSuggestionCard';
import { ScreenPupil } from './ScreenPupil';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import PersonalDetails from './PersonalDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Panels';

interface PupilDetailProps {
    pupil: PupilForScreening;
    refresh: () => Promise<void>;
}

const REQUEST_MATCH_MUTATION = gql(`
    mutation PupilRequestMatch($pupilId: Float!) { pupilCreateMatchRequest(pupilId: $pupilId) }
`);

const REVOKE_MATCH_REQUEST_MUTATION = gql(`
    mutation PupilRevokeMatchRequest($pupilId: Float!) { pupilDeleteMatchRequest(pupilId: $pupilId) }
`);

const PupilDetail = ({ pupil, refresh }: PupilDetailProps) => {
    const { t } = useTranslation();

    const [mutationRequestMatch, { loading: isRequestingMatch }] = useMutation(REQUEST_MATCH_MUTATION);
    const [mutationRevokeMatchRequest, { loading: isRevokingMatchRequest }] = useMutation(REVOKE_MATCH_REQUEST_MUTATION);

    const { previousScreenings, screeningToEdit } = useMemo(() => {
        const previousScreenings: PupilScreening[] = [...pupil!.screenings!];
        let screeningToEdit: PupilScreening | null = null;

        previousScreenings.sort((a, b) => +new Date(b!.createdAt) - +new Date(a!.createdAt));

        if (
            previousScreenings.length > 0 &&
            !previousScreenings[0]!.invalidated &&
            (previousScreenings[0]!.status === Pupil_Screening_Status_Enum.Pending || previousScreenings[0]!.status === Pupil_Screening_Status_Enum.Dispute)
        ) {
            screeningToEdit = previousScreenings.shift()!;
        }

        return { previousScreenings, screeningToEdit };
    }, [pupil!.screenings!]);

    const needsScreening =
        // If the user was not yet invited for screening, they might need a new one
        previousScreenings.length === 0 ||
        // or in case the previous screening was already invalidated
        previousScreenings[0].invalidated;

    const handleOnRequestMatch = async () => {
        try {
            await mutationRequestMatch({ variables: { pupilId: pupil.id } });
            toast.success(t('changesWereSaved'));
        } catch (error) {
            toast.error(t('error'));
        }
        refresh();
    };

    const handleOnRemoveMatchRequest = async () => {
        try {
            await mutationRevokeMatchRequest({ variables: { pupilId: pupil.id } });
            toast.success(t('changesWereSaved'));
        } catch (error) {
            toast.error(t('error'));
        }
        refresh();
    };

    return (
        <div className="mt-8">
            <Typography variant="h3" className="mb-6">
                {pupil.firstname} {pupil.lastname} (Schüler:in)
            </Typography>
            <Tabs defaultValue="main">
                <TabsList className="max-h-9 p-1 mb-2">
                    <TabsTrigger className="max-h-7" value="main">
                        Profil + Screening
                    </TabsTrigger>
                    <TabsTrigger className="max-h-7" value="matching">
                        Matching
                    </TabsTrigger>
                    <TabsTrigger className="max-h-7" value="recommendation">
                        Empfehlungen
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="main">
                    <div className="shadow-md px-6 py-8 rounded-md">
                        <PersonalDetails pupil={pupil} refresh={refresh} />
                    </div>
                    <div className="shadow-md px-6 py-8 rounded-md mt-10">
                        <Typography variant="h4" className="mb-5">
                            Screening
                        </Typography>
                        <ScreenPupil pupil={pupil} screening={screeningToEdit ?? undefined} needsScreening={needsScreening} refresh={refresh} />
                    </div>
                    {previousScreenings.length > 0 && (
                        <div className="shadow-md px-6 py-8 rounded-md mt-10">
                            <Typography variant="h4" className="mb-5">
                                Vorherige Screenings
                            </Typography>
                            <PupilScreeningsHistory screenings={previousScreenings} />
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="matching">
                    <div className="flex flex-col shadow-md px-6 py-8 rounded-md">
                        <Typography variant="h4" className="mb-5">
                            Match Anfragen
                        </Typography>
                        <div className="flex flex-col gap-y-4">
                            <Typography className="block">{pupil.openMatchRequestCount} Matchanfragen</Typography>
                            <div className="flex items-center gap-x-4">
                                <Button
                                    isLoading={isRequestingMatch}
                                    disabled={needsScreening && !screeningToEdit}
                                    reasonDisabled="Zuerst muss ein Screening angelegt werden"
                                    onClick={handleOnRequestMatch}
                                >
                                    Match anfragen
                                </Button>
                                <Button
                                    variant="outline"
                                    isLoading={isRevokingMatchRequest}
                                    disabled={pupil.openMatchRequestCount === 0}
                                    reasonDisabled="Keine offene Matchanfrage"
                                    onClick={handleOnRemoveMatchRequest}
                                >
                                    Anfrage zurücknehmen
                                </Button>
                            </div>
                        </div>
                    </div>
                    {pupil.matches && pupil.matches.length > 0 && (
                        <div className="flex flex-col shadow-md px-6 py-8 rounded-md mt-10">
                            <Typography variant="h4" className="mb-5">
                                Matching Verlauf
                            </Typography>
                            <PupilMatchingHistory matches={pupil.matches} />
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="recommendation">
                    <div className="flex flex-col shadow-md px-6 py-8 rounded-md">
                        <Typography variant="h4" className="mb-5">
                            Empfehlungen
                        </Typography>
                        <ScreeningSuggestionCard userID={`pupil/${pupil.id}`} variant="pupil" />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PupilDetail;
