import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Label } from '@/components/Label';
import { TextArea } from '@/components/TextArea';
import { Toggle } from '@/components/Toggle';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { ExternalSchoolSearch } from '@/gql/graphql';
import { asTranslationKey } from '@/helper/string-helper';
import { useRoles } from '@/hooks/useApollo';
import { PupilForScreening } from '@/types';
import { getGradeLabel } from '@/Utility';
import { EditGradeModal } from '@/widgets/screening/EditGradeModal';
import { EditLanguagesModal } from '@/widgets/screening/EditLanguagesModal';
import { EditSubjectsModal } from '@/widgets/screening/EditSubjectsModal';
import { useMutation } from '@apollo/client';
import { IconCheck, IconDeviceFloppy, IconKey } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonField } from '../components/ButtonField';
import { EditLocationModal } from '../components/EditLocationModal';
import { EditSchoolTypeModal } from '../components/EditSchoolTypeModal';
import { SchoolSearchInput } from '../components/SchoolSearchInput';
import { EditWeeklyAvailabilityModal } from '../components/WeeklyAvailabilityModal';
import { UpdatePupilFormState } from './useUpdatePupil';

const CREATE_LOGIN_TOKEN_MUTATION = gql(`
    mutation AdminAccess($userId: String!) { tokenCreateAdmin(userId: $userId) }
`);

interface FormErrors {
    languages?: string;
    grade?: string;
    subjects?: string;
}

interface PersonalDetailsProps {
    pupil: PupilForScreening;
    refresh: () => Promise<void>;
    form: UpdatePupilFormState;
    isUpdating: boolean;
    updatePupil: () => Promise<void>;
}

const PersonalDetails = ({ pupil, refresh, form, isUpdating, updatePupil }: PersonalDetailsProps) => {
    const { t } = useTranslation();
    const myRoles = useRoles();
    const [showEditLocation, setShowEditLocation] = useState(false);
    const [showEditSchoolType, setShowEditSchoolType] = useState(false);
    const [showEditGrade, setShowEditGrade] = useState(false);
    const [showEditSubjects, setShowEditSubjects] = useState(false);
    const [showEditLanguages, setShowEditLanguages] = useState(false);
    const [showEditAvailability, setShowEditAvailability] = useState(false);
    const {
        pupilLocation,
        setPupilLocation,
        schoolType,
        setSchoolType,
        grade,
        setGrade,
        subjects,
        setSubjects,
        languages,
        setLanguages,
        onlyMatchWithWomen,
        setOnlyMatchWithWomen,
        hasSpecialNeeds,
        setHasSpecialNeeds,
        school,
        setSchool,
        descriptionForScreening,
        setDescriptionForScreening,
        descriptionForMatch,
        setDescriptionForMatch,
        weeklyAvailability,
        setWeeklyAvailability,
    } = form;

    const [mutationCreateLoginToken] = useMutation(CREATE_LOGIN_TOKEN_MUTATION);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        const updatedErrors = {};
        if (!languages || languages.length === 0) {
            setErrors({ ...updatedErrors, languages: t('screening.errors.language_missing') });
        }
        if (grade === null || grade === undefined) {
            setErrors({ ...updatedErrors, grade: t('screening.errors.grade_missing') });
        }
        if (!subjects || subjects.length === 0) {
            setErrors({ ...updatedErrors, subjects: t('screening.errors.subjects_missing') });
        }
        setErrors(updatedErrors);
    }, [languages, grade, subjects, t]);

    const impersonate = async () => {
        // We need to work around the popup blocker of modern browsers, as you can only
        // call window.open(.., '_blank') in a synchronous event handler of onClick,
        // so we open the window before we call any asynchronous functions and later set the URL when we have the data.
        const w = window.open('', '_blank');
        if (w != null) {
            const res = await mutationCreateLoginToken({ variables: { userId: `pupil/${pupil!.id}` } });
            const token = res?.data?.tokenCreateAdmin;

            w.location.href =
                process.env.NODE_ENV === 'production'
                    ? `https://app.lern-fair.de/login-token?secret_token=${token}&temporary`
                    : `http://localhost:3000/login-token?secret_token=${token}&temporary`;
            w.focus();
        }
    };

    const handleOnSelectSchool = (school: Partial<ExternalSchoolSearch>) => {
        setSchool(school);
        if (school.schooltype) {
            setSchoolType(school.schooltype as any);
        }
        if (school.state) {
            setPupilLocation(school.state as any);
        }
    };
    return (
        <>
            <div className="flex w-full justify-between mb-10">
                <Typography variant="h4">Persönliche Daten</Typography>
                {myRoles.includes('TRUSTED_SCREENER') && pupil.active && (
                    <Button variant="outline" onClick={impersonate} leftIcon={<IconKey size={18} />}>
                        Als Nutzer anmelden
                    </Button>
                )}
            </div>
            <div className="flex flex-wrap gap-6">
                <SchoolSearchInput onSelect={handleOnSelectSchool} defaultValue={school} />
                <div className="flex flex-col gap-y-2">
                    <ButtonField label="Schulort" onClick={() => setShowEditLocation(true)}>
                        {pupilLocation ? t(`lernfair.states.${pupilLocation}`) : 'Schulort bearbeiten'}
                    </ButtonField>
                </div>
                <div className="flex flex-col gap-y-2">
                    <ButtonField label="Schulform" onClick={() => setShowEditSchoolType(true)}>
                        {schoolType ? t(`lernfair.schooltypes.${schoolType}`) : 'Schulform bearbeiten'}
                    </ButtonField>
                </div>
                <div className="flex flex-col gap-y-2">
                    <ButtonField label="Klassenstufe" onClick={() => setShowEditGrade(true)}>
                        {grade ? getGradeLabel(grade) : 'Klassenstufe bearbeiten'}
                    </ButtonField>
                    <Typography variant="sm" className="text-destructive">
                        {errors.grade}
                    </Typography>
                </div>
                <div className="flex flex-col gap-y-2">
                    <ButtonField className="min-w-[350px]" label="Fächer" onClick={() => setShowEditSubjects(true)}>
                        {subjects.map((e) => t(asTranslationKey(`lernfair.subjects.${e.name}`))).join(', ') ?? 'Fächer bearbeiten'}
                    </ButtonField>
                    <Typography variant="sm" className="text-destructive">
                        {errors.subjects}
                    </Typography>
                </div>
                <div className="flex flex-col gap-y-2">
                    <ButtonField className="min-w-[350px]" label="Gesprochene Sprachen" onClick={() => setShowEditLanguages(true)}>
                        {languages.map((e) => t(asTranslationKey(`lernfair.languages.${e.toLowerCase()}`))).join(', ') ?? 'Sprachen bearbeiten'}
                    </ButtonField>
                    <Typography variant="sm" className="text-destructive">
                        {errors.languages}
                    </Typography>
                </div>
                <div className="flex flex-col gap-y-2">
                    <ButtonField className="min-w-[350px]" label="Zeitliche Verfügbarkeit" onClick={() => setShowEditAvailability(true)}>
                        {weeklyAvailability ? (
                            <span className="flex items-center justify-center gap-x-1">
                                Eingerichtet <IconCheck className="text-green-500" size={16} />
                            </span>
                        ) : (
                            <span>Muss eingerichtet werden</span>
                        )}
                    </ButtonField>
                    <Typography variant="sm" className="text-destructive">
                        {errors.languages}
                    </Typography>
                </div>
                <div className="flex gap-x-7 mt-2">
                    <div className="flex gap-x-2 items-center">
                        <Checkbox id="onlyMatchWith" checked={onlyMatchWithWomen} onCheckedChange={setOnlyMatchWithWomen} />{' '}
                        <Label htmlFor="onlyMatchWith">Nur mit Frauen matchen</Label>
                    </div>
                    <div className="flex gap-x-2 items-center">
                        <Checkbox id="specialNeeds" checked={hasSpecialNeeds} onCheckedChange={setHasSpecialNeeds} />{' '}
                        <Label htmlFor="specialNeeds">Besonderer Anspruch</Label>
                    </div>
                </div>
                <div className="flex flex-col gap-6 w-full">
                    <div className="mt-4">
                        <Typography variant="h5" className="mb-5">
                            Interne Notizen
                        </Typography>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-y-2">
                                <Label>
                                    Gespeicherte Notiz - <span className="font-bold">(Wird für spätere Screenings gespeichert)</span>
                                </Label>
                                <TextArea
                                    className="resize-none h-24 w-full"
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
                                    Info für Helfer:in{' - '}
                                    <span className="font-bold">
                                        (Sichtbar für Helfer:innen, nicht für Schüler:innen - Fasse zusammen was relevant ist für die Zusammenarbeit)
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
                <div className="mt-4">
                    <div className="mb-5">
                        <Typography variant="h5" className="mb-2">
                            Rollen
                        </Typography>
                        <Typography variant="subtle">
                            Rollen können jederzeit geändert werden. SuS werden per Email informiert über ihre Rolle wenn Screening abgeschlossen wird
                        </Typography>
                    </div>
                    <div className="flex gap-6 w-full">
                        <Toggle
                            variant="outline"
                            size="lg"
                            className="p-8 h-auto"
                            pressed={form.canHaveMatches}
                            onPressedChange={() => form.setCanHaveMatches(!form.canHaveMatches)}
                            asChild
                            role="button"
                        >
                            <div className="flex gap-x-4">
                                <Checkbox checked={form.canHaveMatches} onCheckedChange={() => form.setCanHaveMatches(!form.canHaveMatches)}></Checkbox>
                                Kann Lernpaare haben
                            </div>
                        </Toggle>
                        <Toggle
                            variant="outline"
                            size="lg"
                            className="p-8 h-auto cursor-not-allowed"
                            pressed={form.canParticipateInCourses}
                            onPressedChange={() => form.setCanParticipateInCourses(!form.canParticipateInCourses)}
                            asChild
                            role="button"
                            disabled
                        >
                            <div className="flex gap-x-4">
                                <Checkbox
                                    disabled
                                    checked={form.canParticipateInCourses}
                                    onCheckedChange={() => form.setCanParticipateInCourses(!form.canParticipateInCourses)}
                                ></Checkbox>
                                Kann an Kursen teilnehmen
                            </div>
                        </Toggle>
                    </div>
                </div>
            </div>
            <div className="mt-10 flex items-center gap-x-4">
                <Button variant="outline" onClick={updatePupil} isLoading={isUpdating} leftIcon={<IconDeviceFloppy />} className="w-80">
                    Speichern
                </Button>
            </div>
            <EditLocationModal state={pupilLocation} onSave={setPupilLocation} isOpen={showEditLocation} onOpenChange={setShowEditLocation} />
            <EditSchoolTypeModal schoolType={schoolType} onSave={setSchoolType} isOpen={showEditSchoolType} onOpenChange={setShowEditSchoolType} />
            <EditGradeModal grade={grade ?? 0} onSave={setGrade} onOpenChange={setShowEditGrade} isOpen={showEditGrade} />
            <EditSubjectsModal type="pupil" subjects={subjects} onSave={setSubjects} onOpenChange={setShowEditSubjects} isOpen={showEditSubjects} />
            <EditLanguagesModal languages={languages} onSave={setLanguages} onOpenChange={setShowEditLanguages} isOpen={showEditLanguages} />
            <EditWeeklyAvailabilityModal
                weeklyAvailability={weeklyAvailability}
                onSave={setWeeklyAvailability}
                onOpenChange={setShowEditAvailability}
                isOpen={showEditAvailability}
            />
        </>
    );
};

export default PersonalDetails;
