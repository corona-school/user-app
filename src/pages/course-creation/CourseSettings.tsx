import { Label } from '@/components/Label';
import { Switch } from '@/components/Switch';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/Typography';

interface Props {
    allowParticipantContact: boolean;
    setAllowParticipantContact: (value: boolean) => void;
    allowChatWriting: boolean;
    setAllowChatWriting: (value: boolean) => void;
    joinAfterStart?: boolean;
    setJoinAfterStart?: (value: boolean) => void;
    allowProspectContact?: boolean;
    setAllowProspectContact?: (value: boolean) => void;
}

const CourseSettings: React.FC<Props> = ({
    allowParticipantContact,
    setAllowParticipantContact,
    allowChatWriting,
    setAllowChatWriting,
    joinAfterStart,
    setJoinAfterStart,
    allowProspectContact,
    setAllowProspectContact,
}) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <Typography variant="h3">{t('course.CourseDate.form.otherHeadline')}</Typography>
            <div className="flex justify-between">
                <Label htmlFor="1" className="inline flex-grow text-base">
                    {t('course.CourseDate.form.otherOptionStart')}
                </Label>
                <Switch id="1" className="flex-shrink-0" checked={!!joinAfterStart} onCheckedChange={(c) => setJoinAfterStart && setJoinAfterStart(c)} />
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
                <Switch
                    id="3"
                    className="flex-shrink-0"
                    checked={!!allowProspectContact}
                    onCheckedChange={(c) => setAllowProspectContact && setAllowProspectContact(c)}
                />
            </div>
            <div className="flex justify-between ml-5">
                <Label htmlFor="4" className="inline flex-grow text-base">
                    {t('course.CourseDate.form.otherParticipants')}
                </Label>
                <Switch
                    id="4"
                    className="flex-shrink-0"
                    checked={allowParticipantContact}
                    onCheckedChange={(c) => setAllowParticipantContact && setAllowParticipantContact(c)}
                />
            </div>
            <div className="flex justify-between">
                <Label htmlFor="5" className="inline flex-grow text-base">
                    {t('course.CourseDate.form.allowChatContact')}
                </Label>
                <Switch id="5" className="flex-shrink-0" checked={allowChatWriting} onCheckedChange={(c) => setAllowChatWriting && setAllowChatWriting(c)} />
            </div>
        </div>
    );
};

export default CourseSettings;
