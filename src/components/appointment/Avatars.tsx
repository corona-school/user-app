import { Avatar, HStack } from 'native-base';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student.svg';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil.svg';
import { Attendee } from '../../types/lernfair/Appointment';

type AvatarsProps = {
    organizers?: Attendee[];
    participants?: Attendee[];
};
const Avatars: React.FC<AvatarsProps> = ({ organizers, participants }) => {
    return (
        <>
            <HStack py={5}>
                <Avatar.Group _avatar={{ size: 'md' }} space={-2} max={5}>
                    {organizers
                        ?.map((i) => <Avatar>{<StudentAvatar style={{ margin: '-1' }} />}</Avatar>)
                        .concat(participants?.map((i) => <Avatar>{<PupilAvatar style={{ margin: '-20' }} />}</Avatar>) ?? [])}
                </Avatar.Group>
            </HStack>
        </>
    );
};

export default Avatars;
