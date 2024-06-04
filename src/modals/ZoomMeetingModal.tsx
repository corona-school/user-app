import { Button, Modal, Stack, useTheme, Heading, VStack, HStack, Box, Text, useBreakpointValue } from 'native-base';
import { Trans, useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { useNavigate } from 'react-router-dom';
import CheckBadge from '../assets/icons/check-badge.svg';
import CameraIcon from '../assets/icons/camera-icon.svg';
import { useLayoutHelper } from '../hooks/useLayoutHelper';

type ZoomMeetingModalProps = {
    appointmentId: number;
    appointmentType: Lecture_Appointmenttype_Enum;
    zoomUrl: string | undefined;
};

enum ZoomInfoIconEnum {
    CHECK = 'check',
    CAMERA = 'camera',
}

type ZoomInfo = { icon: ZoomInfoIconEnum; label: string };

export const ZoomInfoOptions = () => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const iconPadding = useBreakpointValue({
        base: '3',
        lg: '5',
    });

    const zoomInfos: ZoomInfo[] = [
        {
            icon: ZoomInfoIconEnum.CHECK,
            label: 'useZoomApp',
        },
        { icon: ZoomInfoIconEnum.CAMERA, label: 'camera' },
    ];
    return (
        <Stack space={5}>
            {zoomInfos.map((info) => (
                <HStack alignItems="center" space={1}>
                    <VStack>
                        <Box px={iconPadding}>{info.icon === ZoomInfoIconEnum.CHECK ? <CheckBadge /> : <CameraIcon />}</Box>
                    </VStack>
                    <VStack maxW={isMobile ? 250 : 'full'}>
                        <Text bold fontSize="lg" ellipsizeMode="tail" numberOfLines={10}>
                            {t(`appointment.zoomModal.${info.label}.header` as any)}
                        </Text>
                        <Text fontSize="sm" ellipsizeMode="tail" numberOfLines={10}>
                            <Trans i18nKey={`appointment.zoomModal.${info.label}.description` as any} components={{ b: <b />, br: <br /> }} />
                        </Text>
                    </VStack>
                </HStack>
            ))}
        </Stack>
    );
};

const ZoomMeetingModal: React.FC<ZoomMeetingModalProps> = ({ appointmentId, appointmentType, zoomUrl }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isMobile } = useLayoutHelper();
    const modalWidth = useBreakpointValue({
        base: '350px',
        lg: '580px',
    });

    return (
        <>
            <Modal.Content minW={modalWidth}>
                <Modal.CloseButton />
                <Modal.Body>
                    <VStack marginBottom={space['2']} alignItems="left" p={space['1']}>
                        <Heading fontSize="2xl">{t('appointment.zoomModal.header')}</Heading>
                    </VStack>
                    <Box mb={10}>
                        <ZoomInfoOptions />
                    </Box>
                    <Stack space={isMobile ? space['0.5'] : space['1']} direction={isMobile ? 'column' : 'row'} width="full" justifyContent="center">
                        <Button minW="260px" variant="outline" onPress={() => navigate(`/video-chat/${appointmentId}/${appointmentType}`)}>
                            {t('appointment.zoomModal.browser')}
                        </Button>
                        <Button minW="260px" isDisabled={!zoomUrl} onPress={() => window.open(zoomUrl, '_self')}>
                            {t('appointment.zoomModal.zoomClient')}
                        </Button>
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default ZoomMeetingModal;
