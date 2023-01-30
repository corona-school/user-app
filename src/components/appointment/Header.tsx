import { Divider, Heading, Text, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { AppointmentTypes, Attendee } from '../../types/lernfair/Appointment';

type HeaderProps = {
    appointmentType: string;
    organizers: Attendee[];
    title: string;
};
const Header: React.FC<HeaderProps> = ({ appointmentType, organizers, title }) => {
    const { t } = useTranslation();

    return (
        <>
            <VStack space={2}>
                <Text color="primary.600" fontWeight="normal">
                    {t(
                        appointmentType === AppointmentTypes.GROUP ? 'appointment.appointmentDetail.group' : 'appointment.appointmentDetail.oneToOne',

                        {
                            instructor: organizers?.map((o) => o.firstname + ' ' + o.lastname).join(', '),
                        }
                    )}
                </Text>
                <Heading fontSize="3xl" fontWeight="normal" color="primary.900">
                    {t('appointment.appointmentDetail.appointmentTitle', { appointmentTitle: title })}
                </Heading>
                {appointmentType === AppointmentTypes.GROUP && (
                    <Text color="primary.600" fontWeight="normal">
                        {t('appointment.appointmentDetail.courseTitle', { courseTitle: title })}
                    </Text>
                )}
            </VStack>
            <Divider thickness="0.25" my={5} />
        </>
    );
};

export default Header;
