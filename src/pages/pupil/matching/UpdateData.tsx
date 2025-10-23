import { gql } from '@/gql';
import { DocumentNode } from 'graphql';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import { RequestMatchContext, RequestMatchStep } from './RequestMatch';
import { GradeIcon, GradeSelector } from '../../../components/GradeSelector';
import { useMutation } from '@apollo/client';
import { CalendarPreferences, Language, SchoolType } from '@/gql/graphql';
import { Label } from '@/components/Label';
import { WeeklyAvailabilitySelector } from '@/components/availability/WeeklyAvailabilitySelector';
import { toast } from 'sonner';
import { logError } from '@/log';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SchoolTypeSelector } from '@/components/SchoolTypeSelector';
import { Typography } from '@/components/Typography';
import { Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { getGradeLabel } from '@/Utility';
import { IconLoader } from '@/components/IconLoader';

type Props = {
    refetchQuery: DocumentNode;
    profile?: {
        languages?: Language[];
        schooltype?: SchoolType;
        gradeAsInt?: number | null;
        calendarPreferences?: CalendarPreferences;
    };
};

const ME_UPDATE_MUTATION = gql(`
    mutation changePupilMatchingInfoData($languages: [Language!], $calendarPreferences: CalendarPreferences) {
        meUpdate(update: { pupil: { languages: $languages, calendarPreferences: $calendarPreferences } })
    }
`);

type ModalType = 'grade' | 'schoolType' | 'languages';

const UpdateData: React.FC<Props> = ({ refetchQuery, profile }) => {
    const { setCurrentStep } = useContext(RequestMatchContext);
    const { t } = useTranslation();
    const [meUpdate, { loading: isUpdating }] = useMutation(ME_UPDATE_MUTATION, { refetchQueries: [refetchQuery] });
    const [newCalendarPreferences, setNewCalendarPreferences] = useState<CalendarPreferences | undefined>(profile?.calendarPreferences);
    const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(profile?.languages ?? []);
    const [grade, setGrade] = useState(profile?.gradeAsInt);
    const [schoolType, setSchoolType] = useState<SchoolType | undefined>(profile?.schooltype);
    const [modalType, setModalType] = useState<ModalType>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isLoading = !profile;

    const handleOnNext = async () => {
        try {
            await meUpdate({ variables: { calendarPreferences: newCalendarPreferences, languages: selectedLanguages } });
            toast.success(t('changesWereSaved'));
            setCurrentStep(RequestMatchStep.german);
        } catch (error: any) {
            logError('[matchRequest]', error?.message, error);
            toast.error(t('error'));
        }
    };

    const getIsNextDisabled = () => {
        // const availabilitySlots = Object.values(newCalendarPreferences?.weeklyAvailability ?? {}).some((e) => !!e.length);
        // if (!isLoading && !availabilitySlots) {
        //     return {
        //         is: true,
        //         reason: t('matching.wizard.student.profile.availabilityRequirement'),
        //     };
        // }
        return { is: false, reason: '' };
    };

    const handleOnOpenModal = (type: ModalType) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-y-6">
            <div>
                <Typography variant="h4">{t('matching.wizard.pupil.profiledata.heading')}</Typography>
                <Typography className="mb-2">{t('matching.wizard.pupil.profiledata.text')}</Typography>
            </div>
            <div className="flex flex-col md:flex-row gap-x-5 gap-y-6 max-w-[500px]">
                <div className="flex flex-col gap-y-1 w-full">
                    <Label>{t('profile.SchoolType.label')}</Label>
                    <Button className="w-full" variant="input" size="input" onClick={() => handleOnOpenModal('schoolType')}>
                        <div className="w-full flex items-center gap-x-2 min-w-[200px]">
                            {schoolType && <IconLoader iconPath={`schooltypes/icon_${schoolType}.svg`} />}
                            {schoolType ? t(`lernfair.schooltypes.${schoolType}`) : t('edit')}
                        </div>
                    </Button>
                </div>
                <div className="flex flex-col gap-y-1 w-full">
                    <Label>{t('grade')}</Label>
                    <Button className="w-full" variant="input" size="input" onClick={() => handleOnOpenModal('grade')}>
                        <div className="w-full flex items-center gap-x-2 min-w-[200px]">
                            {grade && <GradeIcon className="size-6" grade={grade} />}
                            {grade ? getGradeLabel(grade) : t('edit')}
                        </div>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-y-1 max-w-[500px] overflow-hidden w-full">
                <div className="flex flex-col gap-y-2">
                    <Label>{t('profile.Languages.labelPupil')}</Label>
                    <LanguageSelector
                        maxVisibleItems={8}
                        className="flex flex-wrap justify-center p-1"
                        searchConfig={{
                            containerClassName: 'w-full',
                            className: 'bg-white',
                            placeholder: t('otherLanguages'),
                        }}
                        toggleConfig={{
                            variant: 'outline',
                            size: 'lg',
                            className: 'justify-start w-[48%] md:w-[49%] font-semibold h-[48px]',
                        }}
                        multiple
                        value={selectedLanguages}
                        setValue={setSelectedLanguages}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-y-2">
                <Label>{t('profile.availability')}</Label>
                <WeeklyAvailabilitySelector
                    onChange={(weeklyAvailability) => setNewCalendarPreferences({ ...newCalendarPreferences, weeklyAvailability })}
                    availability={newCalendarPreferences?.weeklyAvailability}
                    isLoading={isLoading}
                />
            </div>
            <NextPrevButtons
                altNextText={t('saveSelection')}
                disablingNext={getIsNextDisabled()}
                isLoading={isLoading || isUpdating}
                onPressNext={handleOnNext}
                onlyNext
            />
            <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                <ModalHeader>
                    <ModalTitle>{t('change')}</ModalTitle>
                </ModalHeader>
                <div>
                    {modalType === 'schoolType' && (
                        <div className="flex flex-col gap-y-2">
                            <Label>{t('profile.SchoolType.label')}</Label>
                            <SchoolTypeSelector setValue={setSchoolType} value={schoolType} />
                        </div>
                    )}
                    {modalType === 'grade' && (
                        <div className="flex flex-col gap-y-2">
                            <Label>{t('grade')}</Label>
                            <GradeSelector grade={grade} onGradeChange={setGrade} />
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
