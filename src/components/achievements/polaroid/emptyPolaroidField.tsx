import { Box } from 'native-base';
import Polaroid from '../../../assets/icons/icon_polaroid.svg';

type EmptyPolaroidFieldProps = {
    isMobile?: boolean;
};

const EmptyPolaroidField: React.FC<EmptyPolaroidFieldProps> = ({ isMobile }) => {
    return (
        <Box flex={isMobile ? '1' : 'none'} width={isMobile ? '60px' : '136px'} height={isMobile ? '80px' : '184px'} position="relative">
            <Polaroid />
        </Box>
    );
};

export default EmptyPolaroidField;
