import { Button } from '@/components/Button';
import { Checkbox, CheckedState } from '@/components/Checkbox';
import { InfoCard } from '@/components/InfoCard';
import { Label } from '@/components/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Panels';
import { SelectInput } from '@/components/Select';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { Gender } from '@/gql/graphql';
import { asTranslationKey } from '@/helper/string-helper';
import { useRoles } from '@/hooks/useApollo';
import { StudentForScreening } from '@/types';
import { formatDate } from '@/Utility';
import { EditLanguagesModal } from '@/widgets/screening/EditLanguagesModal';
import { EditSubjectsModal } from '@/widgets/screening/EditSubjectsModal';
import { ApolloError, useMutation } from '@apollo/client';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ButtonField } from '../components/ButtonField';
import { ScreenStudent } from './ScreenStudent';
import { StudentHistory } from './StudentHistory';

interface StudentDetailProps {
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

export const StudentDetail = ({ student, refresh }: StudentDetailProps) => {
    const myRoles = useRoles();
    const { t } = useTranslation();
    const [showEditSubjects, setShowEditSubjects] = useState(false);
    const [showEditLanguages, setShowEditLanguages] = useState(false);

    const [gender, setGender] = useState(student.gender ?? '');
    const [subjects, setSubjects] = useState(student.subjectsFormatted);
    const [languages, setLanguages] = useState(student.languages);
    const [hasSpecialExperience, setHasSpecialExperience] = useState<CheckedState>(student.hasSpecialExperience);

    const [errors, setErrors] = useState<FormErrors>({});

    const [mutationUpdateStudent, { loading: isUpdating }] = useMutation(UPDATE_STUDENT_MUTATION);
    const [mutationCreateLoginToken] = useMutation(CREATE_LOGIN_TOKEN_MUTATION);

    const handleOnSaveStudent = () => {
        try {
            mutationUpdateStudent({
                variables: {
                    studentId: student.id,
                    data: {
                        subjects: subjects.map((e) => ({ name: e.name })),
                        languages: languages as any,
                        hasSpecialExperience: hasSpecialExperience === true,
                        gender: gender as Gender,
                    },
                },
            });
            toast.success(t('changesWereSaved'));
        } catch (error) {
            toast.error(t('error'), { description: (error as ApolloError)?.message });
        }
    };

    const impersonate = async () => {
        // We need to work around the popup blocker of modern browsers, as you can only
        // call window.open(.., '_blank') in a synchronous event handler of onClick,
        // so we open the window before we call any asynchronous functions and later set the URL when we have the data.
        const w = window.open('', '_blank');
        if (w != null) {
            const res = await mutationCreateLoginToken({ variables: { userId: `student/${student!.id}` } });
            const token = res?.data?.tokenCreateAdmin;

            w.location.href =
                process.env.NODE_ENV === 'production'
                    ? `https://app.lern-fair.de/login-token?secret_token=${token}&temporary`
                    : `http://localhost:3000/login-token?secret_token=${token}&temporary`;
            w.focus();
        }
    };

    return (
        <div className="mt-8">
            <Tabs defaultValue="personal">
                <TabsList className="max-h-9 p-1">
                    <TabsTrigger className="max-h-7" value="personal">
                        Profil
                    </TabsTrigger>
                    <TabsTrigger className="max-h-7" value="screening">
                        Screening
                    </TabsTrigger>
                    <TabsTrigger className="max-h-7" value="history">
                        Verlauf
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="personal">
                    <div className="mt-5">
                        <Typography variant="h4" className="mb-5">
                            Persönliche Daten
                        </Typography>
                        {!student.active && (
                            <InfoCard icon="loki" title={t('screening.account_deactivated')} message={t('screening.account_deactivated_details')} />
                        )}
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
                        <div className="mt-10 flex items-center gap-x-4">
                            <Button onClick={handleOnSaveStudent} isLoading={isUpdating} leftIcon={<IconDeviceFloppy />} className="w-80">
                                Speichern
                            </Button>
                            {myRoles.includes('TRUSTED_SCREENER') && student.active && (
                                <Button variant="outline" onClick={impersonate}>
                                    Als Nutzer anmelden
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="mt-10">
                        <Typography variant="h4" className="mb-5">
                            {t('screening.certificateOfConduct')}
                        </Typography>
                        <div className="flex flex-col gap-y-2 mb-6">
                            <Typography>
                                {t(
                                    student.certificateOfConduct?.id
                                        ? 'screening.certificateOfConductWasProvided'
                                        : 'screening.certificateOfConductWasNotProvided'
                                )}
                            </Typography>
                            {student.certificateOfConductDeactivationDate && (
                                <Typography className={student.certificateOfConductDeactivationDate ? 'text-destructive' : 'text-primary'}>
                                    {t('screening.deactivationDate')}: {formatDate(student.certificateOfConductDeactivationDate)}
                                </Typography>
                            )}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="screening">
                    <ScreenStudent student={student} refresh={refresh} />
                </TabsContent>
                <TabsContent value="history">
                    <div className="mt-5">
                        <Typography variant="h4" className="mb-5">
                            Verlauf
                        </Typography>
                    </div>
                    <StudentHistory student={student} />
                </TabsContent>
            </Tabs>
            <EditSubjectsModal type="student" subjects={subjects} onSave={setSubjects} onOpenChange={setShowEditSubjects} isOpen={showEditSubjects} />
            <EditLanguagesModal languages={languages} onSave={setLanguages} onOpenChange={setShowEditLanguages} isOpen={showEditLanguages} />
        </div>
    );
};
