import { Icon, IconProps } from '@tabler/icons-react';

export type NavigationItems = {
    [key: string]: {
        icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
        label: string;
        disabled?: boolean;
    };
};
