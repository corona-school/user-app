import { Box } from 'native-base';
import { useContext } from 'react';
import PupilPager from '../../widgets/certificates/PupilPager';
import SelectActionsWidget from '../../widgets/certificates/SelectActionsWidget';
import SelectPupilsWidget from '../../widgets/certificates/SelectPupilsWidget';
import { RequestCertificateContext } from '../RequestCertificate';

type Props = {
    onNext: () => any;
};

const RequestCertificateMatchingWizard: React.FC<Props> = ({ onNext }) => {
    const { wizardIndex, setWizardIndex } = useContext(RequestCertificateContext);

    return (
        <Box>
            {wizardIndex === 0 && <SelectPupilsWidget onNext={() => setWizardIndex(1)} />}
            {wizardIndex === 1 && <PupilPager onFinished={() => setWizardIndex(2)} onBack={() => setWizardIndex(0)} />}
            {wizardIndex === 2 && <SelectActionsWidget onNext={onNext} />}
        </Box>
    );
};
export default RequestCertificateMatchingWizard;
