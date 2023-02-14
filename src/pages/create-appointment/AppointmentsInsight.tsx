import { Box, Button, Stack, useBreakpointValue } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import AppointmentList from '../../widgets/appointment/AppointmentList';
import { gql } from '../../gql';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';

type Props = {
    courseId?: number;
    next: () => void;
    back: () => void;
};

// TODO add query to get appointments for course
const query = gql(`
    query courseLectures($subcourseId: Int!) {
        subcourse(subcourseId: $subcourseId) {
            lectures {
                id
                title
                description
                start
                duration
                appointmentType
            }
        }
    }
`);

const AppointmentsInsight: React.FC<Props> = ({ next, back }) => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    // TODO get data
    // const {data, loading, error} = useQuery(query, {variables: {courseId}})

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
            {/* {loading && <CenterLoadingSpinner />} */}
            {/* {!error && data && ( */}
            <Box maxH={maxHeight} flex="1" mb="10">
                <AppointmentList isStatic={true} />
            </Box>
            {/* )} */}
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
