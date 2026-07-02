import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GradeSelector } from '../../../components/GradeSelector';
import { CalendarPreferences, Language } from '@/gql/graphql';
import { Label } from '@/components/Label';
import { WeeklyAvailabilitySelector } from '@/components/availability/WeeklyAvailabilitySelector';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SchoolTypeSelector } from '@/components/SchoolTypeSelector';
import { Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { getGradeLabel } from '@/Utility';
import { useMatchRequestForm } from './useMatchRequestForm';
import { MatchRequestStep, MatchRequestStepDescription, MatchRequestStepTitle } from '@/components/match-request/MatchRequestStep';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/Accordion';
import { IconBulbFilled, IconCheck, IconChevronDown, IconPencil, IconSend } from '@tabler/icons-react';
import { Alert } from '@/components/Alert';

type ModalType = 'grade' | 'schoolType' | 'languages';

const UpdateData = () => {
    const { goBack, goNext, form, isLoading, onFormChange } = useMatchRequestForm();
    const { t } = useTranslation();
    const [modalType, setModalType] = useState<ModalType>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dialogContentRef = useRef<HTMLDivElement>(null);

    const getIsNextDisabled = () => {
        return { is: false, reason: '' };
    };

    const handleOnOpenModal = (type: ModalType) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const isLastStep = !form.needScreening;

    const getModalTitle = () => {
        switch (modalType) {
            case 'grade':
                return t('grade');
            case 'schoolType':
                return t('schoolType');
            case 'languages':
                return t('language');
            default:
                return '';
        }
    };

    return (
        <MatchRequestStep
            onBack={goBack}
            onNext={goNext}
            isNextDisabled={getIsNextDisabled().is || isLoading}
            reasonNextDisabled={getIsNextDisabled().reason}
            nextButtonText={isLastStep ? t('sendRequest') : t('saveAndContinue')}
            nextButtonIcon={isLastStep ? <IconSend size={20} /> : undefined}
        >
            <MatchRequestStepTitle variant="h4">{t('matching.wizard.pupil.profiledata.heading')}</MatchRequestStepTitle>
            <MatchRequestStepDescription>{t('matching.wizard.pupil.profiledata.text')}</MatchRequestStepDescription>
            <div className="flex flex-col gap-y-6">
                <div></div>
                <div className="flex flex-col flex-1 md:flex-row gap-x-5 gap-y-6">
                    <div className="flex flex-col gap-y-1 flex-1 min-w-0">
                        <Label>{t('profile.Languages.labelPupil')}</Label>
                        <Button
                            className="w-full"
                            variant="input"
                            size="input"
                            onClick={() => handleOnOpenModal('languages')}
                            rightIcon={<IconPencil size={20} />}
                        >
                            <div className="flex w-full items-center gap-x-2 min-w-0">
                                <span className="truncate leading-4">
                                    {form.languages
                                        .map((language) => t(`lernfair.languages.${language.toLowerCase()}` as unknown as TemplateStringsArray))
                                        .join(', ') || t('edit')}
                                </span>
                            </div>
                        </Button>
                    </div>
                    <div className="flex flex-col gap-y-1 flex-1 min-w-0">
                        <Label>{t('profile.Grade.label')}</Label>
                        <Button className="w-full" variant="input" size="input" onClick={() => handleOnOpenModal('grade')} rightIcon={<IconPencil size={20} />}>
                            <div className="w-full flex items-center gap-x-2">{form.grade ? getGradeLabel(form.grade) : t('edit')}</div>
                        </Button>
                    </div>
                    <div className="flex flex-col gap-y-1 flex-1 min-w-0">
                        <Label>{t('profile.SchoolType.label')}</Label>
                        <Button
                            className="w-full"
                            variant="input"
                            size="input"
                            onClick={() => handleOnOpenModal('schoolType')}
                            rightIcon={<IconPencil size={20} />}
                        >
                            <div className="w-full flex items-center gap-x-2">{form.schooltype ? t(`lernfair.schooltypes.${form.schooltype}`) : t('edit')}</div>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-y-2">
                    <Accordion type="single" collapsible className="w-full" defaultValue="availability">
                        <AccordionItem value="availability">
                            <AccordionTrigger IconComponent={IconChevronDown} iconClasses="w-[22px]" className="py-0 items-center justify-start gap-1">
                                <Label className="order-2 cursor-pointer">{t('profile.availability')}</Label>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 md:pt-4">
                                <WeeklyAvailabilitySelector
                                    onChange={(weeklyAvailability) =>
                                        onFormChange({ calendarPreferences: { ...form.calendarPreferences, weeklyAvailability } as CalendarPreferences })
                                    }
                                    availability={form.calendarPreferences?.weeklyAvailability}
                                    isLoading={isLoading}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Alert variant="indigo" className="" icon={<IconBulbFilled size={24} className=" text-indigo-500" />}>
                        <span className="leading-[18px]">
                            {form.userType === 'pupil'
                                ? t('matching.wizard.pupil.profiledata.availabilityBanner')
                                : t('matching.wizard.student.profile.availabilityBanner')}
                        </span>
                    </Alert>
                </div>
                <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size="lg" ref={dialogContentRef}>
                    <ModalHeader>
                        <ModalTitle>{getModalTitle()}</ModalTitle>
                    </ModalHeader>
                    <div className="flex justify-center">
                        <div className="flex flex-col gap-y-2 justify-center max-w-[576px]">
                            {modalType === 'schoolType' && (
                                <SchoolTypeSelector
                                    setValue={(schooltype) => onFormChange({ schooltype })}
                                    value={form.schooltype}
                                    className="flex flex-wrap justify-center"
                                    toggleConfig={{
                                        variant: 'outline-accent',
                                        className: 'justify-center w-auto font-semibold h-[40px] px-4',
                                    }}
                                />
                            )}
                            {modalType === 'grade' && (
                                <GradeSelector
                                    grade={form.grade}
                                    onGradeChange={(grade) => onFormChange({ grade })}
                                    className="flex flex-wrap justify-center"
                                    toggleConfig={{
                                        variant: 'outline-accent',
                                        className: 'justify-center w-auto font-semibold h-[40px] px-4',
                                    }}
                                />
                            )}
                            {modalType === 'languages' && (
                                <LanguageSelector
                                    maxVisibleItems={8}
                                    className="flex flex-wrap justify-center p-1"
                                    searchConfig={{
                                        containerClassName: 'w-full flex justify-center',
                                        className: 'bg-white border border-solid border border-accent-dark max-w-[190px]',
                                        placeholder: t('otherLanguages'),
                                        container: dialogContentRef.current || undefined,
                                    }}
                                    toggleConfig={{
                                        variant: 'outline-accent',
                                        size: 'lg',
                                        className: 'justify-center w-auto font-semibold h-[40px] [&_svg]:size-5 px-4',
                                    }}
                                    multiple
                                    value={form.languages as unknown as Language[]}
                                    setValue={(languages) => onFormChange({ languages })}
                                />
                            )}
                        </div>
                    </div>
                    <ModalFooter>
                        <Button
                            className="w-full md:w-fit"
                            leftIcon={<IconCheck />}
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
