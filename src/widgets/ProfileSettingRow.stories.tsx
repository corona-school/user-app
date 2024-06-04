import { Heading } from 'native-base';
import ProfileSettingRow from './ProfileSettingRow';

export default {
    title: 'Organisms/Profile/ProfileSettingRow',
    component: ProfileSettingRow,
};

export const ProfileSettingsRow = {
    render: () => (
        <ProfileSettingRow title="My title">
            <Heading>My Heading</Heading>
        </ProfileSettingRow>
    ),

    name: 'ProfileSettingRow',
};
