import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { gql } from '@/gql';
import RemoveParticipantFromCourseModal from '@/modals/RemoveParticipantFromCourseModal';
import { SubcourseParticipant } from '@/types/lernfair/Course';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ParticipantRow from './ParticipantRow';

interface ParticipantsListProps {
    subcourseId: number;
    contactParticipant: (participantId: string) => void;
    isInstructor: boolean;
    onParticipantRemoved: () => void;
}

export const ParticipantsList = ({ subcourseId, contactParticipant, isInstructor, onParticipantRemoved }: ParticipantsListProps) => {
    const { t } = useTranslation();
    const { data, loading, refetch } = useQuery(
        gql(`
        query GetParticipants($subcourseId: Int!) {
            subcourse(subcourseId: $subcourseId){
                participants {
                    id
                    firstname
                    lastname
                    schooltype
                    grade
                    gradeAsInt
                }
            }
        }
    `),
        { variables: { subcourseId } }
    );
    const [isRemoveParticipantModalOpen, setIsRemoveParticipantModalOpen] = useState(false);
    const [participantToRemove, setParticipantToRemove] = useState<SubcourseParticipant>();

    const handleOpenModal = (participant: SubcourseParticipant) => {
        setIsRemoveParticipantModalOpen(true);
        setParticipantToRemove(participant);
    };
    const handleOnParticipantRemoved = async () => {
        setParticipantToRemove(undefined);
        onParticipantRemoved();
        await refetch();
    };

    if (loading) return <CenterLoadingSpinner />;

    const participants = data?.subcourse?.participants ?? [];

    if (participants.length === 0) return <p>{t('single.global.noMembers')}</p>;

    return (
        <>
            <div className="flex flex-col gap-y-6 max-w-[980px] mt-14">
                {participants.map((participant) => (
                    <ParticipantRow
                        key={participant.id}
                        participant={participant}
                        isInstructor={isInstructor}
                        contactParticipant={contactParticipant}
                        removeParticipant={handleOpenModal}
                    />
                ))}
            </div>
            {participantToRemove && (
                <RemoveParticipantFromCourseModal
                    subcourseId={subcourseId}
                    isOpen={isRemoveParticipantModalOpen}
                    onOpenChange={setIsRemoveParticipantModalOpen}
                    participant={participantToRemove}
                    onParticipantRemoved={handleOnParticipantRemoved}
                />
            )}
        </>
    );
};
