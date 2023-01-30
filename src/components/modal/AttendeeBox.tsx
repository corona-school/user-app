import { HStack, VStack, Text, Avatar } from 'native-base';
import StudentIcon from '../../assets/icons/lernfair/avatar_student_32.svg';
import PupilIcon from '../../assets/icons/lernfair/avatar_pupil_32.svg';
import PupilAvatarCanceled from '../../assets/icons/lernfair/avatar_pupil_cancel.svg';
import StudentAvatarCancelled from '../../assets/icons/lernfair/avatar_student_cancel.svg';
import { useTranslation } from 'react-i18next';
import { LFUserType } from '../../types/lernfair/User';

type BoxProps = {
    name: string;
    userType: LFUserType;
    declined?: boolean;
};

const AttendeeBox: React.FC<BoxProps> = ({ name, userType, declined }) => {
    const { t } = useTranslation();

    const getUserIcon = (userType: LFUserType) => {
        if (userType === 'student') {
            if (declined) {
                return <StudentAvatarCancelled />;
            } else {
                return <StudentIcon />;
            }
        } else if (userType === 'pupil') {
            if (declined) {
                return <PupilAvatarCanceled />;
            } else {
                return <PupilIcon />;
            }
        }
    };

    return (
        <>
            <HStack alignItems="center" space={2} py="2">
                <VStack>
                    <Avatar size="sm">{getUserIcon(userType)}</Avatar>
                </VStack>
                <VStack>
                    <Text fontSize="sm" color="white">
                        {name}
                    </Text>
                    <Text fontSize="xs" fontWeight="light" ellipsizeMode="tail" numberOfLines={1} color="white">
                        {userType === 'student' ? t('appointments.attendeesModal.helper') : t('appointments.attendeesModal.pupil')}
                    </Text>
                </VStack>
            </HStack>
        </>
    );
};

export default AttendeeBox;
