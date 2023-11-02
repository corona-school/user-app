import { Box } from 'native-base';
import CompletePolaroid from './completePolaroid';
import EmptyPolaroidField from './emptyPolaroidField';

type PolaroidImageContainerProps = {
    image: string | undefined;
    alternativeText: string;
};

const PolaroidImageContainer: React.FC<PolaroidImageContainerProps> = ({ image, alternativeText }) => {
    return <Box>{image ? <CompletePolaroid image={image} alternativeText={alternativeText} /> : <EmptyPolaroidField />}</Box>;
};

export default PolaroidImageContainer;
