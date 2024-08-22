import { getSchoolTypeKey } from '../../types/lernfair/SchoolType';
import { pupilIdToUserId } from '../../helper/chat-helper';
import { SubcourseParticipant } from '../../types/lernfair/Course';
import { getGradeLabel } from '../../Utility';
import { Typography } from '@/components/Typography';
import { Separator } from '@/components/Separator';
import { Button } from '@/components/Button';
import AvatarPupil from '@/assets/icons/lernfair/avatar_pupil.svg';
import { IconBackpack, IconMessage, IconUser } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface ParticipantFactProps {
    icon: React.ReactNode;
    children: React.ReactNode;
}

const ParticipantFact = ({ children, icon }: ParticipantFactProps) => (
    <div className="flex gap-x-2 lg:gap-x-3 items-center">
        {icon}
        {children}
    </div>
);

interface ParticipantRowProps {
    participant: SubcourseParticipant;
    isInstructor?: boolean;
    contactParticipant?: (participantId: string) => void;
    removeParticipant?: (participant: SubcourseParticipant) => void;
}
const ParticipantRow = ({ participant, isInstructor, contactParticipant, removeParticipant }: ParticipantRowProps) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col lg:flex-row items-center lg:h-[84px] max-w-[980px] py-4 px-4 lg:pl-9 lg:pr-7 border border-gray-300 rounded">
            <AvatarPupil className="size-24" />
            <Separator orientation="vertical" decorative className="ml-6 mr-8" />
            <div className="flex justify-between px-5 lg:flex-col lg:gap-x-10 gap-y-2 w-full mt-4 lg:mt-0">
                <ParticipantFact icon={<IconUser size={18} />}>
                    <Typography variant="sm">
                        {participant.firstname} {participant.lastname ?? ''}
                    </Typography>
                </ParticipantFact>
                <ParticipantFact icon={<IconBackpack size={18} />}>
                    <Typography variant="sm">
                        {participant.schooltype && `${getSchoolTypeKey(participant.schooltype)}, `}
                        {getGradeLabel(participant.gradeAsInt)}
                    </Typography>
                </ParticipantFact>
            </div>
            <div className="flex flex-col gap-y-2 lg:flex-row ml-auto gap-x-4 w-full mt-4 lg:mt-0">
                {isInstructor && contactParticipant && (
                    <Button
                        onClick={() => contactParticipant(pupilIdToUserId(participant.id))}
                        variant="outline"
                        leftIcon={<IconMessage size={16} />}
                        className="w-full"
                    >
                        {t('chat.openChat')}
                    </Button>
                )}
                {isInstructor && removeParticipant && (
                    <Button variant="ghost" onClick={() => removeParticipant(participant)} className="w-full">
                        {t('single.removeFromCourse')}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ParticipantRow;
