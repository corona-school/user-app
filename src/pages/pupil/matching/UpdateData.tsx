import { gql, useMutation } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { Text, VStack, useTheme, Heading, Row, Column, Modal, useToast } from 'native-base';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CSSWrapper from '../../../components/CSSWrapper';
import { schooltypes } from '../../../types/lernfair/SchoolType';
import { states } from '../../../types/lernfair/State';
import IconTagList from '../../../widgets/IconTagList';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import ProfileSettingItem from '../../../widgets/ProfileSettingItem';
import { RequestMatchContext } from './RequestMatch';
import DisableableButton from '../../../components/DisablebleButton';

type Props = {
    schooltype: string;
    gradeAsInt: number;
    state: string;
    refetchQuery: DocumentNode;
};

const UpdateData: React.FC<Props> = ({ schooltype, gradeAsInt, state, refetchQuery }) => {
    const { setCurrentIndex, isEdit } = useContext(RequestMatchContext);
    const { space } = useTheme();
    const { t } = useTranslation();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [showModal, setShowModal] = useState<boolean>();
    const [modalType, setModalType] = useState<'schooltypes' | 'schoolclass' | 'states'>();
    const [modalSelection, setModalSelection] = useState<string>();

    const [meUpdateSchooltype] = useMutation(
        gql`
            mutation changeSchooltypeData($data: SchoolType!) {
                meUpdate(update: { pupil: { schooltype: $data } })
            }
        `,
        { refetchQueries: [refetchQuery] }
    );
    const [meUpdateSchoolClass] = useMutation(
        gql`
            mutation changeSchoolClassData($data: Int!) {
                meUpdate(update: { pupil: { gradeAsInt: $data } })
            }
        `,
        { refetchQueries: [refetchQuery] }
    );
    const [meUpdateState] = useMutation(
        gql`
            mutation changePupilStateData($data: State!) {
                meUpdate(update: { pupil: { state: $data } })
            }
        `,
        { refetchQueries: [refetchQuery] }
    );

    const listItems = useMemo(() => {
        switch (modalType) {
            case 'schooltypes':
                return schooltypes;
            case 'schoolclass':
                return Array.from({ length: 13 }, (_, i) => ({
                    label: `${i + 1}. Klasse`,
                    key: `${i + 1}`,
                }));
            case 'states':
                return states;
            default:
                return [];
        }
    }, [modalType]);

    const data = useMemo(() => {
        switch (modalType) {
            case 'schooltypes':
                return schooltype;

            case 'schoolclass':
                return `${gradeAsInt}`;
            case 'states':
                return state;
            default:
                return schooltype;
        }
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
                        variables: { data: modalSelection },
                    });
                    break;
                case 'schoolclass':
                    await meUpdateSchoolClass({
                        variables: { data: parseInt(modalSelection) },
                    });
                    break;
                case 'states':
                    await meUpdateState({ variables: { data: modalSelection } });
                    break;
                default:
                    break;
            }
            toast.show({ description: t('matching.request.updateData'), placement: 'top' });
        } catch (e) {
            toast.show({ description: t('error'), placement: 'top' });
        }
        setShowModal(false);
        setIsLoading(false);
    }, [meUpdateSchoolClass, meUpdateSchooltype, meUpdateState, modalSelection, modalType, t, toast]);

    return (
        <>
            <VStack space={space['0.5']}>
                <Heading fontSize="2xl">{t('matching.wizard.pupil.profiledata.heading')}</Heading>

                <Text>{t('matching.wizard.pupil.profiledata.text')}</Text>

                <Heading>{t('matching.wizard.pupil.profiledata.subheading')}</Heading>

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
                                    <IconTagList
                                        isDisabled
                                        textIcon={`${gradeAsInt}`}
                                        text={t('lernfair.schoolclass', {
                                            class: gradeAsInt,
                                        })}
                                    />
                                </CSSWrapper>
                            </Column>
                        )) || <Text>{t('profile.Notice.noSchoolGrade')}</Text>}
                    </Row>
                </ProfileSettingItem>

                <ProfileSettingItem
                    title={t('profile.State.label')}
                    href={() => {
                        setModalType('states');
                        setShowModal(true);
                    }}
                >
                    <Row flexWrap="wrap" w="100%">
                        {(state && (
                            <Column marginRight={3} mb={space['0.5']}>
                                {(state && (
                                    <CSSWrapper className="profil-tab-link">
                                        <IconTagList
                                            isDisabled
                                            iconPath={`states/icon_${state}.svg`}
                                            text={t(`lernfair.states.${state}` as unknown as TemplateStringsArray)}
                                        />
                                    </CSSWrapper>
                                )) || <Text>{t('profile.noInfo')}</Text>}
                            </Column>
                        )) || <Text>{t('profile.Notice.noState')}</Text>}
                    </Row>
                </ProfileSettingItem>

                <NextPrevButtons
                    disablingNext={{ is: isLoading, reason: t('reasonsDisabled.loading') }}
                    disablingPrev={{ is: isLoading, reason: t('reasonsDisabled.loading') }}
                    onPressNext={() => setCurrentIndex(2)}
                    onPressPrev={() => setCurrentIndex(0)}
                    onlyNext={isEdit}
                />
            </VStack>
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setModalSelection('');
                }}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>{t('change')}</Modal.Header>
                    <Modal.Body>
                        <Row flexWrap="wrap">
                            {listItems.map((item: { label: string; key: string }) => (
                                <Column mb={space['1']} mr={space['1']}>
                                    <IconTagList
                                        initial={modalSelection === item.key}
                                        text={item.label}
                                        onPress={() => setModalSelection(item.key)}
                                        iconPath={(modalType !== 'schoolclass' && `${modalType}/icon_${item.key}.svg`) || ''}
                                        textIcon={(modalType === 'schoolclass' && `${item.key}`) || ''}
                                    />
                                </Column>
                            ))}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <DisableableButton
                            isDisabled={data === modalSelection || isLoading}
                            reasonDisabled={isLoading ? t('reasonsDisabled.loading') : t('reasonsDisabled.newFieldSameAsOld')}
                            onPress={changeData}
                        >
                            {t('change')}
                        </DisableableButton>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
};
export default UpdateData;
