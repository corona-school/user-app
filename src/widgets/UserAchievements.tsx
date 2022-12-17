import { View, Heading, Box } from 'native-base';
import { ReactNode } from 'react';

type Props = {
    points: number;
    icon?: ReactNode;
};

const UserAchievements: React.FC<Props> = ({ points, icon }) => {
    return (
        <View>
            <Box>
                {icon && (
                    <Box borderRadius="50%" background="white" width="40px" height="40px" mb={3}>
                        <Box flexDirection="row" alignItems="center" justifyContent="center" height="100%">
                            {icon}
                        </Box>
                    </Box>
                )}
                <Heading fontSize="lg" color="white">
                    {points}
                </Heading>
            </Box>
        </View>
    );
};
export default UserAchievements;
