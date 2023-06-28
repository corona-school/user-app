import { HStack, VStack, Text, Avatar } from 'native-base';
import StudentIcon from '../../assets/icons/lernfair/avatar_student_32.svg';
import PupilIcon from '../../assets/icons/lernfair/avatar_pupil_32.svg';
import PupilAvatarCanceled from '../../assets/icons/lernfair/avatar_pupil_cancel.svg';
import StudentAvatarCancelled from '../../assets/icons/lernfair/avatar_student_cancel.svg';
import { useTranslation } from 'react-i18next';
import { AttendanceStatus } from '../../types/lernfair/Appointment';

type BoxProps = {
    name: string;
    isOrganizer?: boolean;
    declined?: AttendanceStatus;
};

const AttendeeBox: React.FC<BoxProps> = ({ name, isOrganizer, declined }) => {
    const { t } = useTranslation();

    const getUserIcon = () => {
        if (isOrganizer) {
            return declined === AttendanceStatus.DECLINED ? <StudentAvatarCancelled /> : <StudentIcon />;
        }
        return declined === AttendanceStatus.DECLINED ? <PupilAvatarCanceled /> : <PupilIcon />;
    };

    return (
        <>
            <HStack alignItems="center" space={2} py="2">
                <VStack>
                    <Avatar size="sm">{getUserIcon()}</Avatar>
                </VStack>
                <VStack>
                    <Text fontSize="sm" color="white">
                        {name}
                    </Text>
                    <Text fontSize="xs" fontWeight="light" ellipsizeMode="tail" numberOfLines={1} color="white">
                        {isOrganizer ? t('appointment.attendeesModal.helper') : t('appointment.attendeesModal.pupil')}
                    </Text>
                </VStack>
            </HStack>
        </>
    );
};

export default AttendeeBox;
