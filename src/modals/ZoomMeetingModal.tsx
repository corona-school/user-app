import { Trans, useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { useNavigate } from 'react-router-dom';
import CheckBadge from '../assets/icons/check-badge.svg';
import CameraIcon from '../assets/icons/camera-icon.svg';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';

interface ZoomMeetingModalProps extends BaseModalProps {
    appointmentId: number;
    appointmentType: Lecture_Appointmenttype_Enum;
    zoomUrl: string | undefined;
}

enum ZoomInfoIconEnum {
    CHECK = 'check',
    CAMERA = 'camera',
}

type ZoomInfo = { icon: ZoomInfoIconEnum; label: string };

export const ZoomInfoOptions = () => {
    const { t } = useTranslation();
    const zoomInfos: ZoomInfo[] = [
        {
            icon: ZoomInfoIconEnum.CHECK,
            label: 'useZoomApp',
        },
        { icon: ZoomInfoIconEnum.CAMERA, label: 'camera' },
    ];
    return (
        <div className="flex flex-col gap-y-2">
            {zoomInfos.map((info) => (
                <div className="flex items-center gap-x-1" key={info.label}>
                    <div className="flex flex-col">
                        <div className="pr-3 lg:pr-4">{info.icon === ZoomInfoIconEnum.CHECK ? <CheckBadge /> : <CameraIcon />}</div>
                    </div>
                    <div className="flex flex-col">
                        <Typography variant="h6">{t(`appointment.zoomModal.${info.label}.header` as any)}</Typography>
                        <Typography className="text-detail">
                            <Trans i18nKey={`appointment.zoomModal.${info.label}.description` as any} components={{ b: <b />, br: <br /> }} />
                        </Typography>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ZoomMeetingModal: React.FC<ZoomMeetingModalProps> = ({ isOpen, onOpenChange, appointmentId, appointmentType, zoomUrl }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{t('appointment.zoomModal.header')}</ModalTitle>
            </ModalHeader>
            <div>
                <ZoomInfoOptions />
            </div>
            <ModalFooter>
                <Button className="w-full" variant="outline" onClick={() => navigate(`/video-chat/${appointmentId}/${appointmentType}`)}>
                    {t('appointment.zoomModal.browser')}
                </Button>
                <Button className="w-full" disabled={!zoomUrl} onClick={() => window.open(zoomUrl, '_self')}>
                    {t('appointment.zoomModal.zoomClient')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ZoomMeetingModal;
