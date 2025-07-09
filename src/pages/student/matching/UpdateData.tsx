import { useMutation } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarPreferences, Language, StudentLanguage } from '@/gql/graphql';
import { gql } from '@/gql';
import { TextArea } from '@/components/TextArea';
import { Label } from '@/components/Label';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Typography } from '@/components/Typography';
import { WeeklyAvailabilitySelector } from '@/components/availability/WeeklyAvailabilitySelector';
import { NextPrevButtons } from '@/widgets/NextPrevButtons';
import { toast } from 'sonner';
import { logError } from '@/log';

const ME_UPDATE_MUTATION = gql(`
    mutation changeStudentStateData($aboutMe: String!, $languages: [StudentLanguage!], $calendarPreferences: CalendarPreferences!) {
        meUpdate(update: { student: { aboutMe: $aboutMe, languages: $languages, calendarPreferences: $calendarPreferences } })
    }
`);

interface UpdateDataProps {
    refetchQuery: DocumentNode;
    profile?: {
        languages?: Language[];
        calendarPreferences?: CalendarPreferences;
        aboutMe?: string;
    };
    onNext: () => void;
    onBack: () => void;
}

const UpdateData = ({ refetchQuery, profile, onNext, onBack }: UpdateDataProps) => {
    const { t } = useTranslation();
    const isLoading = !profile;
    const [aboutMe, setAboutMe] = useState(profile?.aboutMe ?? '');
    const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(profile?.languages ?? []);
    const [calendarPreferences, setCalendarPreferences] = useState<CalendarPreferences | undefined>(profile?.calendarPreferences);

    const [meUpdateState, { loading: isUpdating }] = useMutation(ME_UPDATE_MUTATION, { refetchQueries: [refetchQuery] });

    useEffect(() => {
        if (isLoading) return;

        if (profile?.aboutMe !== undefined) setAboutMe(profile?.aboutMe);
        if (profile?.languages) setSelectedLanguages(profile.languages);
        if (profile?.calendarPreferences) setCalendarPreferences(profile?.calendarPreferences);
    }, [profile, isLoading]);

    const getIsNextDisabled = () => {
        const availabilitySlots = Object.values(calendarPreferences?.weeklyAvailability ?? {}).some((e) => !!e.length);
        if (!isLoading && !availabilitySlots) {
            return {
                is: true,
                reason: t('matching.wizard.student.profile.availabilityRequirement'),
            };
        }
        return { is: false, reason: '' };
    };

    const handleOnNext = async () => {
        if (!calendarPreferences) {
            return;
        }
        try {
            await meUpdateState({ variables: { aboutMe: aboutMe ?? '', languages: selectedLanguages as unknown as StudentLanguage[], calendarPreferences } });
            toast.success(t('changesWereSaved'));
            onNext();
        } catch (error: any) {
            logError('[matchRequest]', error?.message, error);
            toast.error(t('error'));
        }
    };

    return (
        <div className="flex flex-col gap-y-6">
            <div>
                <Typography variant="h4">{t('matching.wizard.student.profile.title')}</Typography>
                <Typography className="mb-2">{t('matching.wizard.student.profile.subtitle')}</Typography>
            </div>
            <div className="flex flex-col gap-y-1">
                <Label htmlFor="aboutMe">{t('profile.AboutMe.label')}</Label>
                <TextArea className="resize-none h-20 w-full" id="aboutMe" value={aboutMe} onChangeText={setAboutMe} />
            </div>
            <div className="flex flex-col gap-y-1">
                <Label>{t('profile.Languages.labelStudent')}</Label>
                <LanguageSelector multiple value={selectedLanguages} setValue={setSelectedLanguages} />
            </div>
            <div className="flex flex-col gap-y-2">
                <Label>{t('profile.availability')}*</Label>
                <WeeklyAvailabilitySelector
                    onChange={(weeklyAvailability) => setCalendarPreferences({ ...calendarPreferences, weeklyAvailability })}
                    availability={calendarPreferences?.weeklyAvailability}
                    isLoading={isLoading}
                />
            </div>
            <NextPrevButtons isLoading={isUpdating} onlyNext disablingNext={getIsNextDisabled()} onPressPrev={onBack} onPressNext={handleOnNext} />
        </div>
    );
};
export default UpdateData;
