import { HStack, VStack, Text, Avatar, CloseIcon } from 'native-base';
import StudentIcon from '../../assets/icons/lernfair/avatar_helfer_innen_32.svg';
import PupilIcon from '../../assets/icons/lernfair/avatar_schüler_innen_32.svg';

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
                        {userType === 'student' ? <StudentIcon /> : <PupilIcon />}
                        {declined && <Avatar.Badge size="8" bg="red.500" borderWidth="0.5"></Avatar.Badge>}
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
