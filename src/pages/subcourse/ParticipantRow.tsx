import { Column, Heading, Row, useTheme, Text } from 'native-base';
import { Participant } from '../../gql/graphql';
import { getSchoolTypeKey } from '../../types/lernfair/SchoolType';

type RowProps = {
    participant: Pick<Participant, 'firstname' | 'lastname' | 'schooltype' | 'grade'>;
};
const ParticipantRow: React.FC<RowProps> = ({ participant }) => {
    const { space } = useTheme();

    return (
        <Row marginBottom={space['1.5']} alignItems="center">
            <Column marginRight={space['1']}></Column>
            <Column>
                <Heading fontSize="md">
                    {participant.firstname} {participant.lastname}
                </Heading>
                <Text>
                    {participant.schooltype && `${getSchoolTypeKey(participant.schooltype)}, `}
                    {participant.grade}
                </Text>
            </Column>
        </Row>
    );
};

export default ParticipantRow;
