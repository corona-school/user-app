import { Heading, useTheme, Text, Button, HStack, VStack, Spacer } from 'native-base';
import { Participant } from '../../gql/graphql';
import { getSchoolTypeKey } from '../../types/lernfair/SchoolType';
import NewChatIcon from '../../assets/icons/lernfair/ic_new_chat.svg';

type RowProps = {
    participant: Pick<Participant, 'id' | 'firstname' | 'grade'> & Partial<Pick<Participant, 'lastname' | 'schooltype'>>;
    isInstructor?: boolean;
    contactParticipant?: (participantId: string) => void;
};
const ParticipantRow: React.FC<RowProps> = ({ participant, isInstructor, contactParticipant }) => {
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
                <Button variant="outlinelight" ml={space['3']} onPress={() => contactParticipant(`pupil/${participant.id}`)}>
                    <NewChatIcon />
                </Button>
            )}
        </HStack>
    );
};

export default ParticipantRow;
