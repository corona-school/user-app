import { Link, Text, useTheme, CheckIcon } from 'native-base';
import { ReactNode } from 'react';

type Props = {
    label: string;
    link: string;
    icon?: ReactNode | ReactNode[];
};

const Downloads: React.FC<Props> = ({ label, link, icon }) => {
    const { space } = useTheme();
    return (
        <Link href={link} paddingTop={space['1']} paddingBottom={space['0.5']} display="flex" alignItems="center">
            {icon ? icon : <CheckIcon size="5" />}
            <Text marginLeft={3} fontSize="md" bold>
                {label}
            </Text>
        </Link>
    );
};
export default Downloads;
