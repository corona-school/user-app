import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { TextArea } from '@/components/TextArea';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { Screening_Jobstatus_Enum } from '@/gql/graphql';
import ConfirmationModal from '@/modals/ConfirmationModal';
import { StudentForScreening } from '@/types';
import { EditJobStatusModal } from '@/widgets/screening/EditJobStatusModal';
import { useMutation } from '@apollo/client';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ButtonField } from '../components/ButtonField';
import { KnowsUsSelect } from '../components/KnowsUsSelect';

interface ScreenStudentProps {
    student: StudentForScreening;
    refresh: () => Promise<void>;
}

const CUSTOM_KNOWS_FROM_PREFIX = 'Sonstiges: ';

const CREATE_INSTRUCTOR_SCREENING_MUTATION = gql(`
    mutation ScreenAsInstructor($studentId: Float!, $success: Boolean!, $comment: String! $knowsFrom: String!, $jobStatus: screening_jobstatus_enum!) {
        studentInstructorScreeningCreate(studentId: $studentId, screening: {
            success: $success
            comment: $comment
            jobStatus: $jobStatus
            knowsCoronaSchoolFrom: $knowsFrom
        })
    }
`);

const CREATE_TUTOR_SCREENING_MUTATION = gql(`
    mutation ScreenAsTutor($studentId: Float!, $success: Boolean!, $comment: String!, $knowsFrom: String!, $jobStatus: screening_jobstatus_enum!) {
        studentTutorScreeningCreate(studentId: $studentId, screening: {
            success: $success
            comment: $comment
            jobStatus: $jobStatus
            knowsCoronaSchoolFrom: $knowsFrom
        })
    }
`);

const UPDATE_STUDENT_MUTATION = gql(`
    mutation ScreenerUpdateStudent($studentId: Float!, $data: StudentUpdateInput!) {
        studentUpdate(studentId: $studentId, data: $data)
    }
`);

const REQUIRE_STUDENT_ONBOARDING_MUTATION = gql(`
    mutation requireStudentOnboarding($studentId: Float!) {
        studentRequireOnboarding(studentId: $studentId)
    }
`);

export const ScreenStudent = ({ student, refresh }: ScreenStudentProps) => {
    const { t } = useTranslation();
    const [currentScreeningType, setCurrentScreeningType] = useState('');
    const isTutor = student.tutorScreenings?.some((it) => it.success) ?? false;
    const isInstructor = student.instructorScreenings?.some((it) => it.success) ?? false;
    const [knowsFrom, setKnowsFrom] = useState('');
    const [comment, setComment] = useState('');
    const [descriptionForMatch, setDescriptionForMatch] = useState(student.descriptionForMatch);
    const [customKnowsFrom, setCustomKnowsFrom] = useState('');
    const [jobStatus, setJobStatus] = useState<Screening_Jobstatus_Enum>();
    const [showJobStatusModal, setShowJobStatusModal] = useState(false);
    const [showConfirmApprove, setShowConfirmApprove] = useState(false);
    const [showConfirmReject, setShowConfirmReject] = useState(false);
    const [mutationCreateInstructorScreening, { loading: loadingInstructorScreening }] = useMutation(CREATE_INSTRUCTOR_SCREENING_MUTATION);
    const [mutationCreateTutorScreening, { loading: loadingTutorScreening }] = useMutation(CREATE_TUTOR_SCREENING_MUTATION);
    const [mutationUpdateStudent, { loading: isUpdating }] = useMutation(UPDATE_STUDENT_MUTATION);
    const [mutationRequireStudentOnboarding] = useMutation(REQUIRE_STUDENT_ONBOARDING_MUTATION);

    const handleOnKnowsFromChanges = (values: { value: string; customValue: string }) => {
        setKnowsFrom(values.value);
        setCustomKnowsFrom(values.customValue);
    };

    const clearForm = () => {
        setJobStatus(undefined);
        setComment('');
        setKnowsFrom('');
    };

    async function screenAsInstructor(decision: boolean) {
        try {
            await mutationCreateInstructorScreening({ variables: { studentId: student.id, comment, knowsFrom, jobStatus: jobStatus!, success: decision } });
            await mutationUpdateStudent({ variables: { studentId: student.id, data: { descriptionForMatch } } });

            const hadSuccessfulScreening = decision
                ? student.tutorScreenings?.some((s) => s.success) || student.instructorScreenings?.some((s) => s.success)
                : false;

            if (decision && !hadSuccessfulScreening) {
                mutationRequireStudentOnboarding({ variables: { studentId: student.id } });
            }
            await refresh();
            toast.success(t('changesWereSaved'));
            setCurrentScreeningType('');
            clearForm();
        } catch (error) {
            toast.error(t('error'));
        }
    }

    async function screenAsTutor(decision: boolean) {
        try {
            await mutationCreateTutorScreening({ variables: { studentId: student.id, comment, knowsFrom, jobStatus: jobStatus!, success: decision } });
            await mutationUpdateStudent({ variables: { studentId: student.id, data: { descriptionForMatch } } });

            const hadSuccessfulScreening = decision
                ? student.tutorScreenings?.some((s) => s.success) || student.instructorScreenings?.some((s) => s.success)
                : false;

            if (decision && !hadSuccessfulScreening) {
                mutationRequireStudentOnboarding({ variables: { studentId: student.id } });
            }
            refresh();
            toast.success(t('changesWereSaved'));
            setCurrentScreeningType('');
            clearForm();
        } catch (error) {
            toast.error(t('error'));
        }
    }

    const isLoading = loadingInstructorScreening || loadingTutorScreening || isUpdating;

    return (
        <div>
            {!currentScreeningType && (
                <>
                    <div className="mt-5">
                        <Typography variant="h4" className="mb-5">
                            Screening
                        </Typography>
                    </div>
                    <div className="flex gap-x-2">
                        {!isTutor && <Button onClick={() => setCurrentScreeningType('tutor')}>{t('screening.screen_as_tutor')}</Button>}
                        {!isInstructor && <Button onClick={() => setCurrentScreeningType('instructor')}>{t('screening.screen_as_instructor')}</Button>}
                        {isTutor && isInstructor && <Typography>Dieser Helfer wurde bereits gescreent</Typography>}
                    </div>
                </>
            )}
            {currentScreeningType && (
                <div>
                    <div className="mt-5">
                        <Typography variant="h4" className="mb-5">
                            {t(currentScreeningType === 'tutor' ? 'screening.screen_as_tutor' : 'screening.screen_as_instructor')}
                        </Typography>
                    </div>
                    <div className="flex gap-6">
                        <div className="flex flex-col gap-y-2 flex-1">
                            <KnowsUsSelect
                                className="w-[450px]"
                                value={customKnowsFrom ? 'Sonstiges' : knowsFrom}
                                onChange={handleOnKnowsFromChanges}
                                customValue={customKnowsFrom.replace(CUSTOM_KNOWS_FROM_PREFIX, '')}
                                type="student"
                            />
                        </div>
                        <div className="flex flex-col gap-y-2 flex-1">
                            <ButtonField className="min-w-full" label="Beruflicher Status" onClick={() => setShowJobStatusModal(true)}>
                                {jobStatus ? t(`job_status.${jobStatus}`) : ''}
                            </ButtonField>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Typography variant="h5" className="mb-5">
                            Interne Notizen
                        </Typography>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-y-2">
                                <Label>Gespeicherte Notiz</Label>
                                <TextArea className="resize-none h-24 w-full" value={comment} onChange={(e) => setComment(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    {currentScreeningType === 'tutor' && (
                        <div className="mt-4">
                            <Typography variant="h5" className="mb-5">
                                Öffentliche Notizen
                            </Typography>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-y-2">
                                    <Label>
                                        Info für Schüler:in{' - '}
                                        <span className="font-bold">
                                            (Sichtbar für Schüler:innen, nicht für Helfer:innen - Fasse zusammen was relevant ist für die Zusammenarbeit)
                                        </span>
                                    </Label>
                                    <TextArea
                                        className="resize-none h-24 w-full"
                                        value={descriptionForMatch}
                                        onChange={(e) => setDescriptionForMatch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mt-8">
                        <Typography variant="h4" className="mb-5">
                            Entscheidungen
                        </Typography>
                        <div className="flex flex-row flex-wrap gap-x-10 gap-y-6">
                            <Button onClick={() => setShowConfirmApprove(true)} variant="default" leftIcon={<IconThumbUp className="" />} className="w-[200px]">
                                Annehmen
                            </Button>
                            <Button
                                onClick={() => setShowConfirmReject(true)}
                                isLoading={isLoading}
                                variant="destructive"
                                leftIcon={<IconThumbDown />}
                                className="w-[200px]"
                            >
                                Ablehnen
                            </Button>
                        </div>
                    </div>
                    <EditJobStatusModal jobStatus={jobStatus} onSave={setJobStatus} isOpen={showJobStatusModal} onOpenChange={setShowJobStatusModal} />
                    <ConfirmationModal
                        isOpen={showConfirmApprove}
                        onOpenChange={setShowConfirmApprove}
                        headline="Annhemen"
                        description={t('screening.confirm_success', {
                            firstname: student.firstname,
                            lastname: student.lastname,
                        })}
                        confirmButtonText="Annehmen"
                        onConfirm={() => {
                            setShowConfirmApprove(false);
                            currentScreeningType === 'tutor' ? screenAsTutor(true) : screenAsInstructor(true);
                        }}
                        isLoading={isLoading}
                    />
                    <ConfirmationModal
                        variant="destructive"
                        isOpen={showConfirmReject}
                        onOpenChange={setShowConfirmReject}
                        headline="Ablehnen"
                        description={t('screening.confirm_rejection', {
                            firstname: student.firstname,
                            lastname: student.lastname,
                        })}
                        confirmButtonText="Ablehnen"
                        onConfirm={() => {
                            setShowConfirmReject(false);
                            currentScreeningType === 'tutor' ? screenAsTutor(false) : screenAsInstructor(false);
                        }}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </div>
    );
};
