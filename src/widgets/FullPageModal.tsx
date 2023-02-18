import { Box, Button, CloseIcon, Heading, useTheme } from 'native-base';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import CSSWrapper from '../components/CSSWrapper';
import { LFModalContext } from '../hooks/useModal';
import '../web/scss/widgets/FullPageModal.scss';

const FullPageModal = () => {
    const { variant, visible, content, closeable, hide, headline } = useContext(LFModalContext);
    const { space } = useTheme();

    const bgColor = useMemo(() => {
        switch (variant) {
            case 'dark':
                return 'primary.900';
            case 'image':
                return 'pink.500'; // TODO
            case 'light':
            default:
                return 'lightText';
        }
    }, [variant]);

    return (
        <CSSWrapper className={`fullpagemodal ${visible ? 'show' : ''}`}>
            <Box bgColor={bgColor} w="100%" h="100%" testID="fullpagemodal">
                {(closeable || headline) && (
                    <Box padding={space['1']} marginBottom={space['1']} display="flex" flexDirection="row" width="100%">
                        {headline && (
                            <Box flexDirection="column" paddingTop="5px" flexGrow="1">
                                <Heading textAlign="center">{headline}</Heading>
                            </Box>
                        )}
                        {closeable && (
                            <Button onPress={hide}>
                                <CloseIcon color="primary.800" />
                            </Button>
                        )}
                    </Box>
                )}
                <Box h="100%">{content}</Box>
            </Box>
        </CSSWrapper>
    );
};

export default FullPageModal;
