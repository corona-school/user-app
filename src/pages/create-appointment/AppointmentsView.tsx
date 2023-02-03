import { gql, useQuery } from '@apollo/client';
import { Box, Button, Stack, useBreakpointValue, Text } from 'native-base';
import { useTranslation } from 'react-i18next';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import AppointmentList from '../../widgets/appointment/AppointmentList';

type Props = {
    courseId?: number;
    next: () => void;
    back: () => void;
};

// query myappointments {
//     me {
//       student {
//         subcoursesInstructing {
//             id
//             lectures {
//               id
//               title
//               description
//               start
//               duration
//               meetingLink
//               subcourseId
//               matchId
//               appointmentType
//               organizers {
//                 firstname
//                 lastname
//               }
//               appointment_participant_pupil {
//                 id
//                 firstname
//                 lastname
//                 isPupil
//                 declined
//               }
//               appointment_participant_student {
//                 id
//                 firstname
//                 lastname
//                 isStudent
//                 declined
//               }
//               appointment_participant_screener {
//                 id
//                 firstname
//                 lastname
//                 declined
//               }
//             }
//               course{
//             name
//           }
//         }
//       }
//     }
//   }

const query = gql`
    query lectures($courseId: Int!) {
        subcourse(subcourseId: $courseId) {
            id
            course {
                name
            }
            instructors {
                firstname
                lastname
            }
            participants {
                id
            }
            participantsCount
            lectures {
                id
                start
                duration
            }
        }
    }
`;

const AppointmentsView: React.FC<Props> = ({ courseId, next, back }) => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    // TODO query appointments in calendar dates format
    const { data, loading, error } = useQuery(query, {
        variables: { courseId },
    });

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
            {!error && data && (
                <Box maxH={maxHeight} flex="1" mb="10">
                    <AppointmentList isStatic={true} />
                </Box>
            )}
            <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" space={3}>
                <Button onPress={next} width={buttonWidth}>
                    {t('appointment.createAppointment.view.addAppointment')}
                </Button>
                <Button variant="outline" onPress={back} width={buttonWidth}>
                    {t('appointment.createAppointment.view.backButton')}
                </Button>
            </Stack>
        </Box>
    );
};

export default AppointmentsView;
