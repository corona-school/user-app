import { useTheme, Box, Heading, Row, Text, Button } from 'native-base';
import LFParty from '../assets/icons/lernfair/lf-party.svg';
import { useTranslation } from 'react-i18next';
import useModal from '../hooks/useModal';

// Usage:
// const { show } = useModal();
// show({ variant: 'dark', closeable: true }, <SuccessModal title=... content=... />)

export function SuccessModal({ title, content, onClose }: { title: string; content: string; onClose?: () => void }) {
    const { space } = useTheme();
    const { hide } = useModal();
    const { t } = useTranslation();

    return (
        <>
            <Box alignItems="center" marginY={space['1']}>
                <LFParty />
            </Box>
            <Box paddingY={space['1']}>
                <Heading maxWidth="330px" marginX="auto" textAlign="center" color="lightText" marginBottom={space['0.5']}>
                    {title}
                </Heading>
                <Text textAlign="center" color="lightText" maxWidth="330px" marginX="auto">
                    {content}
                </Text>
            </Box>
            <Box padding={space['1']} width="100%">
                <Row marginBottom={space['0.5']} display="flex" flexDirection="row">
                    <Button
                        onPress={() => {
                            if (onClose) onClose();
                            else hide();
                        }}
                        width="100%"
                        maxWidth="400px"
                        alignSelf="center"
                        marginX="auto"
                    >
                        {t('done')}
                    </Button>
                </Row>
            </Box>
        </>
    );
}
