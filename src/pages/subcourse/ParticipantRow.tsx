import { Heading, useTheme, Text, Button, HStack, VStack, Spacer } from 'native-base';
import { getSchoolTypeKey } from '../../types/lernfair/SchoolType';
import NewChatIcon from '../../assets/icons/lernfair/ic_new_chat.svg';
import RemovePupilIcon from '../../assets/icons/lernfair/cancel.svg';
import { pupilIdToUserId } from '../../helper/chat-helper';
import { SubcourseParticipant } from '../../types/lernfair/Course';

type RowProps = {
    participant: SubcourseParticipant;
    isInstructor?: boolean;
    contactParticipant?: (participantId: string) => void;
    removeParticipant?: (participant: SubcourseParticipant) => void;
};
const ParticipantRow: React.FC<RowProps> = ({ participant, isInstructor, contactParticipant, removeParticipant }) => {
    const { space } = useTheme();

    return (
        <HStack marginBottom={space['1.5']} alignItems="center" maxW="350">
            <VStack marginRight={space['1']}></VStack>
            <VStack>
                <Heading fontSize="md">
                    {participant.firstname} {participant.lastname ?? ''}
                </Heading>
                <Text>
                    {participant.schooltype && `${getSchoolTypeKey(participant.schooltype)}, `}
                    {participant.grade}
                </Text>
            </VStack>
            <Spacer />
            {isInstructor && contactParticipant && (
                <Button variant="outlinelight" ml={space['3']} onPress={() => contactParticipant(pupilIdToUserId(participant.id))}>
                    <NewChatIcon />
                </Button>
            )}
            <Spacer />
            {isInstructor && removeParticipant && (
                <Button variant="outline" ml={space['3']} onPress={() => removeParticipant(participant)}>
                    <RemovePupilIcon />
                </Button>
            )}
        </HStack>
    );
};

export default ParticipantRow;
