import { Text, useTheme, Pressable, Column, Button, Row } from 'native-base';
import { useTranslation } from 'react-i18next';

import { LFInstructor } from '../types/lernfair/Course';

type Props = {
    isAdded?: boolean;
    instructor: LFInstructor;
    onPress?: () => any;
    onPressDelete?: () => any;
};

const InstructorRow: React.FC<Props> = ({ instructor, onPress, isAdded, onPressDelete }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    return (
        <Pressable
            isDisabled={isAdded}
            onPress={onPress}
            paddingY={space['1']}
            _hover={
                (isAdded && {
                    bgColor: 'primary.100',
                }) ||
                undefined
            }
            borderBottomWidth="1"
            borderBottomColor={'gray.300'}
        >
            <Column marginLeft={space['1']}>
                <Row alignItems="center">
                    <Text color={isAdded ? 'gray.500' : 'darkText'} flex="1">
                        {instructor.firstname} {instructor.lastname}
                    </Text>
                    {onPressDelete && <Button onPress={onPressDelete}>{t('delete')}</Button>}
                </Row>

                {isAdded && (
                    <Text fontSize="sm" opacity={isAdded ? 1 : 0}>
                        {t('course.CourseDate.form.courseAlreadyaAddedLead')}
                    </Text>
                )}
            </Column>
        </Pressable>
    );
};
export default InstructorRow;
