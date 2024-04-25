import { Stack, useTheme } from 'native-base';
import { useNavigate } from 'react-router-dom';
import DisableableButton from '../../../components/DisablebleButton';
import { Course_Coursestate_Enum } from '../../../gql/graphql';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';

type Props = {
    courseState?: Course_Coursestate_Enum;
    subcourseId: Number;
    onAllow: () => void;
    onDeny: () => void;
};

const ScreenerCourseButtons: React.FC<Props> = ({ courseState, subcourseId, onAllow, onDeny }) => {
    const navigate = useNavigate();
    const { space } = useTheme();
    const { t } = useTranslation();

    const { isMobile } = useLayoutHelper();

    const reasonBtnDisabled = () => {
        if (courseState === Course_Coursestate_Enum.Cancelled) return t('screening.courses.reasons_btn_disabled.cancelled');
        else if (courseState === Course_Coursestate_Enum.Denied) return t('screening.courses.reasons_btn_disabled.denied');
        else if (courseState === Course_Coursestate_Enum.Allowed) return t('screening.courses.reasons_btn_disabled.allowed');
        else return '';
    };

    return (
        <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? space['1'] : space['2']}>
            <DisableableButton isDisabled={courseState !== Course_Coursestate_Enum.Submitted} reasonDisabled={reasonBtnDisabled()} onPress={onAllow}>
                {t('screening.courses.allow_course')}
            </DisableableButton>
            <DisableableButton isDisabled={courseState !== Course_Coursestate_Enum.Submitted} reasonDisabled={reasonBtnDisabled()} onPress={onDeny}>
                {t('screening.courses.deny_course')}
            </DisableableButton>
            {/* <Button
                onPress={() => {
                    navigate('/edit-course', {
                        state: { courseId: subcourseId },
                    });
                }}
                variant="outline"
            >
                {t('single.courseInfo.editCourse')}
            </Button> */}
        </Stack>
    );
};

export default ScreenerCourseButtons;
