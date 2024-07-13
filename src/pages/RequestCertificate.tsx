import { useApolloClient } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Stack, useTheme, VStack } from 'native-base';
import { createContext, Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import { gql } from '../gql';
import { CertificateCreationInput, Match } from '../gql/graphql';
import useModal from '../hooks/useModal';
import { SuccessModal } from '../modals/SuccessModal';
import { Subcourse } from '../gql/graphql';
import InstructionProgress from '../widgets/InstructionProgress';
import RequestCertificateMatchingWizard from './certificates/RequestCertificateMatchingWizard';
import RequestCertificateOverview from './certificates/RequestCertificateOverview';
import SwitchLanguageButton from '../components/SwitchLanguageButton';

type Props = {};

type IRequestCertificateData = {
    subject?: string | boolean;
    actions: string[];
    otherActions: string[];
    pupilMatches: (Pick<Match, 'uuid' | 'subjectsFormatted' | 'createdAt'> & { pupil: { firstname?: string | null; lastname?: string | null } })[];
    requestData: { [matchUuid: string]: Pick<CertificateCreationInput, 'endDate' | 'hoursPerWeek' | 'hoursTotal' | 'ongoingLessons' | 'subjects'> };
    courses: Subcourse[];
};
type IRequestCertificateContext = {
    state: IRequestCertificateData;
    setState: Dispatch<SetStateAction<IRequestCertificateData>>;
    pupilIndex: number;
    setPupilIndex: Dispatch<SetStateAction<number>>;
    wizardIndex: number;
    setWizardIndex: Dispatch<SetStateAction<number>>;
};
export const RequestCertificateContext = createContext<IRequestCertificateContext>({
    state: {
        actions: [],
        otherActions: [],
        pupilMatches: [],
        requestData: {},
        courses: [],
    },
    setState: () => null,
    pupilIndex: 0,
    setPupilIndex: () => null,
    wizardIndex: 0,
    setWizardIndex: () => null,
});

const REQUEST_CERTIFICATE = gql(
    `mutation RequestCertificate($matchId: String! $certificateData: CertificateCreationInput!) {
        participationCertificateCreate(matchId: $matchId, certificateData: $certificateData)
    }`
);

const RequestCertificate: React.FC<Props> = () => {
    const { show, hide } = useModal();
    const { trackPageView } = useMatomo();
    const navigate = useNavigate();

    const { space } = useTheme();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [pupilIndex, setPupilIndex] = useState<number>(0);
    const [wizardIndex, setWizardIndex] = useState<number>(0);

    const [state, setState] = useState<IRequestCertificateData>({
        actions: [],
        otherActions: [],
        pupilMatches: [],
        requestData: {},
        courses: [],
    });

    const client = useApolloClient();

    const onFinish = useCallback(async () => {
        for (const match of state.pupilMatches) {
            const certificateData = state.requestData[match.uuid];

            const result = await client.mutate({
                mutation: REQUEST_CERTIFICATE,
                variables: {
                    matchId: match.uuid,
                    certificateData: {
                        ...certificateData,
                        activities: [...state.actions, ...state.otherActions].join('\n'),
                        medium: 'Video-Chat',
                        state: 'awaiting-approval',
                    },
                },
            });
        }

        navigate(-1);
        show(
            { variant: 'dark', closeable: true },
            <SuccessModal
                title="Geschafft"
                content="Wir haben deine Anfrage erhalten und leiten die Informationen an deine:n Schüler:in weiter, um uns eine Bestätigung durch den/die Erziehungsberechtigte:n einzuholen. Anschließend erhälst du eine automatisierte E-Mail von uns mit deiner Bescheinigung"
            />
        );
    }, [state, show]);

    const onNext = useCallback(() => {
        if (currentIndex + 1 < 2) setCurrentIndex((prev) => prev + 1);
        else onFinish();
    }, [currentIndex, onFinish]);

    const onBack = useCallback(() => {
        if (currentIndex <= 0) {
            navigate(-1);
            return;
        }
        setCurrentIndex((prev) => prev - 1);
    }, []);

    useEffect(() => {
        trackPageView({
            documentTitle: 'Zertifikate anfordern',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <RequestCertificateContext.Provider
            value={{
                state,
                setState,
                pupilIndex,
                setPupilIndex,
                wizardIndex,
                setWizardIndex,
            }}
        >
            <WithNavigation
                showBack
                previousFallbackRoute="/profile"
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </Stack>
                }
            >
                <VStack paddingX={space['1']} space={space['1']}>
                    <InstructionProgress
                        currentIndex={currentIndex}
                        instructions={[
                            { label: 'Beantragen', title: '' },
                            { label: 'Angaben', title: '' },
                            { label: 'Tätigkeit', title: '' },
                            { label: 'Modus', title: '' },
                        ]}
                    />
                    {currentIndex === 0 && <RequestCertificateOverview onNext={onNext} onBack={onBack} />}
                    {currentIndex === 1 && <RequestCertificateMatchingWizard onNext={onNext} />}
                </VStack>
            </WithNavigation>
        </RequestCertificateContext.Provider>
    );
};
export default RequestCertificate;
