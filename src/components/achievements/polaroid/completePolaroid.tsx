import { Box } from 'native-base';
import Theme from '../../../Theme';

type CompletePolaroidProps = {
    image: string;
    alternativeText: string;
};

const CompletePolaroid: React.FC<CompletePolaroidProps> = ({ image, alternativeText }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '115px',
                height: '175px',
                borderRadius: '4px',
                paddingTop: '7.5px',
                boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
                backgroundColor: `${Theme.colors.white}`,
            }}
        >
            <Box width="100px" height="136px" borderRadius="2px">
                <img src={image} alt={alternativeText} />
            </Box>
        </div>
    );
};

export default CompletePolaroid;
