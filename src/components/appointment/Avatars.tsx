import { Avatar, HStack } from 'native-base';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student.svg';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil.svg';
import { Attendee } from '../../types/lernfair/User';

type AvatarsProps = {
    attendees: Attendee[];
};
const Avatars: React.FC<AvatarsProps> = ({ attendees }) => {
    return (
        <>
            <HStack py={5}>
                {attendees?.length !== 0 && (
                    <Avatar.Group _avatar={{ size: 'xs' }} space={-1} max={5}>
                        {attendees?.map((attendee, idx) =>
                            'isStudent' in attendee ? (
                                <Avatar key={attendee.lastname + '-' + idx}>
                                    <StudentAvatar style={{ marginTop: '-1' }} />
                                </Avatar>
                            ) : (
                                <Avatar key={attendee.firstname + '-' + idx}>
                                    <PupilAvatar style={{ marginTop: '-1' }} />
                                </Avatar>
                            )
                        )}
                    </Avatar.Group>
                )}
            </HStack>
        </>
    );
};

export default Avatars;
