import { Button } from '@/components/Button';
import { Checkbox, CheckedState } from '@/components/Checkbox';
import { InfoCard } from '@/components/InfoCard';
import { Label } from '@/components/Label';
import { SelectInput } from '@/components/Select';
import { TextArea } from '@/components/TextArea';
import { Typography } from '@/components/Typography';
import { TEST_STUDENT_ID } from '@/config';
import { gql } from '@/gql';
import { Gender } from '@/gql/graphql';
import { asTranslationKey } from '@/helper/string-helper';
import { useRoles } from '@/hooks/useApollo';
import { StudentForScreening } from '@/types';
import { EditLanguagesModal } from '@/widgets/screening/EditLanguagesModal';
import { EditSubjectsModal } from '@/widgets/screening/EditSubjectsModal';
import { ApolloError, useMutation } from '@apollo/client';
import { IconDeviceFloppy, IconKey, IconTestPipe } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ButtonField } from '../components/ButtonField';

interface PersonalDetailsProps {
    student: StudentForScreening;
    refresh: () => Promise<void>;
}

interface FormErrors {
    languages?: string;
    subjects?: string;
}

const CREATE_LOGIN_TOKEN_MUTATION = gql(`
    mutation AdminAccess($userId: String!) { tokenCreateAdmin(userId: $userId) }
`);

const UPDATE_STUDENT_MUTATION = gql(`
    mutation ScreenerUpdateStudent($studentId: Float!, $data: StudentUpdateInput!) {
        studentUpdate(studentId: $studentId, data: $data)
    }
`);

const PersonalDetails = ({ student, refresh }: PersonalDetailsProps) => {
    const myRoles = useRoles();
    const { t } = useTranslation();
    const [showEditSubjects, setShowEditSubjects] = useState(false);
    const [showEditLanguages, setShowEditLanguages] = useState(false);

    const [gender, setGender] = useState(student.gender ?? '');
    const [subjects, setSubjects] = useState(student.subjectsFormatted);
    const [languages, setLanguages] = useState(student.languages);
    const [hasSpecialExperience, setHasSpecialExperience] = useState<CheckedState>(student.hasSpecialExperience);
    const [descriptionForMatch, setDescriptionForMatch] = useState(student.descriptionForMatch);
    const [descriptionForScreening, setDescriptionForScreening] = useState(student.descriptionForScreening);

    const [errors, setErrors] = useState<FormErrors>({});

    const [mutationUpdateStudent, { loading: isUpdating }] = useMutation(UPDATE_STUDENT_MUTATION);
    const [mutationCreateLoginToken] = useMutation(CREATE_LOGIN_TOKEN_MUTATION);

    const handleOnSaveStudent = async () => {
        try {
            await mutationUpdateStudent({
                variables: {
                    studentId: student.id,
                    data: {
                        subjects: subjects.map((e) => ({ name: e.name, grade: e.grade ? { min: e.grade.min, max: e.grade.max } : null })),
                        languages: languages as any,
                        hasSpecialExperience: hasSpecialExperience === true,
                        gender: (gender as Gender) || undefined,
                        descriptionForMatch,
                        descriptionForScreening,
                    },
                },
            });
            toast.success(t('changesWereSaved'));
            await refresh();
        } catch (error) {
            toast.error(t('error'), { description: (error as ApolloError)?.message });
        }
    };

    const impersonate = async (userId: string) => {
        // We need to work around the popup blocker of modern browsers, as you can only
        // call window.open(.., '_blank') in a synchronous event handler of onClick,
        // so we open the window before we call any asynchronous functions and later set the URL when we have the data.
        const w = window.open('', '_blank');
        if (w != null) {
            const res = await mutationCreateLoginToken({ variables: { userId } });
            const token = res?.data?.tokenCreateAdmin;
            w.location.href = `${window.location.origin}/login-token?secret_token=${token}&temporary`;
            w.focus();
        }
    };

    return (
        <>
            <div className="flex w-full justify-between mb-10">
                <Typography variant="h4">Persönliche Daten</Typography>
                {myRoles.includes('TRUSTED_SCREENER') && (
                    <div className="flex flex-col gap-y-4 max-w-[500px]">
                        {student.active && (
                            <Button className="w-full" variant="outline" onClick={() => impersonate(`student/${student!.id}`)} leftIcon={<IconKey size={18} />}>
                                Als Nutzer anmelden
                            </Button>
                        )}
                        {TEST_STUDENT_ID && (
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => impersonate(`student/${TEST_STUDENT_ID}`)}
                                leftIcon={<IconTestPipe size={18} />}
                            >
                                Als Test-Helfer anmelden
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <div>
                {!student.active && <InfoCard icon="loki" title={t('screening.account_deactivated')} message={t('screening.account_deactivated_details')} />}
                <div className="flex flex-col gap-y-2 mb-6">
                    <Label>Geschlecht</Label>
                    <SelectInput
                        className="w-[200px]"
                        value={gender}
                        onValueChange={setGender}
                        options={[
                            { label: 'Weiblich', value: Gender.Female },
                            { label: 'Männlich', value: Gender.Male },
                            { label: 'Unbekannt', value: Gender.Other },
                        ]}
                    />
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex flex-col gap-y-2 flex-1">
                        <ButtonField className="min-w-full" label="Fächer" onClick={() => setShowEditSubjects(true)}>
                            {subjects.map((e) => t(asTranslationKey(`lernfair.subjects.${e.name}`))).join(', ') ?? 'Fächer bearbeiten'}
                        </ButtonField>
                        <Typography variant="sm" className="text-destructive">
                            {errors.subjects}
                        </Typography>
                    </div>
                    <div className="flex flex-col gap-y-2 flex-1">
                        <ButtonField className="min-w-full" label="Gesprochene Sprachen" onClick={() => setShowEditLanguages(true)}>
                            {languages.map((e) => t(asTranslationKey(`lernfair.languages.${e.toLowerCase()}`))).join(', ') ?? 'Sprachen bearbeiten'}
                        </ButtonField>
                        <Typography variant="sm" className="text-destructive">
                            {errors.languages}
                        </Typography>
                    </div>
                </div>
                <div className="flex gap-x-7 mt-6">
                    <div className="flex gap-x-2 items-center">
                        <Checkbox id="hasSpecialExperience" checked={hasSpecialExperience} onCheckedChange={setHasSpecialExperience} />{' '}
                        <Label htmlFor="hasSpecialExperience">Besondere Erfahrung</Label>
                    </div>
                </div>
                <div className="flex flex-col gap-6 w-full">
                    <div className="mt-8">
                        <Typography variant="h5" className="mb-5">
                            Interne Notizen
                        </Typography>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-y-2">
                                <Label>Gespeicherte Notiz</Label>
                                <TextArea
                                    className="resize-y h-24 w-full"
                                    value={descriptionForScreening}
                                    onChange={(e) => setDescriptionForScreening(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
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
                </div>
                <div className="mt-10 flex items-center gap-x-4">
                    <Button variant="outline" onClick={handleOnSaveStudent} isLoading={isUpdating} leftIcon={<IconDeviceFloppy />} className="w-80">
                        Speichern
                    </Button>
                </div>
                <EditSubjectsModal type="student" subjects={subjects} onSave={setSubjects} onOpenChange={setShowEditSubjects} isOpen={showEditSubjects} />
                <EditLanguagesModal languages={languages} onSave={setLanguages} onOpenChange={setShowEditLanguages} isOpen={showEditLanguages} />
            </div>
        </>
    );
};

export default PersonalDetails;
