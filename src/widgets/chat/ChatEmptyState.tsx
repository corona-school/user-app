import { Box, Heading, Text } from 'native-base';

type EmptyStateProps = {
    icon: JSX.Element;
    title: string;
    subtitle: string;
};

const ChatEmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => {
    return (
        <Box alignItems="center" justifyContent="center">
            {icon}
            <Heading>{title}</Heading>
            <Text maxW="300" textAlign="center" py="3">
                {subtitle}
            </Text>
        </Box>
    );
};

export default ChatEmptyState;
