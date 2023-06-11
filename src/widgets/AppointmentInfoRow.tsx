import { DateTime } from 'luxon';
import { Text, VStack, Heading, Row, useTheme, Link } from 'native-base';
import { useTranslation } from 'react-i18next';
import { LFLecture } from '../types/lernfair/Course';

type Props = {
    lecture: LFLecture;
    index: number;
    onPressDelete?: () => any;
};

const AppointmentInfoRow: React.FC<Props> = ({ lecture, index, onPressDelete }) => {
    const { t } = useTranslation();
    const { space } = useTheme();

    return (
        <VStack marginBottom={space['1']}>
            <Row>
                <Heading mb={space['0.5']} fontSize="lg" flex="1">
                    {t('appointment') + `${index + 1}`.padStart(2, '0')}
                </Heading>
                {onPressDelete && <Link onPress={onPressDelete}>{t('appointment.deleteModal.delete')}</Link>}
            </Row>

            <VStack>
                <Row>
                    <Text bold minW="100px" fontSize="md">
                        {t('course.CourseDate.Preview.appointmentDate')}
                    </Text>

                    <Text fontSize="md">{DateTime.fromISO(lecture.start).toFormat('dd.MM.yyyy')}</Text>
                </Row>
                <Row>
                    <Text bold minW="100px" fontSize="md">
                        {t('time') + ':'}
                    </Text>
                    <Text fontSize="md">
                        {DateTime.fromISO(lecture.start).toFormat('HH:mm')}
                        {' ' + t('clock')}
                    </Text>
                </Row>
                <Row>
                    <Text bold minW="100px" fontSize="md">
                        {t('duration') + ':'}
                    </Text>
                    <Text fontSize="md">
                        {`${(typeof lecture.duration === 'string' ? parseInt(lecture.duration) : lecture.duration) / 60} ` + t('single.global.hours')}
                    </Text>
                </Row>
            </VStack>
        </VStack>
    );
};
export default AppointmentInfoRow;
