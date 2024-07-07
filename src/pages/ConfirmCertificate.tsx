import { useQuery } from '@apollo/client';
import { gql } from '../gql';
import { CertificateConfirmationBox } from '../widgets/certificates/CertificateConfirmationBox';
import { useParams } from 'react-router-dom';
import WithNavigation from '../components/WithNavigation';
import { Box, Stack } from 'native-base';
import LangNavigation from '../components/LangNavigation';
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
                previousFallbackRoute="/start"
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <LangNavigation />
                        <NotificationAlert />
                    </Stack>
                }
            >
                {certificate && (
                    <Box overflow="auto">
                        <CertificateConfirmationBox certificate={certificate} />
                    </Box>
                )}
            </WithNavigation>
        </>
    );
};
export default ConfirmCertificate;
