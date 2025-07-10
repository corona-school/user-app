import { gql } from '@/gql';
import ConfirmationModal from '@/modals/ConfirmationModal';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const MUTATION_JOIN_AS_MENTOR = gql(`
    mutation JoinAsMentor($subcourseId: Float!) {
        subcourseJoinAsMentor(subcourseId: $subcourseId)
    }
`);

interface UseJoinCourseAsMentorArgs {
    subcourseId: number;
    onSuccess?: () => void;
}

export const useJoinCourseAsMentor = ({ subcourseId, onSuccess }: UseJoinCourseAsMentorArgs) => {
    const [joinAsMentorMutation, { loading: isLoadingJoinCourse }] = useMutation(MUTATION_JOIN_AS_MENTOR);
    const [signInModal, setSignInModal] = useState(false);
    const { t } = useTranslation();

    const handleOnConfirm = async () => {
        await joinAsMentorMutation({ variables: { subcourseId } });
        toast.success(t('single.signIn.toast'));
        setSignInModal(false);
        onSuccess && onSuccess();
    };

    return {
        confirmationModal: (
            <ConfirmationModal
                headline={t('single.homeworkHelp.signIn.title')}
                confirmButtonText={t('single.signIn.homeworkHelpButton')}
                description={t('single.homeworkHelp.signIn.description')}
                onOpenChange={setSignInModal}
                isOpen={signInModal}
                onConfirm={handleOnConfirm}
                isLoading={isLoadingJoinCourse}
            />
        ),
        isJoiningCourse: isLoadingJoinCourse,
        joinAsMentor: () => setSignInModal(true),
        cancelJoinAsMentor: () => setSignInModal(false),
    };
};
