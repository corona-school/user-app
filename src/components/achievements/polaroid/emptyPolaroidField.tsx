import { Box } from 'native-base';
import Polaroid from '../../../assets/icons/icon_polaroid.svg';

type EmptyPolaroidFieldProps = {
    isMobile?: boolean;
};

const EmptyPolaroidField: React.FC<EmptyPolaroidFieldProps> = ({ isMobile }) => {
    return (
        <Box flex={isMobile ? '1' : 'none'} width={isMobile ? 'auto' : '136px'} height={isMobile ? '184px' : 'auto'} position="relative">
            <Polaroid />
        </Box>
    );
};

export default EmptyPolaroidField;
