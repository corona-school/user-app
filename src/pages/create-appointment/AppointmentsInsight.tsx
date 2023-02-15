import { Box, Button, Stack, useBreakpointValue, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import AppointmentList from '../../widgets/appointment/AppointmentList';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
// import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';

type Props = {
    id: number;
    isCourse: boolean;
    next: () => void;
    back: () => void;
};

const courseQuery = gql`
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

// TODO add query to get appointments for a match by id

const AppointmentsInsight: React.FC<Props> = ({ id, next, back, isCourse }) => {
    const { data, loading, error } = useQuery(courseQuery, { variables: { id } });
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
                    <Text>
                        {t('appointment.create.insightCourseHeader')}
                        <Text fontWeight="bold">{data?.subcourse?.course?.name ? data?.subcourse?.course?.name : 'Kursname'}.</Text>
                    </Text>
                </Box>
            ) : (
                <Stack direction="row" py={6}>
                    <Text>
                        {/* // TODO add match partner name */}
                        {t('appointment.create.insightMatchHeader')} <Text fontWeight="bold">Leon Jackson.</Text>
                    </Text>
                </Stack>
            )}
            {/* {!error && data && ( */}
            <Box maxH={maxHeight} flex="1" mb="10">
                <AppointmentList isReadOnly={true} />
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
