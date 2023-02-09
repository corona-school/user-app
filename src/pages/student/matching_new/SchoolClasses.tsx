import { useTheme, VStack, Heading, Button, useToast, Text, useBreakpointValue, Box } from 'native-base';
import { useCallback, useContext, useMemo } from 'react';
import Card from '../../../components/Card';
import { RequestMatchContext } from './RequestMatch';
import { Slider } from '@miblanchard/react-native-slider';
import { gql } from './../../../gql';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import useModal from '../../../hooks/useModal';
import PartyIcon from '../../../assets/icons/lernfair/lf-party.svg';
import { Subject } from '../../../gql/graphql';
import { useTranslation } from 'react-i18next';

type Props = {};

const SchoolClasses: React.FC<Props> = () => {
    const { space, sizes } = useTheme();
    const toast = useToast();
    const { matchRequest, setSubject, setCurrentIndex, isEdit } = useContext(RequestMatchContext);
    const navigate = useNavigate();
    const { setShow, setContent, setVariant } = useModal();

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const [updateSubjects] = useMutation(
        gql(`
        mutation updateStudentSubjects($subjects: [SubjectInput!]) {
            meUpdate(update: { student: { subjects: $subjects } })
        }
    `)
    );

    const [createMatchRequest] = useMutation(
        gql(`
        mutation StudentCreateMatchRequest {
            studentCreateMatchRequest
        }
    `)
    );


    const showModal = useCallback(() => {
        setVariant('dark');

        setContent(
            <VStack paddingX={space['2']} paddingTop={space['2']} space={space['1']} alignItems="center" height="100%">
                <Box maxWidth="600px" height="100%" justifyContent="center" alignItems="center" textAlign="center">
                    <PartyIcon />
                    <Heading fontSize={'2xl'} color="lightText" textAlign="center" marginY={space['1.5']}>
                        Geschafft, du bist ein:e Held:in!
                    </Heading>
                    <Text color="lightText" textAlign="center" marginBottom={space['1']}>
                        Danke, dass du eine:n (weitere:n) Schüler:in unterstützen möchtest!
                    </Text>
                    <Text color="lightText" textAlign="center" marginBottom={space['1']}>
                        Wir suchen nun eine:n geignete:n Schüler:in für dich. Die Suche dauert in der Regel maximal eine Woche. Sobald wir jemanden für dich
                        gefunden haben, werden wir dich direkt per E-Mail benachrichtigen. Solltest du Fragen haben, kannst du dich jederzeit bei uns melden.
                    </Text>
                    <Button
                        w={buttonWidth}
                        onPress={() => {
                            navigate('/matching', {
                                state: { tabID: 1 },
                            });
                            setShow(false);
                        }}
                    >
                        Fertig
                    </Button>
                </Box>
            </VStack>
        );
        setShow(true);
    }, [buttonWidth, navigate, setContent, setShow, setVariant, space]);

    const submit = useCallback(async () => {

        const resSubs = await updateSubjects({ variables: { subjects: matchRequest.subjects } });
        if (resSubs.data && !resSubs.errors) {
            if (!isEdit) {
                const resRequest = await createMatchRequest();

                if (resRequest.data && !resRequest.errors) {
                    showModal();
                } else {
                    toast.show({ description: 'Es ist ein Fehler aufgetreten' });
                }
            } else {
                showModal();
            }
        } else {
            toast.show({ description: 'Es ist ein Fehler aufgetreten' });
        }
    }, [createMatchRequest, isEdit, matchRequest, showModal, toast, updateSubjects]);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Jahrgangsstufen</Heading>
            <Heading>In welchen Jahrgangsstufen möchtest du helfen?</Heading>
            <VStack space={space['1']}>
                {matchRequest.subjects.map((subject) => (
                    <SubjectGradeSlider subject={subject} setSubject={setSubject} />
                ))}
            </VStack>

            <Button onPress={submit}>Weiter</Button>
            <Button variant="outline" onPress={() => setCurrentIndex(2)}>
                Zurück
            </Button>
        </VStack>
    );
};
export default SchoolClasses;

const SubjectGradeSlider = ({ subject, setSubject }: { subject: Subject, setSubject: (subject: Subject) => void }) => {
    const { space, colors } = useTheme();
    const { t } = useTranslation();

    const onValueChange = useCallback((range: [number, number]) => {
        setSubject({ name: subject.name, grade: { min: range[0], max: range[1] }});
    }, [subject.name, setSubject]);


    return (
        <Card flexibleWidth padding={space['1']}>
            <VStack space={space['0.5']}>
                <Heading fontSize="md">{t(`lernfair.subjects.${subject.name}`)}</Heading>
                <Heading fontSize="md">
                    Klasse {subject.grade!.min}-{subject.grade!.max}
                </Heading>

                <Slider
                    animateTransitions
                    minimumValue={1}
                    maximumValue={13}
                    minimumTrackTintColor={colors['primary']['500']}
                    thumbTintColor={colors['primary']['900']}
                    value={[subject.grade!.min, subject.grade!.max]}
                    step={1}
                    onValueChange={onValueChange as any}
                />
            </VStack>
        </Card>
    );
};
