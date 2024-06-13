export type NavigationItems = {
    [key: string]: {
        icon: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { isActive?: boolean }>;
        label: string;
        disabled?: boolean;
    };
};
