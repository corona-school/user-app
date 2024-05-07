import UserProgress from './UserProgress';

export default {
    title: 'Molecules/UserProgress',
    component: UserProgress,
};

export const BaseUserProgress = {
    render: () => <UserProgress percent={20} showPercent />,
    name: 'UserProgress',
};
