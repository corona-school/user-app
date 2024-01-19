import { useQuery } from '@apollo/client';
import { gql } from '../gql';
import { ConfirmCertificate as Component } from '../widgets/certificates/ConfirmCertificate';
import { useParams } from 'react-router-dom';
import WithNavigation from '../components/WithNavigation';
import { Stack } from 'native-base';
import HelpNavigation from '../components/HelpNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';

export const CERTIFICATE_QUERY = gql(`
query GetPupilCertificate {
  me {
    pupil {
      participationCertificatesToSign {
        id
         uuid
         ongoingLessons
         state
         categories
         startDate
         endDate
         hoursPerWeek
         hoursTotal
         medium
         student { firstname lastname }
      }
    }
}}
`);
const ConfirmCertificate: React.FC = () => {
    const { data } = useQuery(CERTIFICATE_QUERY);
    const { id } = useParams();
    const certificateId = Number(id);

    const me = data?.me?.pupil;

    const certificate = me?.participationCertificatesToSign.find((certificate) => certificate.id === certificateId);

    return (
        <>
            <WithNavigation
                showBack
                hideMenu
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
            >
                {certificate && <Component certificate={certificate} />}
            </WithNavigation>
        </>
    );
};
export default ConfirmCertificate;
