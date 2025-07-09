import { gql } from '@/gql';
import { DocumentNode } from 'graphql';
import { Text, VStack, useTheme, Heading, Row, Column } from 'native-base';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CSSWrapper from '../../../components/CSSWrapper';
import { schooltypes } from '../../../types/lernfair/SchoolType';
import IconTagList from '../../../widgets/IconTagList';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import ProfileSettingItem from '../../../widgets/ProfileSettingItem';
import { RequestMatchContext, RequestMatchStep } from './RequestMatch';
import { GradeSelector, GradeTag } from '../../../components/GradeSelector';
import { useMutation } from '@apollo/client';
import { CalendarPreferences, Language, SchoolType, State } from '@/gql/graphql';
import { Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { WeeklyAvailabilitySelector } from '@/components/availability/WeeklyAvailabilitySelector';
import { toast } from 'sonner';
import { logError } from '@/log';
import { LanguageSelector } from '@/components/LanguageSelector';

type Props = {
    schooltype: string;
    gradeAsInt: number;
    state: string;
    calendarPreferences?: CalendarPreferences;
    refetchQuery: DocumentNode;
    languages: Language[];
};

const ME_UPDATE_MUTATION = gql(`
    mutation changePupilMatchingInfoData($languages: [Language!], $calendarPreferences: CalendarPreferences) {
        meUpdate(update: { pupil: { languages: $languages, calendarPreferences: $calendarPreferences } })
    }
`);

const UpdateData: React.FC<Props> = ({ schooltype, gradeAsInt, state, calendarPreferences, refetchQuery, languages }) => {
    const { setCurrentStep } = useContext(RequestMatchContext);
    const { space } = useTheme();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [meUpdate, { loading: isUpdating }] = useMutation(ME_UPDATE_MUTATION, { refetchQueries: [refetchQuery] });
    const [newCalendarPreferences, setNewCalendarPreferences] = useState<CalendarPreferences | undefined>(calendarPreferences);
    const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(languages ?? []);

    const [showModal, setShowModal] = useState<boolean>();
    const [modalType, setModalType] = useState<'schooltypes' | 'schoolclass' | 'states'>();
    const [modalSelection, setModalSelection] = useState<string>();

    const [meUpdateSchooltype] = useMutation(
        gql(`
            mutation changeSchooltypeData($data: SchoolType!) {
                meUpdate(update: { pupil: { schooltype: $data } })
            }
        `),
        { refetchQueries: [refetchQuery] }
    );
    const [meUpdateSchoolClass] = useMutation(
        gql(`
            mutation changeSchoolClassData($data: Int!) {
                meUpdate(update: { pupil: { gradeAsInt: $data } })
            }
        `),
        { refetchQueries: [refetchQuery] }
    );
    const [meUpdateState] = useMutation(
        gql(`
            mutation changePupilStateData($data: State!) {
                meUpdate(update: { pupil: { state: $data } })
            }
        `),
        { refetchQueries: [refetchQuery] }
    );

    const listItems = useMemo(() => {
        switch (modalType) {
            case 'schooltypes':
                return schooltypes;
            default:
                return [];
        }
    }, [modalType]);

    const data = useMemo(() => {
        switch (modalType) {
            case 'schooltypes':
                return schooltype;
            case 'states':
                return state;
            default:
                return schooltype;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalType, gradeAsInt, schooltype, state]);

    useEffect(() => {
        setModalSelection(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalType]);

    const changeData = useCallback(async () => {
        if (!modalSelection) return;
        setIsLoading(true);
        try {
            switch (modalType) {
                case 'schooltypes':
                    await meUpdateSchooltype({
                        variables: { data: modalSelection as SchoolType },
                    });
                    break;
                case 'schoolclass':
                    await meUpdateSchoolClass({
                        variables: { data: parseInt(modalSelection) },
                    });
                    break;
                case 'states':
                    await meUpdateState({ variables: { data: modalSelection as State } });
                    break;
                default:
                    break;
            }
            toast.success(t('matching.request.updateData'));
        } catch (e) {
            toast.error(t('error'));
        }
        setShowModal(false);
        setIsLoading(false);
    }, [meUpdateSchoolClass, meUpdateSchooltype, meUpdateState, modalSelection, modalType, t]);

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

    return (
        <>
            <VStack space={space['0.5']}>
                <Heading fontSize="2xl">{t('matching.wizard.pupil.profiledata.heading')}</Heading>

                <Text>{t('matching.wizard.pupil.profiledata.text')}</Text>

                <Heading>{t('matching.wizard.pupil.profiledata.subheading')}</Heading>
                <div className="flex flex-col gap-y-6">
                    <ProfileSettingItem
                        title={t('profile.SchoolType.label')}
                        href={() => {
                            setModalType('schooltypes');
                            setShowModal(true);
                        }}
                    >
                        <Row flexWrap="wrap" w="100%">
                            {(schooltype && (
                                <Column marginRight={3} mb={space['0.5']}>
                                    <CSSWrapper className="profil-tab-link">
                                        <IconTagList
                                            isDisabled
                                            iconPath={`schooltypes/icon_${schooltype}.svg`}
                                            text={t(`lernfair.schooltypes.${schooltype}` as unknown as TemplateStringsArray)}
                                        />
                                    </CSSWrapper>
                                </Column>
                            )) || <Text>{t('profile.Notice.noSchoolType')}</Text>}
                        </Row>
                    </ProfileSettingItem>
                    <ProfileSettingItem
                        title={t('profile.SchoolClass.label')}
                        href={() => {
                            setModalType('schoolclass');
                            setShowModal(true);
                        }}
                    >
                        <Row flexWrap="wrap" w="100%">
                            {(gradeAsInt && (
                                <Column marginRight={3} mb={space['0.5']}>
                                    <CSSWrapper className="profil-tab-link">
                                        <GradeTag grade={gradeAsInt} />
                                    </CSSWrapper>
                                </Column>
                            )) || <Text>{t('profile.Notice.noSchoolGrade')}</Text>}
                        </Row>
                    </ProfileSettingItem>
                    <div className="flex flex-col gap-y-1">
                        <Label>{t('profile.Languages.labelPupil')}</Label>
                        <LanguageSelector multiple value={selectedLanguages} setValue={setSelectedLanguages} />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>{t('profile.availability')}</Label>
                        <WeeklyAvailabilitySelector
                            onChange={(weeklyAvailability) => setNewCalendarPreferences({ ...newCalendarPreferences, weeklyAvailability })}
                            availability={newCalendarPreferences?.weeklyAvailability}
                            isLoading={isLoading}
                        />
                    </div>
                    <NextPrevButtons disablingNext={getIsNextDisabled()} isLoading={isLoading} onPressNext={handleOnNext} onlyNext />
                </div>
            </VStack>
            <Modal
                isOpen={!!showModal}
                onOpenChange={(value) => {
                    setShowModal(value);
                    setModalSelection('');
                }}
                className="max-h-[90%]"
            >
                <ModalHeader>
                    <ModalTitle>{t('change')}</ModalTitle>
                </ModalHeader>
                <div className="flex overflow-auto">
                    {modalType === 'schoolclass' ? (
                        <GradeSelector grade={Number(modalSelection)} onGradeChange={(newGrade) => setModalSelection(`${newGrade}`)} />
                    ) : (
                        <div className="flex flex-wrap gap-3 max-h-[500px]">
                            {listItems.map((item: { label: string; key: string }) => (
                                <IconTagList
                                    initial={modalSelection === item.key}
                                    text={item.label}
                                    onPress={() => setModalSelection(item.key)}
                                    iconPath={`${modalType}/icon_${item.key}.svg`}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <ModalFooter>
                    <Button
                        className="w-full lg:w-fit"
                        reasonDisabled={isLoading ? t('reasonsDisabled.loading') : t('reasonsDisabled.newFieldSameAsOld')}
                        disabled={data === modalSelection || isLoading}
                        isLoading={isLoading || isUpdating}
                        onClick={changeData}
                    >
                        {t('change')}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};
export default UpdateData;
