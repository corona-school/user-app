import { Flex } from 'native-base';
import { useCallback, useContext } from 'react';
import { RequestCertificateContext } from '../../pages/RequestCertificate';
import { LFMatch } from '../../types/lernfair/Match';
import SelectedPupilWizard from './SelectedPupilWizard';

type Props = {
    onFinished: () => any;
    onBack: () => any;
};

const PupilPager: React.FC<Props> = ({ onFinished, onBack }) => {
    const { state, pupilIndex, setPupilIndex } = useContext(RequestCertificateContext);

    const next = useCallback(() => {
        if (pupilIndex + 1 < state?.pupilMatches.length) {
            setPupilIndex((prev) => prev + 1);
        } else {
            onFinished();
        }
        window.scrollTo({ top: 0 });
    }, [pupilIndex, state?.pupilMatches.length, setPupilIndex, onFinished]);

    const prev = useCallback(() => {
        if (pupilIndex - 1 >= 0) {
            setPupilIndex((prev) => prev - 1);
            window.scrollTo({ top: 0 });
        } else {
            onBack();
        }
    }, [pupilIndex, setPupilIndex, onBack]);

    return (
        <Flex>
            {state?.pupilMatches && state.pupilMatches.length > 0 && state.pupilMatches[pupilIndex] && (
                <SelectedPupilWizard
                    key={pupilIndex}
                    match={state.pupilMatches[pupilIndex]}
                    onNext={next}
                    onPrev={prev}
                    pupilCount={state?.pupilMatches.length}
                    currentIndex={pupilIndex}
                />
            )}
        </Flex>
    );
};
export default PupilPager;
