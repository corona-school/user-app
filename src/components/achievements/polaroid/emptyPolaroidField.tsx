import Polaroid from '../../../assets/icons/icon_polaroid.svg';

type EmptyPolaroidFieldProps = {
    isMobile?: boolean;
};

const EmptyPolaroidField: React.FC<EmptyPolaroidFieldProps> = ({ isMobile }) => {
    return (
        <div
            style={
                isMobile
                    ? {
                          flex: '1',
                          width: '60px',
                          height: '80px',
                      }
                    : {
                          position: 'relative',
                          top: '-25px',
                          width: '136px',
                          height: '184px',
                      }
            }
        >
            <Polaroid />
        </div>
    );
};

export default EmptyPolaroidField;
