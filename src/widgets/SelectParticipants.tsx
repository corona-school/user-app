import { Box, Button, Modal, Text, useBreakpointValue, useTheme } from 'native-base';
import { Participant } from '../gql/graphql';
import { useState } from 'react';

import EmailIcon from '../assets/icons/lernfair/ic_email.svg';
import { useTranslation } from 'react-i18next';

export function SelectParticipants({
    participants,
    selectedParticipants,
    setSelectedParticipants,
}: {
    participants: Pick<Participant, 'id' | 'firstname' | 'lastname'>[];
    selectedParticipants: number[];
    setSelectedParticipants(them: number[]): void;
}) {
    const { space } = useTheme();
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <>
            <Box display="flex" flexDirection="row" flexWrap="wrap" marginY={space['1']}>
                <EmailIcon width="50px" height="50px" viewBox="0 0 100 100" />
                <Text fontWeight="bold" flexGrow="1" lineHeight="50px" paddingLeft="20px">
                    An {selectedParticipants.length === 0 && 'alle Teilnehmer:innen'}
                    {selectedParticipants.length !== 0 && selectedParticipants.map((it) => participants.find((p) => p.id === it)?.firstname).join(', ')}
                </Text>
                <Button variant="outline" onPress={() => setOpen(true)}>
                    {t('course.select_participant')}
                </Button>
            </Box>
            <Modal isOpen={open}>
                <Modal.Content maxWidth="800px">
                    <Modal.Header>{t('course.select_participant')}</Modal.Header>
                    <Modal.Body>
                        <Box display="flex" flexDirection="row" flexWrap="wrap">
                            {participants.map((participant) => {
                                const isSelected = selectedParticipants.includes(participant.id);
                                const toggle = () =>
                                    setSelectedParticipants(
                                        isSelected ? selectedParticipants.filter((it) => it !== participant.id) : [...selectedParticipants, participant.id]
                                    );
                                return (
                                    <Box margin={space['1']}>
                                        <Button
                                            variant={isSelected ? 'solid' : 'outline'}
                                            onPress={toggle}
                                        >{`${participant.firstname} ${participant.lastname}`}</Button>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onPress={() => setOpen(false)}>{t('select')}</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
}
