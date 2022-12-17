import { Text, Row, Avatar, useTheme, Box } from 'native-base';

type Props = {};

const StudentMatch: React.FC<Props> = () => {
    const { space } = useTheme();

    return (
        <Row space={space['1']}>
            <Avatar />
            <Box>
                <Text bold fontSize="md">
                    Nele
                </Text>
                <Text>braucht Hilft in Englisch</Text>
                <Box marginTop={space['0.5']}>
                    <Text>Gymnasium</Text>
                    <Text>Klasse 6</Text>
                </Box>
            </Box>
        </Row>
    );
};
export default StudentMatch;
