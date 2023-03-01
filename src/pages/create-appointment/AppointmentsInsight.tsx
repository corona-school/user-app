import { Box, Button, Stack, useBreakpointValue, Text, ScrollView } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import AppointmentList from '../../widgets/appointment/AppointmentList';
import { appointmentsData } from '../../widgets/appointment/dummy/testdata';

type Props = {
    id: number;
    isCourse: boolean;
    next: () => void;
    back: () => void;
};

const courseAppointmentsQuery = gql`
    query courseLectures($id: Int!) {
        subcourse(subcourseId: $id) {
            course {
                name
            }
            lectures {
                id
                start
                duration
            }
        }
    }
`;

const matchAppointmentsQuery = gql`
    query match($id: Int!) {
        match(matchId: $id) {
            id
            appointments {
                id
                title
                description
                start
                duration
            }
        }
    }
`;

const AppointmentsInsight: React.FC<Props> = ({ id, next, back, isCourse }) => {
    const { data, loading, error } = useQuery(isCourse ? courseAppointmentsQuery : matchAppointmentsQuery, { variables: { id } });
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    const maxHeight = useBreakpointValue({
        base: 400,
        lg: 600,
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: '25%',
    });

    // TODO add empty state from upcoming story
    return (
        <Box>
            {loading && <CenterLoadingSpinner />}
            {isCourse ? (
                <Box py={6}>
                    <Text>{t('appointment.create.insightCourseHeader', { courseTitle: data?.subcourse?.course?.name })}</Text>
                </Box>
            ) : (
                <Stack direction="row" py={6}>
                    <Text>
                        {/* // TODO add match partner name */}
                        {t('appointment.create.insightMatchHeader', { matchPartner: 'Leon Jackson' })}
                    </Text>
                </Stack>
            )}
            {!error && (
                <Box maxH={maxHeight} flex="1" mb="10">
                    {/* // TODO change to appointments from query */}
                    <AppointmentList isReadOnly={true} appointments={appointmentsData} />
                </Box>
            )}
            <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" space={3}>
                <Button onPress={next} width={buttonWidth}>
                    {t('appointment.create.addAppointmentButton')}
                </Button>
                <Button variant="outline" onPress={back} width={buttonWidth}>
                    {t('appointment.create.backButton')}
                </Button>
            </Stack>
        </Box>
    );
};

export default AppointmentsInsight;
