import { IconProps } from '@tabler/icons-react';

export type NavigationItems = {
    [key: string]: {
        icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
        label: string;
        disabled?: boolean;
    };
};
