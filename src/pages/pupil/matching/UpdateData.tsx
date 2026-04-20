import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GradeIcon, GradeSelector } from '../../../components/GradeSelector';
import { CalendarPreferences, Language } from '@/gql/graphql';
import { Label } from '@/components/Label';
import { WeeklyAvailabilitySelector } from '@/components/availability/WeeklyAvailabilitySelector';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SchoolTypeSelector } from '@/components/SchoolTypeSelector';
import { Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { getGradeLabel } from '@/Utility';
import { IconLoader } from '@/components/IconLoader';
import { useMatchRequestForm } from './useMatchRequestForm';
import { MatchRequestStep, MatchRequestStepDescription, MatchRequestStepTitle } from '@/components/match-request/MatchRequestStep';

type ModalType = 'grade' | 'schoolType' | 'languages';

const UpdateData = () => {
    const { goNext, form, isLoading, onFormChange } = useMatchRequestForm();
    const { t } = useTranslation();
    const [modalType, setModalType] = useState<ModalType>();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        <MatchRequestStep onNext={goNext} isNextDisabled={getIsNextDisabled().is || isLoading} reasonNextDisabled={getIsNextDisabled().reason}>
            <MatchRequestStepTitle variant="h4">{t('matching.wizard.pupil.profiledata.heading')}</MatchRequestStepTitle>
            <MatchRequestStepDescription>{t('matching.wizard.pupil.profiledata.text')}</MatchRequestStepDescription>
            <div className="flex flex-col gap-y-6">
                <div></div>
                <div className="flex flex-col md:flex-row gap-x-5 gap-y-6 max-w-[500px]">
                    <div className="flex flex-col gap-y-1 w-full">
                        <Label>{t('profile.SchoolType.label')}</Label>
                        <Button className="w-full" variant="input" size="input" onClick={() => handleOnOpenModal('schoolType')}>
                            <div className="w-full flex items-center gap-x-2 min-w-[200px]">
                                {form.schooltype && <IconLoader iconPath={`schooltypes/icon_${form.schooltype}.svg`} />}
                                {form.schooltype ? t(`lernfair.schooltypes.${form.schooltype}`) : t('edit')}
                            </div>
                        </Button>
                    </div>
                    <div className="flex flex-col gap-y-1 w-full">
                        <Label>{t('grade')}</Label>
                        <Button className="w-full" variant="input" size="input" onClick={() => handleOnOpenModal('grade')}>
                            <div className="w-full flex items-center gap-x-2 min-w-[200px]">
                                {form.grade && <GradeIcon className="size-6" grade={form.grade} />}
                                {form.grade ? getGradeLabel(form.grade) : t('edit')}
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
                            value={form.languages as unknown as Language[]}
                            setValue={(languages) => onFormChange({ languages })}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-y-2">
                    <Label>{t('profile.availability')}</Label>
                    <WeeklyAvailabilitySelector
                        onChange={(weeklyAvailability) =>
                            onFormChange({ calendarPreferences: { ...form.calendarPreferences, weeklyAvailability } as CalendarPreferences })
                        }
                        availability={form.calendarPreferences?.weeklyAvailability}
                        isLoading={isLoading}
                    />
                </div>
                <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                    <ModalHeader>
                        <ModalTitle>{t('change')}</ModalTitle>
                    </ModalHeader>
                    <div>
                        {modalType === 'schoolType' && (
                            <div className="flex flex-col gap-y-2">
                                <Label>{t('profile.SchoolType.label')}</Label>
                                <SchoolTypeSelector setValue={(schooltype) => onFormChange({ schooltype })} value={form.schooltype} />
                            </div>
                        )}
                        {modalType === 'grade' && (
                            <div className="flex flex-col gap-y-2">
                                <Label>{t('grade')}</Label>
                                <GradeSelector grade={form.grade} onGradeChange={(grade) => onFormChange({ grade })} />
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
        </MatchRequestStep>
    );
};
export default UpdateData;
