import { Divider, Text, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { AppointmentTypes } from '../../types/lernfair/Appointment';

type AvatarsProps = {
    appointmentType: string;
    courseName?: string;
    courseDescription?: string;
};
const Description: React.FC<AvatarsProps> = ({ appointmentType, courseName, courseDescription }) => {
    const { t } = useTranslation();

    return (
        <>
            <Divider thickness="0.25" my={5} />
            <VStack p={3}>
                <Text color="primary.900" mb="2">
                    {t(appointmentType === AppointmentTypes.GROUP ? 'appointment.detail.courseDescriptionHeader' : 'appointment.detail.desciptionHeader', {
                        courseTitle: courseName,
                    })}
                </Text>
                <Text color="primary.600" fontWeight="normal">
                    {appointmentType === AppointmentTypes.GROUP ? courseDescription : 'Hier kommt die appointment description.'}
                </Text>
            </VStack>
            <Divider thickness="0.25" my={5} />
        </>
    );
};

export default Description;
