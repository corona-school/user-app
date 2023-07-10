import { Text, Box, Heading } from 'native-base';
import EmptyStateIcon from '../../assets/icons/lernfair/empty-state-contacts.svg';

type Props = {
    title: string;
    subtitle: string;
};

const ContactEmptyState: React.FC<Props> = ({ title, subtitle }) => {
    return (
        <Box alignItems="center" justifyContent="center" h="400">
            <EmptyStateIcon />
            <Heading>{title}</Heading>
            <Text maxW="250" textAlign="center" py="3">
                {subtitle}
            </Text>
        </Box>
    );
};
export default ContactEmptyState;
