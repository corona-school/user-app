import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Label } from '@/components/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Panels';
import { Typography } from '@/components/Typography';
import { Pupil_Screening_Status_Enum } from '@/gql/graphql';
import { asTranslationKey } from '@/helper/string-helper';
import { PupilForScreening, PupilScreening } from '@/types';
import { getGradeLabel } from '@/Utility';
import { EditGradeModal } from '@/widgets/screening/EditGradeModal';
import { EditLanguagesModal } from '@/widgets/screening/EditLanguagesModal';
import { EditSubjectsModal } from '@/widgets/screening/EditSubjectsModal';
import { CheckedState } from '@radix-ui/react-checkbox';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonField } from '../components/ButtonField';
import { EditLocationModal } from '../components/EditLocationModal';
import { EditSchoolTypeModal } from '../components/EditSchoolTypeModal';
import { PupilHistory } from './PupilScreeningHistory';
import { SchoolSearchInput } from '../components/SchoolSearchInput';
import { ScreeningSuggestionCard } from '@/widgets/screening/ScreeningSuggestionCard';
import { ScreenPupil } from './ScreenPupil';
import { gql } from '@/gql';
import { ApolloError, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { useRoles } from '@/hooks/useApollo';

interface PupilDetailProps {
    pupil: PupilForScreening;
    refresh: () => Promise<void>;
}

const UPDATE_PUPIL_MUTATION = gql(`
    mutation ScreenerUpdatePupil($pupilId: Float!, $data: PupilUpdateInput!) {
        pupilUpdate(pupilId: $pupilId, data: $data)
    }
`);

const CREATE_LOGIN_TOKEN_MUTATION = gql(`
    mutation AdminAccess($userId: String!) { tokenCreateAdmin(userId: $userId) }
`);

const REQUEST_MATCH_MUTATION = gql(`
    mutation PupilRequestMatch($pupilId: Float!) { pupilCreateMatchRequest(pupilId: $pupilId) }
`);

const REVOKE_MATCH_REQUEST_MUTATION = gql(`
    mutation PupilRevokeMatchRequest($pupilId: Float!) { pupilDeleteMatchRequest(pupilId: $pupilId) }
`);

interface FormErrors {
    languages?: string;
    grade?: string;
    subjects?: string;
}

const PupilDetail = ({ pupil, refresh }: PupilDetailProps) => {
    const { t } = useTranslation();
    const myRoles = useRoles();
    const [showEditLocation, setShowEditLocation] = useState(false);
    const [showEditSchoolType, setShowEditSchoolType] = useState(false);
    const [showEditGrade, setShowEditGrade] = useState(false);
    const [showEditSubjects, setShowEditSubjects] = useState(false);
    const [showEditLanguages, setShowEditLanguages] = useState(false);

    const [onlyMatchWithWomen, setOnlyMatchWithWomen] = useState<CheckedState>(pupil.onlyMatchWithWomen);
    const [hasSpecialNeeds, setHasSpecialNeeds] = useState<CheckedState>(pupil.hasSpecialNeeds);
    const [pupilLocation, setPupilLocation] = useState(pupil.state);
    const [schoolType, setSchoolType] = useState(pupil.schooltype);
    const [grade, setGrade] = useState(pupil.gradeAsInt);
    const [subjects, setSubjects] = useState(pupil.subjectsFormatted);
    const [languages, setLanguages] = useState(pupil.languages);
    const [mutationUpdatePupil, { loading: isUpdating }] = useMutation(UPDATE_PUPIL_MUTATION);
    const [mutationCreateLoginToken] = useMutation(CREATE_LOGIN_TOKEN_MUTATION);
    const [mutationRequestMatch, { loading: isRequestingMatch }] = useMutation(REQUEST_MATCH_MUTATION);
    const [mutationRevokeMatchRequest, { loading: isRevokingMatchRequest }] = useMutation(REVOKE_MATCH_REQUEST_MUTATION);

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

    const { previousScreenings, screeningToEdit } = useMemo(() => {
        const previousScreenings: PupilScreening[] = [...pupil!.screenings!];
        let screeningToEdit: PupilScreening | null = null;

        previousScreenings.sort((a, b) => +new Date(b!.createdAt) - +new Date(a!.createdAt));

        if (
            previousScreenings.length > 0 &&
            !previousScreenings[0]!.invalidated &&
            (previousScreenings[0]!.status === Pupil_Screening_Status_Enum.Pending || previousScreenings[0]!.status === Pupil_Screening_Status_Enum.Dispute)
        ) {
            screeningToEdit = previousScreenings.shift()!;
        }

        return { previousScreenings, screeningToEdit };
    }, [pupil!.screenings!]);

    const needsScreening =
        // If the user was not yet invited for screening, they might need a new one
        previousScreenings.length === 0 ||
        // or in case the previous screening was already invalidated
        previousScreenings[0].invalidated;

    const handleOnSavePupil = () => {
        try {
            mutationUpdatePupil({
                variables: {
                    pupilId: pupil.id,
                    data: {
                        gradeAsInt: grade,
                        subjects: subjects.map((e) => ({ name: e.name, grade: e.grade, mandatory: e.mandatory })),
                        schooltype: schoolType as any,
                        state: pupilLocation as any,
                        languages: languages as any,
                        onlyMatchWithWomen: onlyMatchWithWomen === true,
                        hasSpecialNeeds: hasSpecialNeeds === true,
                    },
                },
            });
            toast.success(t('changesWereSaved'));
        } catch (error) {
            toast.success(t('error'), { description: (error as ApolloError)?.message });
        }
    };

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

    const handleOnRequestMatch = async () => {
        try {
            await mutationRequestMatch({ variables: { pupilId: pupil.id } });
            toast.success(t('changesWereSaved'));
        } catch (error) {
            toast.success(t('error'), { description: (error as ApolloError)?.message });
        }
        refresh();
    };

    const handleOnRemoveMatchRequest = async () => {
        try {
            await mutationRevokeMatchRequest({ variables: { pupilId: pupil.id } });
            toast.success(t('changesWereSaved'));
        } catch (error) {
            toast.success(t('error'), { description: (error as ApolloError)?.message });
        }
        refresh();
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
                        <div className="flex flex-wrap gap-6">
                            <SchoolSearchInput />
                            <div className="flex flex-col gap-y-2">
                                <ButtonField label="Schulort" onClick={() => setShowEditLocation(true)}>
                                    {t(`lernfair.states.${pupilLocation}`) ?? 'Schulort bearbeiten'}
                                </ButtonField>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <ButtonField label="Schulform" onClick={() => setShowEditSchoolType(true)}>
                                    {t(`lernfair.schooltypes.${schoolType}`) ?? 'Schulform bearbeiten'}
                                </ButtonField>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <ButtonField label="Klassenstufe" onClick={() => setShowEditGrade(true)}>
                                    {getGradeLabel(grade) ?? 'Klassenstufe bearbeiten'}
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
                            <div className="flex gap-x-7 mt-2">
                                <div className="flex gap-x-2 items-center">
                                    <Checkbox id="onlyMatchWithWomen" checked={onlyMatchWithWomen} onCheckedChange={setOnlyMatchWithWomen} />{' '}
                                    <Label htmlFor="onlyMatchWithWomen">Nur mit Frauen matchen</Label>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <Checkbox id="specialNeeds" checked={hasSpecialNeeds} onCheckedChange={setHasSpecialNeeds} />{' '}
                                    <Label htmlFor="specialNeeds">Besonderer Anspruch</Label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-x-4">
                            <Button onClick={handleOnSavePupil} isLoading={isUpdating} leftIcon={<IconDeviceFloppy />} className="w-80">
                                Speichern
                            </Button>
                            {myRoles.includes('TRUSTED_SCREENER') && pupil.active && (
                                <Button variant="outline" onClick={impersonate}>
                                    Als Nutzer anmelden
                                </Button>
                            )}
                        </div>
                        <div className="mt-10 flex flex-col">
                            <Typography variant="h4" className="mb-5">
                                Matching
                            </Typography>
                            <div className="flex flex-col gap-y-4">
                                <Typography className="block">{pupil.openMatchRequestCount} Matchanfragen</Typography>
                                <div className="flex items-center gap-x-4">
                                    <Button
                                        isLoading={isRequestingMatch}
                                        disabled={needsScreening && !screeningToEdit}
                                        reasonDisabled="Zuerst muss ein Screening angelegt werden"
                                        onClick={handleOnRequestMatch}
                                    >
                                        Match anfragen
                                    </Button>
                                    <Button
                                        variant="outline"
                                        isLoading={isRevokingMatchRequest}
                                        disabled={pupil.openMatchRequestCount === 0}
                                        reasonDisabled="Keine offene Matchanfrage"
                                        onClick={handleOnRemoveMatchRequest}
                                    >
                                        Anfrage zurücknehmen
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex flex-col">
                            <Typography variant="h4" className="mb-5">
                                Empfehlungen
                            </Typography>
                            <ScreeningSuggestionCard userID={`pupil/${pupil.id}`} />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="screening">
                    <div className="mt-5">
                        <Typography variant="h4" className="mb-5">
                            Screening
                        </Typography>
                        <ScreenPupil pupil={pupil} screening={screeningToEdit ?? undefined} needsScreening={needsScreening} refresh={refresh} />
                    </div>
                </TabsContent>
                <TabsContent value="history">
                    <div className="mt-5">
                        <Typography variant="h4" className="mb-5">
                            Verlauf
                        </Typography>
                        <PupilHistory pupil={pupil} previousScreenings={previousScreenings} />
                    </div>
                </TabsContent>
            </Tabs>

            <EditLocationModal state={pupilLocation} onSave={setPupilLocation} isOpen={showEditLocation} onOpenChange={setShowEditLocation} />
            <EditSchoolTypeModal schoolType={schoolType} onSave={setSchoolType} isOpen={showEditSchoolType} onOpenChange={setShowEditSchoolType} />
            <EditGradeModal grade={grade} onSave={setGrade} onOpenChange={setShowEditGrade} isOpen={showEditGrade} />
            <EditSubjectsModal type="pupil" subjects={subjects} onSave={setSubjects} onOpenChange={setShowEditSubjects} isOpen={showEditSubjects} />
            <EditLanguagesModal languages={languages} onSave={setLanguages} onOpenChange={setShowEditLanguages} isOpen={showEditLanguages} />
        </div>
    );
};

export default PupilDetail;
