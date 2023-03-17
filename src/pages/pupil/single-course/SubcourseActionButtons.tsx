import { ApolloQueryResult } from '@apollo/client';
import { Box, Button, Column, HStack, Modal, Row, Stack, Text, useBreakpointValue, useTheme, useToast, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Subcourse } from '../../../gql/graphql';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';
import SendParticipantsMessageModal from '../../../modals/SendParticipantsMessageModal';
import AlertMessage from '../../../widgets/AlertMessage';
import JoinMeeting from '../../subcourse/JoinMeeting';

type CanJoin = {
    allowed: boolean;
    reason: string;
};

type ActionButtonProps = {
    isParticipant: boolean;
    isOnWaitingList: boolean;
    isPublished: boolean;
    courseFull: boolean;
    canJoinSubcourse: CanJoin;
    joinedSubcourse: boolean;
    joinedWaitinglist: boolean;
    leftWaitinglist: boolean;
    loadingSubcourseJoined: boolean;
    loadingSubcourseLeft: boolean;
    loadingJoinedWaitinglist: boolean;
    loadingWaitinglistLeft: boolean;
    loadingContactInstructor: boolean;
    subcourse: Subcourse;
    joinSubcourse: () => Promise<any>;
    leaveSubcourse: () => void;
    joinWaitinglist: () => void;
    leaveWaitinglist: () => void;
    doContactInstructor: (title: string, body: string) => Promise<void>;
    refresh: () => Promise<ApolloQueryResult<void>>; //any
};

const SubcourseActionButtons: React.FC<ActionButtonProps> = ({
    isParticipant,
    isOnWaitingList,
    isPublished,
    courseFull,
    canJoinSubcourse,
    joinedSubcourse,
    joinedWaitinglist,
    leftWaitinglist,
    loadingSubcourseJoined,
    loadingSubcourseLeft,
    subcourse,
    loadingJoinedWaitinglist,
    loadingWaitinglistLeft,
    loadingContactInstructor,
    joinSubcourse,
    leaveSubcourse,
    joinWaitinglist,
    leaveWaitinglist,
    doContactInstructor,
    refresh,
}) => {
    const [isSignedInModal, setSignedInModal] = useState<boolean>(false);
    const [isSignedOutSureModal, setSignedOutSureModal] = useState<boolean>(false);
    const [isSignedOutModal, setSignedOutModal] = useState<boolean>(false);
    const [isOnWaitingListModal, setOnWaitingListModal] = useState<boolean>(false);
    const [isLeaveWaitingListModal, setLeaveWaitingListModal] = useState<boolean>(false);
    const [showMessageModal, setShowMessageModal] = useState<boolean>(false);

    const { t } = useTranslation();
    const { space } = useTheme();
    const { isMobile } = useLayoutHelper();

    const buttonWrap = useBreakpointValue({
        base: 'column',
        lg: 'row',
    });

    async function contactInstructor(title: string, body: string) {
        doContactInstructor(title, body);
        setShowMessageModal(false);
    }

    useEffect(() => {
        if (joinedSubcourse) {
            setSignedInModal(true);
        }
    }, [joinedSubcourse]);

    useEffect(() => {
        if (leftWaitinglist) {
            setLeaveWaitingListModal(true);
        }
    }, [leftWaitinglist]);

    useEffect(() => {
        if (joinedWaitinglist) {
            setOnWaitingListModal(true);
        }
    }, [joinedWaitinglist]);

    return (
        <>
            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? space['1'] : space['2']}>
                {!isParticipant && canJoinSubcourse?.allowed && (
                    <Button onPress={joinSubcourse} isDisabled={loadingSubcourseJoined}>
                        {t('signin')}
                    </Button>
                )}

                {isParticipant && (
                    <Button onPress={() => setSignedOutSureModal(true)} isDisabled={loadingSubcourseLeft}>
                        {t('single.actions.leaveSubcourse')}
                    </Button>
                )}
                {!isParticipant && courseFull && !isOnWaitingList && (
                    <Button
                        variant="outline"
                        onPress={() => {
                            joinWaitinglist();
                            setOnWaitingListModal(true);
                        }}
                        isDisabled={loadingJoinedWaitinglist}
                    >
                        {t('single.actions.joinWaitinglist')}
                    </Button>
                )}
                {isOnWaitingList && (
                    <Button
                        variant="outline"
                        onPress={() => {
                            leaveWaitinglist();
                            setLeaveWaitingListModal(true);
                        }}
                        isDisabled={loadingWaitinglistLeft}
                    >
                        {t('single.actions.leaveWaitinglist')}
                    </Button>
                )}
                {isParticipant && (
                    <Button variant="outline" onPress={() => setShowMessageModal(true)}>
                        {t('single.actions.contactInstructor')}
                    </Button>
                )}
                {isParticipant && isPublished && <JoinMeeting subcourse={subcourse} refresh={refresh} />}
            </Stack>
            <VStack>
                {/* {!isParticipant && !canJoinSubcourse?.allowed && (
                <AlertMessage content={t(`lernfair.reason.course.pupil.${canJoinSubcourse?.reason}` as unknown as TemplateStringsArray)} />
            )} */}
                {isParticipant && <AlertMessage content={t('single.card.alreadyRegistered')} />}
                {isOnWaitingList && <AlertMessage content={t('single.card.waitingListMember')} />}
                {/* <AlertMessage content={t('single.actions.startVideochat')} /> */}
            </VStack>

            {/* JOINED SUBCOURSE MODAL */}
            <Modal
                isOpen={isSignedInModal}
                onClose={() => {
                    setSignedInModal(false);
                    refresh();
                }}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du hast dich nun erfolgreich zum Kurs angemeldet.</Text>
                        <Row justifyContent="center">
                            <Column>
                                <Button
                                    onPress={() => {
                                        setSignedInModal(false);
                                        refresh();
                                    }}
                                >
                                    Fenster schließen
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            {/* SURE TO SIGNE OUT SUBCOURSE MODAL */}
            <Modal isOpen={isSignedOutSureModal} onClose={() => setSignedOutSureModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Kurseinformationen</Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>
                            Bist du sicher, dass du dich von diesem Kurs abmelden möchtest? Du kannst anschließend nicht mehr am Kurs teilnehmen.
                        </Text>
                        <Row space="3" flexDir={buttonWrap} justifyContent="flex-end">
                            <Column>
                                <Button
                                    height="100%"
                                    colorScheme="blueGray"
                                    variant="ghost"
                                    onPress={() => {
                                        setSignedOutSureModal(false);
                                    }}
                                >
                                    {t('cancel')}
                                </Button>
                            </Column>
                            <Column>
                                <Button
                                    onPress={() => {
                                        setSignedOutSureModal(false);
                                        leaveSubcourse();
                                        setSignedOutModal(true);
                                    }}
                                >
                                    Vom Kurs abmelden
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            {/* SIGNED OUT SUBCOURSE MODAL */}
            <Modal
                isOpen={isSignedOutModal}
                onClose={() => {
                    setSignedOutModal(false);
                    refresh();
                }}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Kurseinformationen</Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du hast dich nun erfolgreich vom Kurs abgemeldet.</Text>
                        <Row justifyContent="center">
                            <Column>
                                <Button
                                    onPress={() => {
                                        setSignedOutModal(false);
                                        refresh();
                                    }}
                                >
                                    Fenster schließen
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            {/* JOINED WAITINGLIST MODAL */}
            <Modal isOpen={isOnWaitingListModal} onClose={() => setOnWaitingListModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du bist auf der Warteliste!</Text>
                        <Row justifyContent="center">
                            <Column>
                                <Button
                                    onPress={() => {
                                        setOnWaitingListModal(false);
                                        refresh();
                                    }}
                                >
                                    Fenster schließen
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            {/* LEFT WAITINGLIST MODAL */}
            <Modal
                isOpen={isLeaveWaitingListModal}
                onClose={() => {
                    setLeaveWaitingListModal(false);
                    refresh();
                }}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <Text marginBottom={space['1']}>Du hast die Warteliste erfolgreich verlassen.</Text>
                        <Row justifyContent="center">
                            <Column>
                                <Button
                                    onPress={() => {
                                        setLeaveWaitingListModal(false);
                                        refresh();
                                    }}
                                >
                                    Fenster schließen
                                </Button>
                            </Column>
                        </Row>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            <SendParticipantsMessageModal
                isInstructor={false}
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                onSend={contactInstructor}
                isDisabled={loadingContactInstructor}
            />
        </>
    );
};

export default SubcourseActionButtons;
