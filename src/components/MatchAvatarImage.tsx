import { Box, Center, useBreakpointValue } from 'native-base';
import React from 'react';
import { useUserType } from '../hooks/useApollo';
import PupilAvatar from '../assets/icons/lernfair/avatar_pupil_120.svg';
import StudentAvatar from '../assets/icons/lernfair/avatar_student_120.svg';

type Props = {
    isDissolved?: boolean;
};
const MatchAvatarImage: React.FC<Props> = ({ isDissolved = false }) => {
    const userType = useUserType();

    return (
        <Box>
            <Center h="100%" w="100%">
                {userType === 'pupil' ? <StudentAvatar /> : <PupilAvatar />}
            </Center>
        </Box>
    );
};

export default MatchAvatarImage;
