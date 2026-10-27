import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { gql } from '@/gql';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import { Subcourse } from '@/gql/graphql';
import { logError } from '@/log';
import { toast } from 'sonner';

interface DeleteCourseModalProps extends BaseModalProps {
    subcourse?: Subcourse;
}

export const DeleteCourseModal = ({ isOpen, onOpenChange, subcourse }: DeleteCourseModalProps) => {
    const { t } = useTranslation();

    const [deleteCourseDraft, { loading }] = useMutation(
        gql(`
            mutation DeleteCourseDraft($courseId: Float!) {
                courseDeleteDraft(courseId: $courseId)
            }
        `),
        { refetchQueries: ['StudentCourseOverview'] }
    );

    const submit = async () => {
        try {
            await deleteCourseDraft({ variables: { courseId: subcourse!.course.id } });
            toast.success(t('course.deleteModal.success'));
            onOpenChange(false);
        } catch (e) {
            logError('DeleteCourseModal', 'Error while deleting course draft', e);
            toast.error(t('course.deleteModal.error'));
        }
    };

    return (
        <Modal className="w-full md:max-w-[500px] px-2 md:px-6" onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader className="px-2">
                <ModalTitle>{t('course.deleteModal.title')}</ModalTitle>
            </ModalHeader>
            <div className="px-2">
                <Typography className="pb-1.5">{t('course.deleteModal.description')}</Typography>
                <ModalFooter>
                    <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                        {t('cancel')}
                    </Button>
                    <Button className="w-full lg:w-fit" variant="destructive" isLoading={loading} onClick={submit}>
                        {t('course.actions.delete')}
                    </Button>
                </ModalFooter>
            </div>
        </Modal>
    );
};
