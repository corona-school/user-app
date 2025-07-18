import { CheckedState } from '@/components/Checkbox';
import { gql } from '@/gql';
import { Gender_Enum as Gender, ExternalSchoolSearch } from '@/gql/graphql';
import { PupilForScreening } from '@/types';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const UPDATE_PUPIL_MUTATION = gql(`
    mutation ScreenerUpdatePupil($pupilId: Float!, $data: PupilUpdateInput!) {
        pupilUpdate(pupilId: $pupilId, data: $data)
    }
`);

export type UpdatePupilFormState = ReturnType<typeof useUpdatePupil>['form'];

export const useUpdatePupil = (pupil: PupilForScreening) => {
    const [mutationUpdatePupil, { loading: isUpdating }] = useMutation(UPDATE_PUPIL_MUTATION);
    const { t } = useTranslation();
    const [pupilLocation, setPupilLocation] = useState(pupil.state);
    const [schoolType, setSchoolType] = useState(pupil.schooltype);
    const [grade, setGrade] = useState(pupil.gradeAsInt);
    const [subjects, setSubjects] = useState(pupil.subjectsFormatted);
    const [languages, setLanguages] = useState(pupil.languages);
    const [onlyMatchWithWomen, setOnlyMatchWithWomen] = useState<CheckedState>(pupil.onlyMatchWith === Gender.Female);
    const [hasSpecialNeeds, setHasSpecialNeeds] = useState<CheckedState>(pupil.hasSpecialNeeds);
    const [school, setSchool] = useState<Partial<ExternalSchoolSearch> | undefined>(pupil.school as any);
    const [descriptionForScreening, setDescriptionForScreening] = useState(pupil.descriptionForScreening);
    const [descriptionForMatch, setDescriptionForMatch] = useState(pupil.descriptionForMatch);
    const [weeklyAvailability, setWeeklyAvailability] = useState(pupil.calendarPreferences?.weeklyAvailability);

    const updatePupil = async () => {
        try {
            await mutationUpdatePupil({
                variables: {
                    pupilId: pupil.id,
                    data: {
                        gradeAsInt: grade,
                        subjects: subjects.map((e) => ({ name: e.name, grade: e.grade, mandatory: e.mandatory })),
                        languages: languages as any,
                        onlyMatchWith: onlyMatchWithWomen === true ? Gender.Female : (undefined as any),
                        hasSpecialNeeds: hasSpecialNeeds === true,
                        school: {
                            name: school?.name,
                            schooltype: schoolType as any,
                            state: pupilLocation as any,
                            city: school?.city,
                            zip: school?.zip,
                        },
                        descriptionForMatch,
                        descriptionForScreening,
                        calendarPreferences: pupil.calendarPreferences
                            ? {
                                  ...pupil.calendarPreferences,
                                  weeklyAvailability: weeklyAvailability!,
                              }
                            : undefined,
                    },
                },
            });
            toast.success(t('changesWereSaved'));
        } catch (error) {
            toast.success(t('error'));
        }
    };

    return {
        updatePupil,
        isUpdating,
        form: {
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
        },
    };
};
