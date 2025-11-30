import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '@/gql';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { CourseCategory, Subcourse } from '@/gql/graphql';
import { logError } from '@/log';
import { toast } from 'sonner';
import { DateTime } from 'luxon';

interface DuplicateCourseModalProps extends BaseModalProps {
    subcourse?: Subcourse;
}

export const DuplicateCourseModal = ({ isOpen, onOpenChange, subcourse }: DuplicateCourseModalProps) => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const [name, setName] = useState('');

    useEffect(() => {
        if (subcourse) {
            setName(`Kopie ${DateTime.now().toFormat('dd.MM.yyyy')} von ${subcourse!.course.name}`);
        }
    }, [subcourse]);

    const [createCourse, { loading: loadingCourse }] = useMutation(
        gql(`
            mutation CreateDuplicateCourse($course: PublicCourseCreateInput!) {
                courseCreate(course: $course) {id}
            }
        `)
    );

    const [createSubcourse, { loading: loadingSubcourse }] = useMutation(
        gql(`
            mutation CreateDuplicateSubcourse($courseId: Float!, $subcourse: PublicSubcourseCreateInput!) {
                subcourseCreate(courseId: $courseId, subcourse: $subcourse) {id}
            }
        `)
    );

    const submit = async () => {
        try {
            const courseRes = await createCourse({
                variables: {
                    course: {
                        name,
                        outline: subcourse!.course.outline ?? '',
                        allowContact: subcourse!.course.allowContact,
                        category: subcourse!.course.category as unknown as CourseCategory,
                        description: subcourse!.course.description,
                        subject: subcourse!.course.subject,
                    },
                },
            });

            const subcourseRes = await createSubcourse({
                variables: {
                    courseId: courseRes.data!.courseCreate.id,
                    subcourse: {
                        minGrade: subcourse!.minGrade,
                        maxGrade: subcourse!.maxGrade,
                        allowChatContactParticipants: subcourse!.allowChatContactParticipants,
                        allowChatContactProspects: subcourse!.allowChatContactProspects,
                        groupChatType: subcourse!.groupChatType,
                        joinAfterStart: subcourse!.joinAfterStart,
                        maxParticipants: subcourse!.maxParticipants,
                    },
                },
            });

            navigate(`/single-course/${subcourseRes.data?.subcourseCreate.id}`);
        } catch (e) {
            logError('DuplicateSubcourseModal', 'Error while duplicating subcourse', e);
            toast.error(t('course.duplicateModal.error'));
        }
    };

    if (!subcourse) <p>Error</p>;

    return (
        <Modal className="w-full md:max-w-[500px] px-2 md:px-6" onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader className="px-2">
                <ModalTitle>{t('course.duplicateModal.title')}</ModalTitle>
            </ModalHeader>
            <div className="md:max-h-[500px] overflow-auto px-2">
                <Typography className="pb-1.5">{t('course.duplicateModal.description')}</Typography>
                <div className="mb-10">
                    <div className="flex flex-col py-0.5">
                        <Label>{t('course.duplicateModal.name')}</Label>
                        <Input value={name} onChangeText={setName} placeholder={t('course.duplicateModal.name')} />
                    </div>
                </div>
                <ModalFooter>
                    <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                        {t('cancel')}
                    </Button>
                    <Button disabled={!name} className="w-full lg:w-fit" isLoading={loadingCourse || loadingSubcourse} onClick={submit}>
                        {t('contactSupport.submit')}
                    </Button>
                </ModalFooter>
            </div>
        </Modal>
    );
};
