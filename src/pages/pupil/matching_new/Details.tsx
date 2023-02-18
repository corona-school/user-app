import { gql } from './../../../gql';
import { useMutation } from '@apollo/client';
import { Text, VStack, Heading, Button, useTheme, TextArea, useToast, useBreakpointValue } from 'native-base';
import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useModal from '../../../hooks/useModal';
import { RequestMatchContext } from './RequestMatch';
import PartyIcon from '../../../assets/icons/lernfair/lf-party.svg';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';

type Props = {};

const Details: React.FC<Props> = () => {
    const { setShow, setContent, setVariant } = useModal();
    const { space, sizes } = useTheme();
    const toast = useToast();
    const { matchRequest, setMessage, setCurrentIndex, isEdit } = useContext(RequestMatchContext);
    const navigate = useNavigate();

    const [update, _update] = useMutation(
        gql(`
        mutation updatePupil($subjects: [SubjectInput!]) {
            meUpdate(update: { pupil: { subjects: $subjects } })
        }
    `)
    );

    const [createMatchRequest] = useMutation(
        gql(`
            mutation PupilCreateMatchRequest {
                pupilCreateMatchRequest
            }
        `)
    );

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const showModal = useCallback(() => {
        setVariant('dark');

        setContent(
            <VStack paddingX={space['2']} paddingTop={space['2']} space={space['1']} alignItems="center">
                <PartyIcon />
                <Heading fontSize={'2xl'} color="lightText" textAlign="center">
                    {(!isEdit && 'Geschafft, du bist auf der Warteliste!') || 'Geschafft, Änderungen gespeichert!'}
                </Heading>
                <Text color="lightText" textAlign="center">
                    {(!isEdit &&
                        'Danke für deine Anfrage. Du bist jetzt auf unserer Warteliste. Voraussichtlich musst du 3-6 Monate warten. Wenn du an der Reihe bist, werden wir dich per E-Mail informieren. Bis dahin kannst du gerne an unseren Kursen in der Gruppen-Nachhilfe teilnehmen. Solltest du Fragen haben, kannst du dich jederzeit bei uns melden.') ||
                        'Deine Änderungen wurden gespeichert. Dadurch verändert sich deine Wartezeit nicht.'}
                </Text>
                <Button
                    onPress={() => {
                        setShow(false);
                        navigate('/group');
                    }}
                    w={buttonWidth}
                >
                    Zu den Gruppenkursen
                </Button>
                <Button
                    w={buttonWidth}
                    variant={'outlinelight'}
                    onPress={() => {
                        navigate('/matching', {
                            state: { tabID: 1 },
                        });
                        setShow(false);
                    }}
                >
                    Fertig
                </Button>
            </VStack>
        );
        setShow(true);
    }, [buttonWidth, navigate, setContent, setShow, setVariant, space]);

    const requestMatch = useCallback(async () => {
        const resSubs = await update({ variables: { subjects: matchRequest.subjects } });

        if (resSubs.data && !resSubs.errors) {
            if (!isEdit) {
                const resRequest = await createMatchRequest();
                if (resRequest.data && !resRequest.errors) {
                    showModal();
                } else {
                    toast.show({ description: 'Es ist ein Fehler aufgetreten', placement: 'top' });
                }
            } else {
                showModal();
            }
        } else {
            toast.show({ description: 'Es ist ein Fehler aufgetreten', placement: 'top' });
        }
    }, [createMatchRequest, matchRequest.subjects, showModal, toast, update, isEdit]);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Details</Heading>
            <Heading>Möchtest du noch etwas an deine:n zuküftigen Lernpartner:in loswerden?</Heading>

            <Text>
                Hier kannst du weitere Angaben zu dir oder deiner aktuellen Situation machen, z.B. hast du ein spezielles Thema bei dem du Hilfe benötigst oder
                gibt es etwas, was deine Lernpartner:in über dich wissen sollte? Wir leiten diesen Text an deine:n zukünftige:n Lernpartner:in weiter.
            </Text>

            <Heading fontSize="md" mt={space['1']}>
                Deine Angaben
            </Heading>
            <TextArea
                placeholder="Was sollte dein:e zukünftige:r Lernpartner:in über dich wissen?"
                autoCompleteType={'off'}
                value={matchRequest.message}
                onChangeText={setMessage}
            />
            <NextPrevButtons isDisabledNext={_update.loading} onPressNext={requestMatch} onPressPrev={() => setCurrentIndex(4)} />
        </VStack>
    );
};
export default Details;
