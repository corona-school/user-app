import { Label } from '@/components/Label';
import { Toggle } from '@/components/Toggle';
import { Switch } from '@/components/Switch';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/Typography';

const CourseSettings: React.FC = (props) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <Typography variant="h3">{t('course.CourseDate.form.otherHeadline')}</Typography>
            <div className="flex justify-between">
                <Label htmlFor="1" className="inline flex-grow text-base">
                    {t('course.CourseDate.form.otherOptionStart')}
                </Label>
                <Switch id="1" />
            </div>
            <div className="flex justify-between">
                <Label htmlFor="2" className="inline flex-grow text-base">
                    {t('course.CourseDate.form.otherOptionContact')}
                </Label>
            </div>
            <div className="flex justify-between ml-5">
                <Label htmlFor="3" className="inline flex-grow text-base">
                    {t('course.CourseDate.form.otherProspects')}
                </Label>
                <Switch id="3" />
            </div>
            <div className="flex justify-between ml-5">
                <Label htmlFor="4" className="inline flex-grow text-base">
                    {t('course.CourseDate.form.otherParticipants')}
                </Label>
                <Switch id="4" />
            </div>
            <div className="flex justify-between">
                <Label htmlFor="5" className="inline flex-grow text-base">
                    {t('course.CourseDate.form.allowChatContact')}
                </Label>
                <Switch id="5" />
            </div>
        </div>
    );
};

export default CourseSettings;
