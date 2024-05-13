// @ts-nocheck
import StreakImage from './StreakImage';
import StreakImageContainer from './StreakImageContainer';
import { StreakImageSize } from '../../../types/achievement';
import ExampleStreakUnfinished from '../../../assets/images/achievements/example_streak_image.png';
import ExampleStreakFinished from '../../../assets/images/achievements/example_streak_image_record.png';

export default {
    title: 'Organisms/Achievements/Streak/StreakImage',
    component: StreakImage,
};

export const Base = {
    render: () => <StreakImage streak={27} image={ExampleStreakUnfinished} alternativeText="27 day streak" size={StreakImageSize.LARGE} />,

    name: 'Streak Image',
    width: '150px',
};

export const StreakRecordMobileImage = {
    render: () => <StreakImageContainer streak={27} image={ExampleStreakFinished} alternativeText="27 day streak" isRecord size={StreakImageSize.SMALL} />,

    name: 'Streak Record Mobile Image',
    width: '150px',
};

export const StreakRecordImage = {
    render: () => (
        <StreakImageContainer streak={27} image={ExampleStreakFinished} alternativeText="27 day streak" isRecord isLarge size={StreakImageSize.LARGE} />
    ),

    name: 'Streak Record Image',
    width: '150px',
};
