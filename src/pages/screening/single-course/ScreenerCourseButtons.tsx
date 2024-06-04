import { Button, Stack, useTheme } from 'native-base';
import { useNavigate } from 'react-router-dom';
import DisableableButton from '../../../components/DisablebleButton';
import { Course_Coursestate_Enum } from '../../../gql/graphql';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';

type Props = {
    courseState?: Course_Coursestate_Enum;
    subcourseId: Number;
    isShared?: boolean;
    onAllow: () => void;
    onDeny: () => void;
    onShare: () => void;
};

const ScreenerCourseButtons: React.FC<Props> = ({ courseState, isShared, subcourseId, onAllow, onDeny, onShare }) => {
    const navigate = useNavigate();
    const { space } = useTheme();
    const { t } = useTranslation();

    const { isMobile } = useLayoutHelper();

    const reasonBtnDisabled = () => {
        switch (courseState) {
            case Course_Coursestate_Enum.Cancelled:
                return t('screening.courses.already.cancelled');
            case Course_Coursestate_Enum.Denied:
                return t('screening.courses.already.denied');
            case Course_Coursestate_Enum.Allowed:
                return t('screening.courses.already.allowed');
            default:
                return '';
        }
    };

    return (
        <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? space['1'] : space['2']}>
            {/* ALLOW COURSE */}
            <DisableableButton
                isDisabled={courseState === Course_Coursestate_Enum.Allowed || courseState === Course_Coursestate_Enum.Cancelled}
                reasonDisabled={reasonBtnDisabled()}
                onPress={onAllow}
                bgColor={courseState === Course_Coursestate_Enum.Denied ? 'danger.100' : undefined}
                _text={{ color: courseState === Course_Coursestate_Enum.Denied ? 'white' : undefined }}
            >
                {t('screening.courses.allow_course')}
            </DisableableButton>
            {/* DENY COURSE */}
            <DisableableButton isDisabled={courseState !== Course_Coursestate_Enum.Submitted} reasonDisabled={reasonBtnDisabled()} onPress={onDeny}>
                {t('screening.courses.deny_course')}
            </DisableableButton>
            {/* SHARE COURSE */}
            <Button onPress={onShare} variant="outline">
                {t(`screening.courses.${isShared ? 'unshare_course' : 'share_course'}`)}
            </Button>
            {/* EDIT COURSE */}
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
