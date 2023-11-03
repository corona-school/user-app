import Theme from '../../../Theme';

type CompletePolaroidProps = {
    image: string;
    alternativeText: string;
    isMobile?: boolean;
};

const CompletePolaroid: React.FC<CompletePolaroidProps> = ({ image, alternativeText, isMobile }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
                backgroundColor: `${Theme.colors.white}`,
                width: `${isMobile ? '60px' : '136px'}`,
                height: `${isMobile ? '80px' : '184px'}`,
                borderRadius: `${isMobile ? '2px' : '4px'}`,
                paddingTop: `${isMobile ? '4px' : '7.5px'}`,
            }}
        >
            <div
                style={
                    isMobile
                        ? {
                              width: '52px',
                              height: '62px',
                              borderRadius: '1px',
                              objectFit: 'fill',
                              overflow: 'hidden',
                          }
                        : {
                              width: '120px',
                              height: '144px',
                              borderRadius: '2px',
                              overflow: 'hidden',
                          }
                }
            >
                <img width={'100%'} src={image} alt={alternativeText} />
            </div>
        </div>
    );
};

export default CompletePolaroid;
