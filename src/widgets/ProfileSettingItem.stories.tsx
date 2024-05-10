import { Heading } from 'native-base';
import ProfileSettingItem from './ProfileSettingItem';

export default {
    title: 'Organisms/Profile/ProfileSettingItem',
    component: ProfileSettingItem,
};

export const BaseProfileSettingItem = {
    render: () => (
        <ProfileSettingItem>
            <Heading>My Heading</Heading>
        </ProfileSettingItem>
    ),

    name: 'ProfileSettingItem',
};
