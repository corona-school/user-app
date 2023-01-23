import { Box, Heading, Text } from 'native-base';
import Tabs from '../../components/Tabs';
import SingleTile from '../../widgets/appointment/SingleTile';

const AppointmentAssignment = () => {
    return (
        <Box>
            <Box py={6}>
                <Text>Für welches Lernangebot soll dieser Termin erstellt werden?</Text>
            </Box>
            <Tabs
                tabs={[
                    {
                        title: 'Einzel',
                        content: (
                            <Box>
                                <SingleTile />
                            </Box>
                        ),
                    },
                    { title: 'Gruppe', content: <Heading>Group Tile</Heading> },
                ]}
            ></Tabs>
        </Box>
    );
};

export default AppointmentAssignment;
