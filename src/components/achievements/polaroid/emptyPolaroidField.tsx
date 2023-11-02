import { Box } from 'native-base';
import Polaroid from '../../../assets/icons/icon_polaroid.svg';

const EmptyPolaroidField: React.FC = () => {
    return (
        <Box top={'-25px'}>
            <Polaroid />
        </Box>
    );
};

export default EmptyPolaroidField;
