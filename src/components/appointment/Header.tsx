import { Divider, Heading, Text, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { AppointmentType } from '../../gql/graphql';
import { Organizer } from '../../types/lernfair/User';

type HeaderProps = {
    appointmentType?: AppointmentType;
    organizers?: Organizer[];
    title: string;
};
const Header: React.FC<HeaderProps> = ({ appointmentType, organizers, title }) => {
    const { t } = useTranslation();

    return (
        <>
            <VStack space={2}>
                <Text color="primary.600" fontWeight="normal">
                    {t(appointmentType === AppointmentType.Group ? 'appointment.detail.group' : 'appointment.detail.oneToOne', {
                        instructor: organizers?.map((o) => o.firstname + ' ' + o.lastname).join(', '),
                    })}
                </Text>
                <Heading fontSize="3xl" fontWeight="normal" color="primary.900">
                    {t('appointment.detail.appointmentTitle', { appointmentTitle: title })}
                </Heading>
                {appointmentType === AppointmentType.Group && (
                    <Text color="primary.600" fontWeight="normal">
                        {t('appointment.detail.courseTitle', { courseTitle: title })}
                    </Text>
                )}
            </VStack>
            <Divider thickness="0.25" my={5} />
        </>
    );
};

export default Header;
