import { useMutation } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarPreferences, Language, StudentLanguage } from '@/gql/graphql';
import { gql } from '@/gql';
import { Label } from '@/components/Label';
import { LanguageIcon, LanguageSelector } from '@/components/LanguageSelector';
import { Typography } from '@/components/Typography';
import { WeeklyAvailabilitySelector } from '@/components/availability/WeeklyAvailabilitySelector';
import { NextPrevButtons } from '@/widgets/NextPrevButtons';
import { toast } from 'sonner';
import { logError } from '@/log';
import { Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { asTranslationKey } from '@/helper/string-helper';

const ME_UPDATE_MUTATION = gql(`
    mutation changeStudentStateData($languages: [StudentLanguage!], $calendarPreferences: CalendarPreferences) {
        meUpdate(update: { student: { languages: $languages, calendarPreferences: $calendarPreferences } })
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

type ModalType = 'languages';

const UpdateData = ({ refetchQuery, profile, onNext, onBack }: UpdateDataProps) => {
    const { t } = useTranslation();
    const isLoading = !profile;
    const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(profile?.languages ?? []);
    const [calendarPreferences, setCalendarPreferences] = useState<CalendarPreferences | undefined>(profile?.calendarPreferences);
    const [modalType, setModalType] = useState<ModalType>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [meUpdate, { loading: isUpdating }] = useMutation(ME_UPDATE_MUTATION, { refetchQueries: [refetchQuery] });

    useEffect(() => {
        if (isLoading) return;

        if (profile?.languages) setSelectedLanguages(profile.languages);
        if (profile?.calendarPreferences) setCalendarPreferences(profile?.calendarPreferences);
    }, [profile, isLoading]);

    const getIsNextDisabled = () => {
        // const availabilitySlots = Object.values(calendarPreferences?.weeklyAvailability ?? {}).some((e) => !!e.length);
        // if (!isLoading && !availabilitySlots) {
        //     return {
        //         is: true,
        //         reason: t('matching.wizard.student.profile.availabilityRequirement'),
        //     };
        // }
        return { is: false, reason: '' };
    };

    const handleOnNext = async () => {
        try {
            await meUpdate({ variables: { languages: selectedLanguages as unknown as StudentLanguage[], calendarPreferences } });
            toast.success(t('changesWereSaved'));
            onNext();
        } catch (error: any) {
            logError('[matchRequest]', error?.message, error);
            toast.error(t('error'));
        }
    };

    const handleOnOpenModal = (type: ModalType) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-y-6">
            <div>
                <Typography variant="h4">{t('matching.wizard.student.profile.title')}</Typography>
                <Typography className="mb-2">{t('matching.wizard.student.profile.subtitle')}</Typography>
            </div>
            <div className="flex flex-col gap-y-1 max-w-[500px] overflow-hidden w-full">
                <Label>{t('profile.Languages.labelStudent')}</Label>
                <Button className="w-full h-auto py-2 min-h-10" variant="input" size="input" onClick={() => handleOnOpenModal('languages')}>
                    <div className="w-full flex items-center gap-x-4 min-w-[200px] flex-wrap gap-y-4">
                        {!selectedLanguages && t('edit')}
                        {selectedLanguages.map((e) => (
                            <span className="flex items-center gap-x-1">
                                <LanguageIcon className="size-4" languageName={e} />
                                {t(asTranslationKey(`lernfair.languages.${e.toLowerCase()}`))}
                            </span>
                        ))}
                    </div>
                </Button>
            </div>
            <div className="flex flex-col gap-y-2">
                <Label>{t('profile.availability')}</Label>
                <WeeklyAvailabilitySelector
                    onChange={(weeklyAvailability) => setCalendarPreferences({ ...calendarPreferences, weeklyAvailability })}
                    availability={calendarPreferences?.weeklyAvailability}
                    isLoading={isLoading}
                />
            </div>
            <NextPrevButtons isLoading={isUpdating} onlyNext disablingNext={getIsNextDisabled()} onPressPrev={onBack} onPressNext={handleOnNext} />
            <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                <ModalHeader>
                    <ModalTitle>{t('change')}</ModalTitle>
                </ModalHeader>
                <div>
                    {modalType === 'languages' && (
                        <div className="flex flex-col gap-y-2">
                            <Label>{t('profile.Languages.labelStudent')}</Label>
                            <LanguageSelector multiple value={selectedLanguages} setValue={setSelectedLanguages} />
                        </div>
                    )}
                </div>
                <ModalFooter>
                    <Button
                        className="w-full lg:w-fit"
                        variant="outline"
                        onClick={() => {
                            setIsModalOpen(false);
                        }}
                    >
                        {t('done')}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};
export default UpdateData;
