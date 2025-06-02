import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { Screening_Jobstatus_Enum, StudentScreeningStatus, Student_Screening_Status_Enum } from '@/gql/graphql';
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
    mutation ScreenAsInstructor($studentId: Float!, $status: StudentScreeningStatus!, $comment: String! $knowsFrom: String, $jobStatus: screening_jobstatus_enum) {
        studentInstructorScreeningCreate(studentId: $studentId, screening: {
            status: $status
            comment: $comment
            jobStatus: $jobStatus
            knowsCoronaSchoolFrom: $knowsFrom
        })
    }
`);

const CREATE_TUTOR_SCREENING_MUTATION = gql(`
    mutation ScreenAsTutor($studentId: Float!, $status: StudentScreeningStatus!, $comment: String!, $knowsFrom: String, $jobStatus: screening_jobstatus_enum) {
        studentTutorScreeningCreate(studentId: $studentId, screening: {
            status: $status
            comment: $comment
            jobStatus: $jobStatus
            knowsCoronaSchoolFrom: $knowsFrom
        })
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
    const isTutor = student.tutorScreenings?.some((it) => it.status === Student_Screening_Status_Enum.Success) ?? false;
    const isInstructor = student.instructorScreenings?.some((it) => it.status === Student_Screening_Status_Enum.Success) ?? false;
    const wasRejectedAsTutor = student.tutorScreenings?.some((it) => it.status === Student_Screening_Status_Enum.Rejection) ?? false;
    const wasRejectedAsInstructor = student.instructorScreenings?.some((it) => it.status === Student_Screening_Status_Enum.Rejection) ?? false;
    const [knowsFrom, setKnowsFrom] = useState('');

    const [customKnowsFrom, setCustomKnowsFrom] = useState('');
    const [jobStatus, setJobStatus] = useState<Screening_Jobstatus_Enum>();
    const [showJobStatusModal, setShowJobStatusModal] = useState(false);
    const [showConfirmApprove, setShowConfirmApprove] = useState(false);
    const [showConfirmReject, setShowConfirmReject] = useState(false);
    const [mutationCreateInstructorScreening, { loading: loadingInstructorScreening }] = useMutation(CREATE_INSTRUCTOR_SCREENING_MUTATION);
    const [mutationCreateTutorScreening, { loading: loadingTutorScreening }] = useMutation(CREATE_TUTOR_SCREENING_MUTATION);
    const [mutationRequireStudentOnboarding] = useMutation(REQUIRE_STUDENT_ONBOARDING_MUTATION);

    const handleOnKnowsFromChanges = (values: { value: string; customValue: string }) => {
        setKnowsFrom(values.value);
        setCustomKnowsFrom(values.customValue);
    };

    const clearForm = () => {
        setJobStatus(undefined);
        setKnowsFrom('');
    };

    async function screenAsInstructor(decision: StudentScreeningStatus) {
        try {
            await mutationCreateInstructorScreening({
                variables: {
                    studentId: student.id,
                    comment: student.descriptionForScreening,
                    knowsFrom,
                    jobStatus: jobStatus!,
                    status: decision,
                },
            });
            const hadSuccessfulScreening = decision
                ? student.tutorScreenings?.some((s) => s.status === Student_Screening_Status_Enum.Success) ||
                  student.instructorScreenings?.some((s) => s.status === Student_Screening_Status_Enum.Success)
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

    async function screenAsTutor(decision: StudentScreeningStatus) {
        try {
            await mutationCreateTutorScreening({
                variables: {
                    studentId: student.id,
                    comment: student.descriptionForScreening,
                    knowsFrom,
                    jobStatus: jobStatus!,
                    status: decision,
                },
            });
            const hadSuccessfulScreening = decision
                ? student.tutorScreenings?.some((s) => s.status === Student_Screening_Status_Enum.Success) ||
                  student.instructorScreenings?.some((s) => s.status === Student_Screening_Status_Enum.Success)
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

    const isLoading = loadingInstructorScreening || loadingTutorScreening;

    return (
        <div>
            {!currentScreeningType && (
                <div className="flex gap-x-2">
                    {!isTutor && (
                        <Button
                            disabled={wasRejectedAsTutor}
                            reasonDisabled="Dieser Helfer wurde bereits für 1:1 abgelehnt und kann nicht erneut gescreent werden"
                            onClick={() => setCurrentScreeningType('tutor')}
                        >
                            {t('screening.screen_as_tutor')}
                        </Button>
                    )}
                    {!isInstructor && (
                        <Button
                            disabled={wasRejectedAsInstructor}
                            reasonDisabled="Dieser Helfer wurde bereits für Kursleiter abgelehnt und kann nicht erneut gescreent werden"
                            onClick={() => setCurrentScreeningType('instructor')}
                        >
                            {t('screening.screen_as_instructor')}
                        </Button>
                    )}
                    {isTutor && isInstructor && <Typography>Dieser Helfer wurde bereits gescreent</Typography>}
                </div>
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
                            currentScreeningType === 'tutor'
                                ? screenAsTutor(StudentScreeningStatus.Success)
                                : screenAsInstructor(StudentScreeningStatus.Success);
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
                            currentScreeningType === 'tutor'
                                ? screenAsTutor(StudentScreeningStatus.Rejection)
                                : screenAsInstructor(StudentScreeningStatus.Rejection);
                        }}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </div>
    );
};
