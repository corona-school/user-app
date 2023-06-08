import { Popover } from 'native-base';

const SettingsPopover: React.FC = () => {
    return (
        <Popover.Content>
            <Popover.Arrow />
            <Popover.Header>Einstellungen</Popover.Header>
        </Popover.Content>
    );
};

export default SettingsPopover;
