// @ts-nocheck
import { Box } from 'native-base';
import { Pupil_Schooltype_Enum } from '../gql/graphql';
import MatchTile from './MatchTile';

export default {
    title: 'Organisms/Match/MatchTile',
    component: MatchTile,
};

export const BaseMatchTile = {
    render: () => (
        <Box width={400}>
            <MatchTile
                matchId={1}
                schooltype={Pupil_Schooltype_Enum.Grundschule}
                grade="2. Klasse"
                pupil={{
                    firstname: 'Max',
                    lastname: 'Musterschüler',
                }}
                subjects={['Mathematik', 'Informatik']}
            />
        </Box>
    ),

    name: 'MatchTile',
};
