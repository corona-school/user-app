import { HStack, VStack, Text, Avatar } from 'native-base';
import StudentIcon from '../../assets/icons/lernfair/avatar_student_32.svg';
import PupilIcon from '../../assets/icons/lernfair/avatar_pupil_32.svg';
import PupilCancel from '../../assets/icons/lernfair/avatar_pupil_cancel.svg';
import StudentCancel from '../../assets/icons/lernfair/avatar_student_cancel.svg';
import { useTranslation } from 'react-i18next';
import { LFUserType } from '../../types/lernfair/User';

type ParticipantProps = {
    name: string;
    userType: string;
    declined?: boolean;
};

const ParticipantBox: React.FC<ParticipantProps> = ({ name, userType, declined }) => {
    const { t } = useTranslation();

    const getUserIcon = (userType: LFUserType) => {
        if (userType === 'student') {
            if (declined) {
                return <StudentCancel />;
            } else {
                return <StudentIcon />;
            }
        } else if (userType === 'pupil') {
            if (declined) {
                return <PupilCancel />;
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
                        {userType === 'student' ? t('appointments.participantsModal.helper') : t('appointments.participantsModal.pupil')}
                    </Text>
                </VStack>
            </HStack>
        </>
    );
};

export default ParticipantBox;
