import { useTranslation } from 'react-i18next';
import { InfoCard } from '../../components/InfoCard';
import { InstructorScreening, TutorScreening } from '../../types';
import { Box, HStack, Button, Text } from 'native-base';
import EditIcon from '../../assets/icons/lernfair/lf-edit.svg';
import { useState } from 'react';
import { EditStudentScreeningModal } from './EditStudentScreeningModal';
import { Screening, Student_Screening_Status_Enum } from '../../gql/graphql';

interface StudentScreeningCardProps {
    screeningType: 'instructor' | 'tutor';
    screening: InstructorScreening | TutorScreening;
    onUpdate: (screeningId: number, data: Pick<Screening, 'comment'>) => void;
}

export function StudentScreeningCard({ screening, onUpdate, screeningType }: StudentScreeningCardProps) {
    const { t } = useTranslation();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleOnEditModalOpen = () => {
        setIsEditModalOpen(true);
    };

    const handleOnEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const getTitle = () => {
        if (screeningType === 'tutor') {
            return screening.status === Student_Screening_Status_Enum.Success
                ? t('screening.successful_tutor_screening')
                : t('screening.rejected_tutor_screening');
        }
        return screening.status === Student_Screening_Status_Enum.Success
            ? t('screening.successful_instructor_screening')
            : t('screening.rejected_instructor_screening');
    };

    return (
        <>
            <InfoCard
                noMargin
                icon={screening.status === Student_Screening_Status_Enum.Success ? 'yes' : 'no'}
                background={screening.status === Student_Screening_Status_Enum.Success ? 'primary.900' : 'orange.500'}
                title={getTitle()}
            >
                <Box>
                    <Text color="white">
                        <Text bold>{`${t('screening.decision')}: `}</Text>
                        <Text>{new Date(screening!.createdAt).toLocaleDateString()}</Text>
                    </Text>
                    <Text color="white">
                        <Text bold>{`${t('screening.screener')}: `}</Text>
                        <Text>
                            {screening!.screener.firstname} {screening.screener.lastname}
                        </Text>
                    </Text>
                    <Text color="white">
                        <Text bold>{`${t('screening.comment')}: `}</Text>
                        <Text>{screening.comment}</Text>
                    </Text>
                    <HStack mt={2}>
                        <Button variant="subtle" marginLeft="1" marginTop="-1" onPress={handleOnEditModalOpen} rightIcon={<EditIcon />}>
                            {t('edit')}
                        </Button>
                    </HStack>
                </Box>
            </InfoCard>
            <EditStudentScreeningModal
                title={`${getTitle()} ${t('edit')}`}
                isOpen={isEditModalOpen}
                onClose={handleOnEditModalClose}
                onSubmit={(updatedData) => onUpdate(screening.id, updatedData)}
                defaultValues={{
                    comment: screening.comment,
                }}
            />
        </>
    );
}
