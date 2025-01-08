import { useState } from 'react';
import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { IconDeviceFloppy, IconThumbUp, IconThumbDown, IconGhost } from '@tabler/icons-react';
import { KnowsUsSelect } from '../components/KnowsUsSelect';
import { InfoCard } from '@/components/InfoCard';
import { useTranslation } from 'react-i18next';
import { PupilForScreening, PupilScreening } from '@/types';
import { gql } from '@/gql';
import { ApolloError, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import ConfirmationModal from '@/modals/ConfirmationModal';
import { useUser } from '@/hooks/useApollo';
import { PupilScreeningStatus, Pupil_Screening_Status_Enum } from '@/gql/graphql';
import { Label } from '@/components/Label';
import { TextArea } from '@/components/TextArea';

interface ScreenPupilProps {
    pupil: PupilForScreening;
    screening?: PupilScreening;
    needsScreening: boolean;
    refresh: () => Promise<void>;
}

const DEACTIVATE_ACCOUNT_MUTATION = gql(`
    mutation ScreenerDeactivatePupil($pupilId: Float!) { pupilDeactivate(pupilId: $pupilId) }
`);

const CREATE_PUPIL_SCREENING_MUTATION = gql(`
    mutation CreateScreening($pupilId: Float!) { pupilCreateScreening(pupilId: $pupilId, silent: true) }
`);

const UPDATE_SCREENING_MUTATION = gql(`
    mutation UpdatePupilScreening($id: Float!, $screeningComment: String!, $status: PupilScreeningStatus, $knowsFrom: String!) {
        pupilUpdateScreening(pupilScreeningId: $id, data: {
            comment: $screeningComment,
            status: $status
            knowsCoronaSchoolFrom: $knowsFrom
        })
    }
`);

const MISSED_SCREENING_MUTATION = gql(
    `mutation MissedScreening($pupilScreeningId: Float!, $comment: String!) { pupilMissedScreening(pupilScreeningId: $pupilScreeningId, comment: $comment) }`
);

const CUSTOM_KNOWS_FROM_PREFIX = 'Sonstiges: ';

export const ScreenPupil = ({ screening, needsScreening, pupil, refresh }: ScreenPupilProps) => {
    const { t } = useTranslation();
    const screener = useUser();
    const [knowsFrom, setKnowsFrom] = useState(screening?.knowsCoronaSchoolFrom ?? '');
    const [customKnowsFrom, setCustomKnowsFrom] = useState('');
    const [comment, setComment] = useState(screening?.comment ?? '');
    const [showConfirmDeactivate, setShowConfirmDeactivate] = useState(false);
    const [showConfirmApprove, setShowConfirmApprove] = useState(false);
    const [showConfirmReject, setShowConfirmReject] = useState(false);
    const [showConfirmMissedScreening, setShowConfirmMissedScreening] = useState(false);

    const [mutationDeactivateAccount, { loading: isDeactivating, data: deactivateResult }] = useMutation(DEACTIVATE_ACCOUNT_MUTATION);
    const [mutationCreateScreening] = useMutation(CREATE_PUPIL_SCREENING_MUTATION);
    const [mutationUpdateScreening, { loading: isUpdatingScreening }] = useMutation(UPDATE_SCREENING_MUTATION);
    const [mutationMarkScreeningAsMissed, { loading: isMarkingScreeningAsMissed }] = useMutation(MISSED_SCREENING_MUTATION);

    const getCanCreateScreening = () => {
        if (!pupil.verifiedAt) {
            return { can: false, reason: `Die E-Mail-Adresse von ${pupil.firstname} ${pupil.lastname} ist noch nicht verifiziert` };
        }
        if (!needsScreening) {
            return { can: false, reason: `${pupil.firstname} ${pupil.lastname} wurde bereits gescreent` };
        }

        return { can: true, reason: '' };
    };

    const computedKnowsFrom = knowsFrom === 'Sonstiges' ? `${CUSTOM_KNOWS_FROM_PREFIX}${customKnowsFrom}` : knowsFrom;

    const handleOnKnowsFromChanges = (values: { value: string; customValue: string }) => {
        setKnowsFrom(values.value);
        setCustomKnowsFrom(values.customValue);
    };

    const handleOnCreateScreening = async () => {
        try {
            await mutationCreateScreening({ variables: { pupilId: pupil.id } });
            toast.success('Screening angelegt');
        } catch (error) {
            toast.error(`${t('error')} ${(error as ApolloError).message}`);
            return;
        }
        refresh();
    };

    const handleOnDeactivate = async () => {
        setShowConfirmDeactivate(false);
        try {
            await mutationDeactivateAccount({ variables: { pupilId: pupil.id } });
            toast.success(t('screening.account_deactivated'));
            await refresh();
        } catch (error) {
            toast.error(`${t('error')} ${(error as ApolloError).message}`);
        }
    };

    const handleOnSaveScreening = async (decision?: boolean) => {
        let resultComment = comment;

        if ([true, false].includes(decision as boolean)) {
            resultComment += resultComment ? '\n' : '';
            resultComment += `[${screener.firstname} ${screener.lastname}]: ${decision ? 'Annahme' : 'Ablehnung'} empfehlen\n`;
        }

        try {
            await mutationUpdateScreening({
                variables: {
                    id: screening!.id!,
                    screeningComment: resultComment,
                    status: PupilScreeningStatus.Dispute,
                    knowsFrom: computedKnowsFrom,
                },
            });
            setComment(resultComment);
            toast.success(t('screening.screening_saved'));
            await refresh();
        } catch (error) {
            toast.error(t('error'));
        }
    };

    const handleOnDecision = async (decision: PupilScreeningStatus) => {
        setShowConfirmApprove(false);
        setShowConfirmReject(false);
        try {
            await mutationUpdateScreening({
                variables: {
                    id: screening!.id!,
                    screeningComment: '',
                    status: decision,
                    knowsFrom: computedKnowsFrom,
                },
            });
            toast.success(t('screening.screening_saved'));
        } catch (error) {
            toast.error(t('error'));
        }
        refresh();
    };

    const handleOnMissedScreening = async () => {
        const resultComment = `${comment ? `\n${comment}` : ''}[${screener.firstname} ${screener.lastname}]: Screening verpasst\n`;
        setShowConfirmMissedScreening(false);
        try {
            await mutationMarkScreeningAsMissed({
                variables: {
                    pupilScreeningId: screening!.id,
                    comment: resultComment,
                },
            });
            setComment(resultComment);
            toast.success(t('screening.screening_saved'));
        } catch (error) {
            toast.error(t('error'));
        }
        refresh();
    };

    const { can: canCreateScreening, reason: canCreateScreeningReason } = getCanCreateScreening();

    if (!screening) {
        return (
            <div>
                {!needsScreening && <InfoCard icon="loki" title={t('screening.no_open_screening')} message={t('screening.no_open_screening_long')} />}
                <div className="flex gap-x-2">
                    <Button disabled={!canCreateScreening} reasonDisabled={canCreateScreeningReason} onClick={handleOnCreateScreening}>
                        Screening anlegen
                    </Button>
                    {needsScreening && pupil.active && !isDeactivating && !deactivateResult && (
                        <Button variant="ghost" onClick={() => setShowConfirmDeactivate(true)}>
                            {t('screening.deactivate')}
                        </Button>
                    )}
                </div>
                <ConfirmationModal
                    variant="destructive"
                    isOpen={showConfirmDeactivate}
                    onOpenChange={setShowConfirmDeactivate}
                    headline="Deaktivieren"
                    description={t('screening.confirm_deactivate', {
                        firstname: pupil.firstname,
                        lastname: pupil.lastname,
                    })}
                    confirmButtonText="Deaktivieren"
                    onConfirm={handleOnDeactivate}
                    isLoading={isDeactivating}
                />
            </div>
        );
    }

    const isLoading = isUpdatingScreening || isDeactivating || isMarkingScreeningAsMissed;

    return (
        <>
            {screening!.status! === Pupil_Screening_Status_Enum.Dispute && (
                <InfoCard
                    icon="loki"
                    title={t('screening.four_eyes')}
                    message={
                        t('screening.was_screened_but_no_decision') + '\n\n' + screening.screeners.map((it) => `${it.firstname} ${it.lastname}`).join(', ')
                    }
                />
            )}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-y-2">
                    <KnowsUsSelect
                        className="w-[450px]"
                        value={customKnowsFrom ? 'Sonstiges' : knowsFrom}
                        onChange={handleOnKnowsFromChanges}
                        customValue={customKnowsFrom.replace(CUSTOM_KNOWS_FROM_PREFIX, '')}
                        type="pupil"
                    />
                </div>
                <div className="flex flex-col gap-y-2">
                    <Label>
                        Gesprächsdokumentation für 4-Augen-Entscheidung - <span className="font-bold">(Wird nach Annahme/Ablehnung gelöscht)</span>
                    </Label>
                    <TextArea className="resize-none h-24 w-full" value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>
            </div>
            <div className="mt-8">
                <Typography variant="h5" className="mb-5">
                    Entscheidungen
                </Typography>
                <div className="flex flex-row flex-wrap gap-x-10 gap-y-6">
                    <Button
                        onClick={() => handleOnSaveScreening(true)}
                        isLoading={isLoading}
                        variant="outline"
                        leftIcon={<IconThumbUp className="text-green-600" />}
                        className="w-[200px]"
                    >
                        Annahme empfehlen
                    </Button>
                    <Button
                        onClick={() => handleOnSaveScreening(false)}
                        isLoading={isLoading}
                        variant="outline"
                        leftIcon={<IconThumbDown className="text-red-600" />}
                        className="w-[200px] hover:bg-destructive-lighter"
                    >
                        Ablehnung empfehlen
                    </Button>
                    <Button
                        onClick={() => setShowConfirmMissedScreening(true)}
                        isLoading={isLoading}
                        variant="outline"
                        leftIcon={<IconGhost />}
                        className="w-[200px]"
                    >
                        Screening verpasst
                    </Button>
                </div>
                <div className="flex flex-row flex-wrap gap-x-10 mt-10">
                    <Button onClick={() => setShowConfirmApprove(true)} variant="default" leftIcon={<IconThumbUp className="" />} className="w-[200px]">
                        Annehmen
                    </Button>
                    <Button
                        onClick={() => setShowConfirmReject(true)}
                        isLoading={isLoading}
                        variant="destructive"
                        leftIcon={<IconThumbDown />}
                        className="w-[200px]"
                    >
                        Ablehnen
                    </Button>
                    {pupil.active && (
                        <Button isLoading={isDeactivating} variant="ghost" onClick={() => setShowConfirmDeactivate(true)}>
                            {t('screening.deactivate')}
                        </Button>
                    )}
                </div>
            </div>
            <ConfirmationModal
                isOpen={showConfirmApprove}
                onOpenChange={setShowConfirmApprove}
                headline="Annhemen"
                description={t('screening.confirm_success', {
                    firstname: pupil.firstname,
                    lastname: pupil.lastname,
                })}
                confirmButtonText="Annehmen"
                onConfirm={() => handleOnDecision(PupilScreeningStatus.Success)}
                isLoading={isLoading}
            />
            <ConfirmationModal
                variant="destructive"
                isOpen={showConfirmReject}
                onOpenChange={setShowConfirmReject}
                headline="Ablehnen"
                description={t('screening.confirm_rejection', {
                    firstname: pupil.firstname,
                    lastname: pupil.lastname,
                })}
                confirmButtonText="Ablehnen"
                onConfirm={() => handleOnDecision(PupilScreeningStatus.Rejection)}
                isLoading={isLoading}
            />
            <ConfirmationModal
                isOpen={showConfirmMissedScreening}
                onOpenChange={setShowConfirmMissedScreening}
                headline="Screening verpasst"
                description={`Bitte bestätige, dass ${pupil.firstname} das Screening verpasst hat`}
                confirmButtonText="Screening verpasst"
                onConfirm={handleOnMissedScreening}
                isLoading={isLoading}
            />
            <ConfirmationModal
                variant="destructive"
                isOpen={showConfirmDeactivate}
                onOpenChange={setShowConfirmDeactivate}
                headline="Deaktivieren"
                description={t('screening.confirm_deactivate', {
                    firstname: pupil.firstname,
                    lastname: pupil.lastname,
                })}
                confirmButtonText="Deaktivieren"
                onConfirm={handleOnDeactivate}
                isLoading={isDeactivating}
            />
        </>
    );
};
