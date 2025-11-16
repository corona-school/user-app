import { Label } from '@/components/Label';
import { Switch } from '@/components/Switch';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/Typography';
import { LFSubCourse } from '@/types/lernfair/Course';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    subcourse: LFSubCourse;
    setSubcourse: Dispatch<SetStateAction<LFSubCourse>>;
}

const CourseSettings: React.FC<Props> = ({ subcourse, setSubcourse }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-2.5 w-full">
            <Typography variant="h4">{t('course.CourseDate.form.otherHeadline')}</Typography>
            <div className="flex justify-between">
                <Label htmlFor="1" className="inline flex-grow text-base font-normal">
                    {t('course.CourseDate.form.otherOptionStart')}
                </Label>
                <Switch
                    id="1"
                    className="flex-shrink-0"
                    checked={!!subcourse.joinAfterStart}
                    onCheckedChange={(c) => setSubcourse((s) => ({ ...s, joinAfterStart: c }))}
                />
            </div>
            <div className="flex justify-between">
                <Label htmlFor="2" className="inline flex-grow text-base font-normal">
                    {t('course.CourseDate.form.otherOptionContact')}
                </Label>
            </div>
            <div className="flex justify-between ml-5">
                <Label htmlFor="3" className="inline flex-grow text-base font-normal">
                    {t('course.CourseDate.form.otherProspects')}
                </Label>
                <Switch
                    id="3"
                    className="flex-shrink-0"
                    checked={!!subcourse.allowChatContactProspects}
                    onCheckedChange={(c) => setSubcourse((s) => ({ ...s, allowChatContactProspects: c }))}
                />
            </div>
            <div className="flex justify-between ml-5">
                <Label htmlFor="4" className="inline flex-grow text-base font-normal">
                    {t('course.CourseDate.form.otherParticipants')}
                </Label>
                <Switch
                    id="4"
                    className="flex-shrink-0"
                    checked={!!subcourse.allowChatContactParticipants}
                    onCheckedChange={(c) => setSubcourse((s) => ({ ...s, allowChatContactParticipants: c }))}
                />
            </div>
        </div>
    );
};

export default CourseSettings;
