import { gql } from '@apollo/client';
import { Box, Button, Stack } from 'native-base';
import React from 'react';
import List from './List';

type Props = {
    next: () => void;
    back: () => void;
};

const AppointmentsView: React.FC<Props> = ({ next, back }) => {
    return (
        <Box>
            <Box maxH="400" flex="1" mb="10">
                <List />
            </Box>
            <Stack space="3">
                <Button onPress={next}>Termin hinzufügen</Button>
                <Button variant="outline" onPress={back}>
                    zur vorherigen Seite
                </Button>
            </Stack>
        </Box>
    );
};

export default AppointmentsView;
