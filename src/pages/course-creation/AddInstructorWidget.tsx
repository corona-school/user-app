import { Box, Pressable, Text } from 'native-base';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useModal from '../../hooks/useModal';
import AddCourseInstructor from '../../modals/AddCourseInstructor';
import { LFInstructor } from '../../types/lernfair/Course';
import { CreateCourseContext } from '../CreateCourse';

type WidgetProps = {
    addInstructor: (instructor: LFInstructor) => void;
};
const AddInstructorWidget: React.FC<WidgetProps> = ({ addInstructor }) => {
    const { t } = useTranslation();
    const { show, hide } = useModal();
    const { existingInstructors = [] } = useContext(CreateCourseContext);

    const showAddInstructor = useCallback(() => {
        show({ variant: 'light' }, <AddCourseInstructor addedInstructors={existingInstructors} onInstructorAdded={addInstructor} onClose={hide} />);
    }, [addInstructor, show, hide]);

    return (
        <Pressable onPress={showAddInstructor} alignItems="center" flexDirection="row">
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
