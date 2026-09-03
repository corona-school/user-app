import { CheckedState } from '@/components/Checkbox';
import { gql } from '@/gql';
import { Gender_Enum as Gender, ExternalSchoolSearch, Learning_Offer_Constraints_Enum } from '@/gql/graphql';
import { PupilForScreening } from '@/types';
import { getAgeAtRegistration, getApproxCurrentAge } from '@/Utility';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const UPDATE_PUPIL_MUTATION = gql(`
    mutation ScreenerUpdatePupil($pupilId: Float!, $data: PupilUpdateInput!) {
        pupilUpdate(pupilId: $pupilId, data: $data)
    }
`);

export type UpdatePupilFormState = ReturnType<typeof useUpdatePupil>['form'];

export enum PupilLearningOfferConstraintOptions {
    AllOffers = 'all-offers',
    OnlyCourses = 'only-courses',
    DazSubjectRequiredForMatching = 'daz-subject-required-for-matching',
    OnlyDazCourses = 'only-daz-courses',
}

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
    const [currentAge, setCurrentAge] = useState(pupil.age ? getApproxCurrentAge(pupil.createdAt, pupil.age) : undefined);
    const [learningOfferConstraints, setLearningOfferConstraints] = useState(pupil.learningOfferConstraints);
    const [restrictions, setRestrictions] = useState<PupilLearningOfferConstraintOptions>();
    const [isPupil, setIsPupil] = useState(pupil.isPupil);

    useEffect(() => {
        if (learningOfferConstraints.includes(Learning_Offer_Constraints_Enum.DazSubjectRequiredForMatching)) {
            setRestrictions(PupilLearningOfferConstraintOptions.DazSubjectRequiredForMatching);
        } else if (learningOfferConstraints.includes(Learning_Offer_Constraints_Enum.OnlyDazCourses)) {
            setRestrictions(PupilLearningOfferConstraintOptions.OnlyDazCourses);
        } else if (!pupil.isPupil) {
            setRestrictions(PupilLearningOfferConstraintOptions.OnlyCourses);
        } else {
            setRestrictions(PupilLearningOfferConstraintOptions.AllOffers);
        }
    }, []);

    const onRestrictionsChange = (value: string) => {
        switch (value) {
            case PupilLearningOfferConstraintOptions.OnlyCourses:
                setRestrictions(PupilLearningOfferConstraintOptions.OnlyCourses);
                setLearningOfferConstraints([]);
                setIsPupil(false);
                break;
            case PupilLearningOfferConstraintOptions.OnlyDazCourses:
                setRestrictions(PupilLearningOfferConstraintOptions.OnlyDazCourses);
                setLearningOfferConstraints([Learning_Offer_Constraints_Enum.OnlyDazCourses]);
                setIsPupil(false);
                break;
            case PupilLearningOfferConstraintOptions.DazSubjectRequiredForMatching:
                setRestrictions(PupilLearningOfferConstraintOptions.DazSubjectRequiredForMatching);
                setLearningOfferConstraints([Learning_Offer_Constraints_Enum.DazSubjectRequiredForMatching]);
                setIsPupil(true);
                break;
            default:
                setRestrictions(PupilLearningOfferConstraintOptions.AllOffers);
                setLearningOfferConstraints([]);
                setIsPupil(true);
        }
    };

    const updatePupil = async () => {
        try {
            await mutationUpdatePupil({
                variables: {
                    pupilId: pupil.id,
                    data: {
                        gradeAsInt: grade,
                        subjects: subjects.map((e) => ({ name: e.name, grade: e.grade, mandatory: e.mandatory })),
                        languages: languages as any,
                        onlyMatchWith: onlyMatchWithWomen === true ? Gender.Female : (null as any),
                        hasSpecialNeeds: hasSpecialNeeds === true,
                        school: {
                            name: school?.name?.split(',')[0] ?? school?.name,
                            schooltype: schoolType as any,
                            state: pupilLocation as any,
                            city: school?.city,
                            zip: school?.zip,
                        },
                        descriptionForMatch,
                        descriptionForScreening,
                        isPupil: isPupil,
                        age: pupil.age !== currentAge && currentAge ? getAgeAtRegistration(pupil.createdAt, currentAge) : pupil.age,
                        learningOfferConstraints: learningOfferConstraints as any,
                        calendarPreferences: weeklyAvailability
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
            toast.error(t('error'));
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
            setCurrentAge,
            currentAge,
            restrictions,
            onRestrictionsChange,
        },
    };
};
