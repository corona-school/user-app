import { Button } from '@/components/Button';
import { Separator } from '@/components/Separator';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { StudentScreeningStatus, StudentScreeningType, Student_Screening_Status_Enum } from '@/gql/graphql';
import ConfirmationModal from '@/modals/ConfirmationModal';
import { InstructorScreening, StudentForScreening, TutorScreening } from '@/types';
import { EditJobStatusModal } from '@/widgets/screening/EditJobStatusModal';
import { useMutation } from '@apollo/client';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ButtonField } from '../components/ButtonField';
import { KnowsUsSelect } from '../components/KnowsUsSelect';

interface ScreenStudentProps {
    student: StudentForScreening;
    refresh: () => Promise<void>;
}

const CUSTOM_KNOWS_FROM_PREFIX = 'Sonstiges: ';

const CREATE_STUDENT_SCREENING_MUTATION = gql(`
    mutation ScreenStudent($studentId: Float!, $type: StudentScreeningType!) {
        studentScreeningCreate(studentId: $studentId, type: $type, screening: {})
    }
`);

const UPDATE_STUDENT_SCREENING_MUTATION = gql(`
    mutation UpdateStudentScreening($screeningId: Float!, $type: StudentScreeningType!, $screening: ScreeningUpdateInput!) {
        studentScreeningUpdate(screeningId: $screeningId, type: $type, data: $screening)
    }
`);

const DELETE_STUDENT_SCREENING_MUTATION = gql(`
    mutation DeleteStudentScreening($screeningId: Float!, $type: StudentScreeningType!) {
        studentScreeningDelete(screeningId: $screeningId, type: $type)
    }
`);

export const ScreenStudent = ({ student, refresh }: ScreenStudentProps) => {
    const { t } = useTranslation();
    const [mutationCreateStudentScreening, { loading: isLoading }] = useMutation(CREATE_STUDENT_SCREENING_MUTATION);

    const createStudentScreening = async (type: StudentScreeningType) => {
        await mutationCreateStudentScreening({ variables: { studentId: student.id, type } });
        toast.success('Screening wurde erstellt');
        await refresh();
    };

    const hasInstructorScreening = !!student?.instructorScreenings?.length;
    const hasTutorScreening = !!student?.tutorScreenings?.length;

    const getKnowsUsFrom = () => {
        if (student.instructorScreenings && student.instructorScreenings[0]?.knowsCoronaSchoolFrom) {
            return student.instructorScreenings[0].knowsCoronaSchoolFrom;
        }
        if (student.tutorScreenings && student.tutorScreenings[0]?.knowsCoronaSchoolFrom) {
            return student.tutorScreenings[0].knowsCoronaSchoolFrom;
        }
    };

    const getJobStatus = () => {
        if (student.instructorScreenings && student.instructorScreenings[0]?.jobStatus) {
            return student.instructorScreenings[0].jobStatus;
        }
        if (student.tutorScreenings && student.tutorScreenings[0]?.jobStatus) {
            return student.tutorScreenings[0].jobStatus;
        }
    };

    return (
        <div>
            <div className="flex gap-x-2">
                {!hasTutorScreening && <Button onClick={() => createStudentScreening(StudentScreeningType.Tutor)}>{t('screening.screen_as_tutor')}</Button>}
                {!hasInstructorScreening && (
                    <Button onClick={() => createStudentScreening(StudentScreeningType.Instructor)}>{t('screening.screen_as_instructor')}</Button>
                )}
            </div>
            {hasInstructorScreening && (
                <ScreeningForm
                    screening={
                        student?.instructorScreenings
                            ? { ...student.instructorScreenings[0], jobStatus: getJobStatus(), knowsCoronaSchoolFrom: getKnowsUsFrom() }
                            : undefined
                    }
                    student={student}
                    isLoading={isLoading}
                    currentScreeningType={StudentScreeningType.Instructor}
                    onDecision={refresh}
                />
            )}
            <Separator className="my-8" />
            {hasTutorScreening && (
                <ScreeningForm
                    screening={
                        student?.tutorScreenings
                            ? { ...student.tutorScreenings[0], jobStatus: getJobStatus(), knowsCoronaSchoolFrom: getKnowsUsFrom() }
                            : undefined
                    }
                    student={student}
                    isLoading={isLoading}
                    currentScreeningType={StudentScreeningType.Tutor}
                    onDecision={refresh}
                />
            )}
        </div>
    );
};

interface ScreeningFormProps {
    student: StudentForScreening;
    screening?: TutorScreening | InstructorScreening;
    isLoading: boolean;
    currentScreeningType: StudentScreeningType;
    onDecision: () => Promise<void>;
}

const ScreeningForm = ({ student, isLoading, screening, currentScreeningType, onDecision }: ScreeningFormProps) => {
    const { t } = useTranslation();
    const [knowsFrom, setKnowsFrom] = useState(screening?.knowsCoronaSchoolFrom ?? '');

    const [customKnowsFrom, setCustomKnowsFrom] = useState('');
    const [jobStatus, setJobStatus] = useState(screening?.jobStatus ?? undefined);
    const [showJobStatusModal, setShowJobStatusModal] = useState(false);
    const [showConfirmApprove, setShowConfirmApprove] = useState(false);
    const [showConfirmReject, setShowConfirmReject] = useState(false);

    useEffect(() => {
        setKnowsFrom(screening?.knowsCoronaSchoolFrom ?? '');
        setJobStatus(screening?.jobStatus ?? undefined);
    }, [screening?.knowsCoronaSchoolFrom, screening?.jobStatus]);

    const [mutationUpdateStudentScreening, { loading: loadingUpdateStudentScreening }] = useMutation(UPDATE_STUDENT_SCREENING_MUTATION);
    const [mutationDeleteStudentScreening, { loading: deletingStudentScreening }] = useMutation(DELETE_STUDENT_SCREENING_MUTATION);

    const updateStudentScreening = async (status: StudentScreeningStatus) => {
        const computedKnowsFrom = knowsFrom.includes('Sonstiges')
            ? `${CUSTOM_KNOWS_FROM_PREFIX}${customKnowsFrom.replaceAll(CUSTOM_KNOWS_FROM_PREFIX, '')}`
            : knowsFrom;
        if (!screening?.id) return;
        try {
            await mutationUpdateStudentScreening({
                variables: {
                    screeningId: screening?.id,
                    type: currentScreeningType,
                    screening: {
                        knowsCoronaSchoolFrom: computedKnowsFrom,
                        jobStatus,
                        status,
                    },
                },
            });
            await onDecision();
            toast.success(t('changesWereSaved'));
        } catch (error) {
            toast.error(t('error'));
        }
    };

    const deleteStudentScreening = async () => {
        if (!screening?.id) return;
        await mutationDeleteStudentScreening({
            variables: {
                screeningId: screening?.id,
                type: currentScreeningType,
            },
        });
        await onDecision();
    };

    const handleOnKnowsFromChanges = (values: { value: string; customValue: string }) => {
        setKnowsFrom(values.value);
        setCustomKnowsFrom(values.customValue);
    };

    const decisionTaken = [Student_Screening_Status_Enum.Rejection, Student_Screening_Status_Enum.Success].includes(screening?.status!);

    return (
        <div>
            <div className="mt-5">
                <Typography variant="h5" className="mb-5">
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
                        disabled={decisionTaken}
                    />
                </div>
                <div className="flex flex-col gap-y-2 flex-1">
                    <ButtonField disabled={decisionTaken} className="min-w-full" label="Beruflicher Status" onClick={() => setShowJobStatusModal(true)}>
                        {jobStatus ? t(`job_status.${jobStatus}`) : ''}
                    </ButtonField>
                </div>
            </div>
            <div className="mt-8">
                <Typography variant="h6" className="mb-5">
                    Entscheidung
                </Typography>
                {decisionTaken && (
                    <Typography>
                        {screening?.status === Student_Screening_Status_Enum.Success ? (
                            <span className="text-green-600">Angenommen</span>
                        ) : (
                            <span className="text-destructive">Abgelehnt</span>
                        )}
                    </Typography>
                )}
                {!decisionTaken && (
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
                        <Button variant="ghost" className="w-[200px]" onClick={deleteStudentScreening} isLoading={deletingStudentScreening}>
                            Aktuell nicht interessiert
                        </Button>
                    </div>
                )}
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
                    updateStudentScreening(StudentScreeningStatus.Success);
                }}
                isLoading={loadingUpdateStudentScreening}
            />
            <ConfirmationModal
                isOpen={showConfirmReject}
                variant="destructive"
                onOpenChange={setShowConfirmReject}
                headline="Ablehnen"
                description={t('screening.confirm_rejection', {
                    firstname: student.firstname,
                    lastname: student.lastname,
                })}
                confirmButtonText="Ablehnen"
                onConfirm={() => {
                    setShowConfirmReject(false);
                    updateStudentScreening(StudentScreeningStatus.Rejection);
                }}
                isLoading={loadingUpdateStudentScreening}
            />
        </div>
    );
};
