import { useTheme, VStack, Heading, Button, useToast, Text, useBreakpointValue, Box } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import Card from '../../../components/Card';
import { RequestMatchContext } from './RequestMatch';
import { gql } from './../../../gql';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import useModal from '../../../hooks/useModal';
import PartyIcon from '../../../assets/icons/lernfair/lf-party.svg';
import { useTranslation } from 'react-i18next';
import { Subject } from '../../../gql/graphql';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import { getGradeLabel } from '../../../Utility';
import { Slider } from '@/components/Slider';

type Props = {};

const SchoolClasses: React.FC<Props> = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const toast = useToast();
    const { matchRequest, setSubject, setCurrentIndex, isEdit } = useContext(RequestMatchContext);
    const navigate = useNavigate();
    const { show, hide } = useModal();

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

    const [isLoading, setIsLoading] = useState(false);

    const [createMatchRequest] = useMutation(
        gql(`
        mutation StudentCreateMatchRequest {
            studentCreateMatchRequest
        }
    `)
    );

    const showModal = useCallback(() => {
        show(
            { variant: 'dark' },
            <VStack paddingX={space['2']} paddingTop={space['2']} space={space['1']} alignItems="center" height="100%">
                <Box maxWidth="600px" height="100%" justifyContent="center" alignItems="center" textAlign="center">
                    <PartyIcon />
                    <Heading fontSize={'2xl'} color="lightText" textAlign="center" marginY={space['1.5']}>
                        {t('matching.wizard.student.success.title')}
                    </Heading>
                    <Text color="lightText" textAlign="center" marginBottom={space['1']}>
                        {t('matching.wizard.student.success.subtitle')}
                    </Text>
                    <Text color="lightText" textAlign="center" marginBottom={space['1']}>
                        {t('matching.wizard.student.success.subtitle2')}
                    </Text>
                    <Button
                        w={buttonWidth}
                        onPress={() => {
                            navigate('/matching', {
                                state: { tabID: 1 },
                            });
                            hide();
                        }}
                    >
                        {t('done')}
                    </Button>
                </Box>
            </VStack>
        );
    }, [buttonWidth, navigate, show, hide, space]);

    const submit = useCallback(async () => {
        setIsLoading(true);
        const resSubs = await updateSubjects({ variables: { subjects: matchRequest.subjects } });
        if (resSubs.data && !resSubs.errors) {
            if (!isEdit) {
                const resRequest = await createMatchRequest();

                if (resRequest.data && !resRequest.errors) {
                    showModal();
                } else {
                    toast.show({ description: t('error'), placement: 'top' });
                }
            } else {
                showModal();
            }
        } else {
            toast.show({ description: t('error'), placement: 'top' });
        }
        setIsLoading(false);
    }, [createMatchRequest, isEdit, matchRequest, showModal, toast, updateSubjects]);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">{t('matching.wizard.student.grades.title')}</Heading>
            <Heading>{t('matching.wizard.student.grades.question')}</Heading>

            <VStack space={space['1']}>
                {matchRequest.subjects.map((subject) => (
                    <SubjectGradeSlider subject={subject} setSubject={setSubject} />
                ))}
            </VStack>
            <NextPrevButtons isLoading={isLoading} onPressPrev={() => setCurrentIndex(1)} onPressNext={submit} />
        </VStack>
    );
};
export default SchoolClasses;

const SubjectGradeSlider = ({ subject, setSubject }: { subject: Subject; setSubject: (subject: Subject) => void }) => {
    const { space, colors } = useTheme();
    const { t } = useTranslation();

    const onValueChange = useCallback(
        (range: [number, number]) => {
            setSubject({ name: subject.name, grade: { min: range[0], max: range[1] } });
        },
        [subject.name, setSubject]
    );

    return (
        <Card flexibleWidth padding={space['1']}>
            <VStack space={space['0.5']}>
                <Heading fontSize="md">{t(`lernfair.subjects.${subject.name}` as unknown as TemplateStringsArray)}</Heading>
                <Heading fontSize="md">
                    {getGradeLabel(subject.grade!.min)} - {getGradeLabel(subject.grade!.max)}
                </Heading>
                <Slider className="my-4" step={1} min={1} max={14} value={[subject.grade!.min, subject.grade!.max]} onValueChange={onValueChange} />
            </VStack>
        </Card>
    );
};
