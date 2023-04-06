import { gql } from './../../../gql';
import { useMutation } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { Text, VStack, useTheme, Heading, Row, Column, Modal, Button, useToast, Box } from 'native-base';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CSSWrapper from '../../../components/CSSWrapper';
import { StudentState, Student_State_Enum } from '../../../gql/graphql';
import { states } from '../../../types/lernfair/State';
import IconTagList from '../../../widgets/IconTagList';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import ProfileSettingItem from '../../../widgets/ProfileSettingItem';
import { RequestMatchContext } from './RequestMatch';

const UpdateData = ({ state, refetchQuery }: { state?: Student_State_Enum | null; refetchQuery: DocumentNode }) => {
    const { setCurrentIndex } = useContext(RequestMatchContext);
    const { space } = useTheme();
    const { t } = useTranslation();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [showModal, setShowModal] = useState<boolean>();
    const [modalType, setModalType] = useState<'states'>();
    const [modalSelection, setModalSelection] = useState<Student_State_Enum>();

    const [meUpdateState] = useMutation(
        gql(`
            mutation changeStudentStateData($data: StudentState!) {
                meUpdate(update: { student: { state: $data } })
            }
        `),
        { refetchQueries: [refetchQuery] }
    );

    const listItems = useMemo(() => {
        switch (modalType) {
            case 'states':
                return states;
            default:
                return [];
        }
    }, [modalType]);

    const data = useMemo(() => {
        switch (modalType) {
            case 'states':
                return state;
        }
    }, [modalType, state]);

    useEffect(() => {
        if (!data) {
            return;
        }
        setModalSelection(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalType]);

    const changeData = useCallback(async () => {
        if (!modalSelection) return;
        setIsLoading(true);
        try {
            switch (modalType) {
                case 'states':
                    await meUpdateState({ variables: { data: modalSelection as unknown as StudentState } });
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
    }, [meUpdateState, modalSelection, modalType, t, toast]);

    return (
        <>
            <VStack space={space['0.5']}>
                <Heading fontSize="2xl">Profil aktualisieren</Heading>
                <Text>
                    Damit wir dir eine:n optimale:n Lernpartner:in zuteilen können, bitten wir dich deine persönlichen Informationen noch einmal zu überprüfen
                    und zu vervollständigen.
                </Text>
                <Heading>Persönliche Daten</Heading>

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

                {/*                      1 = subjects */}
                <NextPrevButtons onPressNext={() => setCurrentIndex(1)} onlyNext />
            </VStack>
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setModalSelection(undefined);
                }}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Ändern</Modal.Header>
                    <Modal.Body>
                        <Row flexWrap="wrap">
                            {listItems.map((item: { label: string; key: string }) => (
                                <Column mb={space['1']} mr={space['1']}>
                                    <IconTagList
                                        initial={modalSelection === item.key}
                                        text={item.label}
                                        onPress={() => setModalSelection(item.key as unknown as Student_State_Enum)}
                                        iconPath={`${modalType}/icon_${item.key}.svg`}
                                    />
                                </Column>
                            ))}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button isDisabled={data === modalSelection || isLoading} onPress={changeData}>
                            Ändern
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
};
export default UpdateData;
