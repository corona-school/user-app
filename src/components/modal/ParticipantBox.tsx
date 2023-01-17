import { HStack, VStack, Text, Avatar } from 'native-base';
import StudentIcon from '../../assets/icons/lernfair/avatar_student_32.svg';
import PupilIcon from '../../assets/icons/lernfair/avatar_pupil_32.svg';
import PupilCancel from '../../assets/icons/lernfair/avatar_pupil_cancel.svg';
import StudentCancel from '../../assets/icons/lernfair/avatar_student_cancel.svg';

type ParticipantProps = {
    name: string;
    userType: string;
    declined?: boolean;
};

const ParticipantBox: React.FC<ParticipantProps> = ({ name, userType, declined }) => {
    return (
        <>
            <HStack alignItems="center" space={1} py="2">
                <VStack>
                    <Avatar size="sm">
                        {userType === 'student' && !declined ? (
                            <StudentIcon />
                        ) : userType === 'pupil' && !declined ? (
                            <PupilIcon />
                        ) : userType === 'student' && declined ? (
                            <StudentCancel />
                        ) : (
                            <PupilCancel />
                        )}
                    </Avatar>
                </VStack>
                <VStack>
                    <Text fontSize="sm" color="white">
                        {name}
                    </Text>
                    <Text fontSize="xs" fontWeight="light" ellipsizeMode="tail" numberOfLines={1} color="white">
                        {userType === 'student' ? 'Helfer:in' : 'Schüler:in'}
                    </Text>
                </VStack>
            </HStack>
        </>
    );
};

export default ParticipantBox;
