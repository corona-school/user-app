import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Text, useTheme, VStack } from 'native-base';
import { createContext, Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WithNavigation from '../components/WithNavigation';
import useModal from '../hooks/useModal';
import { LFSubCourse } from '../types/lernfair/Course';
import { LFMatch } from '../types/lernfair/Match';
import InstructionProgress from '../widgets/InstructionProgress';
import RequestCertificateData from './certificates/RequestCertificateData';
import RequestCertificateOverview from './certificates/RequestCertificateOverview';

type Props = {};

type IRequestCertificateData = {
    subject?: string | boolean;
    actions: string[];
    otherActions: string[];
    pupilMatches: LFMatch[];
    requestData: {};
    courses: LFSubCourse[];
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

const RequestCertificate: React.FC<Props> = () => {
    const { setShow, setContent, setVariant } = useModal();
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

    const showSuccessModal = useCallback(() => {}, []);

    const onFinish = useCallback(() => {
        // TODO backend request

        showSuccessModal();
    }, [showSuccessModal]);

    const onNext = useCallback(() => {
        if (currentIndex + 1 < 2) setCurrentIndex((prev) => prev + 1);
        else onFinish();
    }, [currentIndex, onFinish]);

    const onBack = useCallback(() => {
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
            <WithNavigation showBack>
                <VStack paddingX={space['1']} space={space['1']}>
                    <InstructionProgress
                        currentIndex={currentIndex}
                        instructions={[
                            { label: 'Beantragen', title: '' },
                            { label: 'Angaben', title: '' },
                        ]}
                    />
                    {currentIndex === 0 && <RequestCertificateOverview onNext={onNext} onBack={onBack} />}
                    {currentIndex === 1 && <RequestCertificateData onNext={onNext} onBack={onBack} certificateType={"matching"} />}
                </VStack>
            </WithNavigation>
        </RequestCertificateContext.Provider>
    );
};
export default RequestCertificate;
