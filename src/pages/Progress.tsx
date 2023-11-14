import AchievementProgress from '../widgets/AchievementProgress';
import { achievements } from '../components/achievements/progress-page-test-data';
import WithNavigation from '../components/WithNavigation';
import AsNavigationItem from '../components/AsNavigationItem';
import { Box } from 'native-base';

const Progress = () => {
    return (
        <AsNavigationItem
            path="/progress"
            children={
                <WithNavigation showBack headerTitle="Progress">
                    <Box mx="4">
                        <AchievementProgress achievements={achievements} />
                    </Box>
                </WithNavigation>
            }
        />
    );
};

export default Progress;
