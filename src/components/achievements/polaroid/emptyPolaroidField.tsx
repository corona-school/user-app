import { Box } from 'native-base';
import Polaroid from '../../../assets/icons/icon_polaroid.svg';
import { PolaroidImageSize } from '../types';

type EmptyPolaroidFieldProps = {
    size: PolaroidImageSize;
};

const EmptyPolaroidField: React.FC<EmptyPolaroidFieldProps> = ({ size }) => {
    return (
        <Box width={size} height={`calc(${size} * 1.35)`} position="relative">
            <Polaroid />
        </Box>
    );
};

export default EmptyPolaroidField;
