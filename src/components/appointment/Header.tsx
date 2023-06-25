import { Divider, Heading, Text, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum, Organizer } from '../../gql/graphql';
import { Appointment } from '../../types/lernfair/Appointment';

type HeaderProps = {
    organizers?: Organizer[];
    appointmentTitle: string;
    displayName: Appointment['displayName'];
    position: Appointment['position'];
};
const Header: React.FC<HeaderProps> = ({ appointmentTitle, displayName, position }) => {
    const { t } = useTranslation();

    return (
        <>
            <VStack space={2}>
                <Text color="primary.600" fontWeight="normal">
                    {t('appointment.appointmentTile.lecture', { position: position }) +
                        (appointmentTitle ? t('appointment.appointmentTile.title', { appointmentTitle: appointmentTitle }) : '')}
                </Text>
                <Heading fontSize="3xl" fontWeight="normal" color="primary.900">
                    {t('appointment.detail.appointmentTitle', { appointmentTitle: displayName })}
                </Heading>
            </VStack>
            <Divider thickness="0.25" my={5} />
        </>
    );
};

export default Header;
