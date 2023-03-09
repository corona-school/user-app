import { Box, Pressable, Text } from 'native-base';
import { useTranslation } from 'react-i18next';

const AddInstructorWidget: React.FC<{ onPress: () => any }> = ({ onPress }) => {
    const { t } = useTranslation();

    return (
        <Pressable onPress={onPress} alignItems="center" flexDirection="row">
            <Box display="flex" alignItems="center" justifyContent="center" bg={'primary.900'} w="40px" h="40px" marginRight="15px" borderRadius="10px">
                <Text color="white" fontSize="32px">
                    +
                </Text>
            </Box>
            <Text bold>{t('course.CourseDate.form.courseAddOntherLeadText')}</Text>
        </Pressable>
    );
};

export default AddInstructorWidget;
