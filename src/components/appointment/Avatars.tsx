import { Avatar, HStack } from 'native-base';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student.svg';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil.svg';
import { Student } from '../../gql/graphql';
import { Participant } from '../../types/lernfair/User';

type AvatarsProps = {
    organizers: Student[];
    participants: Participant[];
};
const Avatars: React.FC<AvatarsProps> = ({ organizers, participants }) => {
    return (
        <>
            <HStack py={5}>
                {organizers?.length !== 0 && participants?.length !== 0 && (
                    <Avatar.Group _avatar={{ size: 'xs' }} space={-1} max={5}>
                        {organizers
                            ?.map(
                                (i, idx) =>
                                    (
                                        <Avatar key={i.lastname + '-' + idx}>
                                            <StudentAvatar style={{ marginTop: '-1' }} />
                                        </Avatar>
                                    ) ?? []
                            )
                            .concat(
                                participants?.map((p, index) => (
                                    <Avatar key={p.firstname + '-' + index}>
                                        <PupilAvatar style={{ marginTop: '-1' }} />
                                    </Avatar>
                                )) ?? []
                            )}
                    </Avatar.Group>
                )}
            </HStack>
        </>
    );
};

export default Avatars;
