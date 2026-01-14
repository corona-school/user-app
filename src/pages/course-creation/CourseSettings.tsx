import { Label } from '@/components/Label';
import { Switch } from '@/components/Switch';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/Typography';
import { LFSubCourse } from '@/types/lernfair/Course';
import { Dispatch, SetStateAction } from 'react';
import { InfoTooltipButton } from '@/components/Tooltip';

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
                <div className="inline-flex align-baseline gap-1.5">
                    <Label htmlFor="1" className="inline flex-grow text-base font-medium">
                        {t('course.CourseDate.form.otherOptionStart')}
                    </Label>
                    <InfoTooltipButton className="size-4" tooltipContent={t('course.CourseDate.form.otherOptionStartToolTip')} />
                </div>
                <Switch
                    id="1"
                    className="flex-shrink-0"
                    checked={!!subcourse.joinAfterStart}
                    onCheckedChange={(c) => setSubcourse((s) => ({ ...s, joinAfterStart: c }))}
                />
            </div>
            <div className="flex justify-between">
                <Label htmlFor="2" className="inline flex-grow text-base font-medium">
                    {t('course.CourseDate.form.otherOptionContact')}
                </Label>
            </div>
            <div className="flex justify-between ml-5">
                <div className="inline-flex flex-grow align-baseline gap-1.5 text-end mr-20">
                    <Label htmlFor="3" className="inline flex-grow text-base font-medium">
                        {t('course.CourseDate.form.otherProspects')}
                    </Label>
                    <InfoTooltipButton className="size-4" tooltipContent={t('course.CourseDate.form.prospectContactTooltip')} />
                </div>
                <Switch
                    id="3"
                    className="flex-shrink-0"
                    checked={!!subcourse.allowChatContactProspects}
                    onCheckedChange={(c) => setSubcourse((s) => ({ ...s, allowChatContactProspects: c }))}
                />
            </div>
            <div className="flex justify-between ml-5">
                <div className="inline-flex flex-grow align-baseline gap-1.5 text-end mr-20">
                    <Label htmlFor="4" className="inline flex-grow text-base font-medium">
                        {t('course.CourseDate.form.otherParticipants')}
                    </Label>
                    <InfoTooltipButton className="size-4" tooltipContent={t('course.CourseDate.form.participantsContactTooltip')} />
                </div>
                <Switch
                    id="4"
                    className="flex-shrink-0"
                    checked={!!subcourse.allowChatContactParticipants}
                    onCheckedChange={(c) => setSubcourse((s) => ({ ...s, allowChatContactParticipants: c }))}
                />
            </div>
            <div className="flex justify-between">
                <div className="inline-flex align-baseline gap-1.5">
                    <Label htmlFor="5" className="inline flex-grow text-base font-medium">
                        {t('course.CourseDate.form.allowChatContact')}
                    </Label>
                    <InfoTooltipButton className="size-4" tooltipContent={t('course.CourseDate.form.allowChatContactTooltip')} />
                </div>
                <Switch
                    id="5"
                    className="flex-shrink-0"
                    checked={!!subcourse.course.allowContact}
                    onCheckedChange={(c) => setSubcourse((s) => ({ ...s, course: { ...s.course, allowContact: c } }))}
                />
            </div>
        </div>
    );
};

export default CourseSettings;
