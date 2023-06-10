import { Button, HamburgerIcon, Popover } from 'native-base';
import SettingsPopover from './SettingsPopover';

type Props = {};

const SettingsButton: React.FC<Props> = () => {
    return (
        <Popover
            trigger={(triggerProps) => {
                return (
                    <Button {...triggerProps} variant={'ghost'}>
                        <HamburgerIcon size="xl" color="lightText" />
                    </Button>
                );
            }}
        >
            <SettingsPopover />
        </Popover>
    );
};
export default SettingsButton;
