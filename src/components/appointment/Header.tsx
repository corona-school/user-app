import { Divider, Heading, Text, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum, Organizer } from '../../gql/graphql';

type HeaderProps = {
    appointmentType?: Lecture_Appointmenttype_Enum;
    organizers?: Organizer[];
    appointmentTitle: string;
    courseName: string;
};
const Header: React.FC<HeaderProps> = ({ appointmentType, organizers, appointmentTitle, courseName }) => {
    const { t } = useTranslation();

    return (
        <>
            <VStack space={2}>
                <Text color="primary.600" fontWeight="normal">
                    {t(appointmentType === Lecture_Appointmenttype_Enum.Group ? 'appointment.detail.group' : 'appointment.detail.oneToOne', {
                        instructor: organizers?.map((o) => o.firstname + ' ' + o.lastname).join(', '),
                    })}
                </Text>
                <Heading fontSize="3xl" fontWeight="normal" color="primary.900">
                    {t('appointment.detail.appointmentTitle', { appointmentTitle: appointmentTitle })}
                </Heading>
                {appointmentType === Lecture_Appointmenttype_Enum.Group && (
                    <Text color="primary.600" fontWeight="normal">
                        {t('appointment.detail.courseName', { courseName: courseName })}
                    </Text>
                )}
            </VStack>
            <Divider thickness="0.25" my={5} />
        </>
    );
};

export default Header;
