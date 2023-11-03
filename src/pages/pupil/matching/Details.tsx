import { gql } from '../../../gql';
import { useMutation } from '@apollo/client';
import { Text, VStack, Heading, Button, useTheme, TextArea, useToast, useBreakpointValue } from 'native-base';
import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useModal from '../../../hooks/useModal';
import { RequestMatchContext } from './RequestMatch';
import PartyIcon from '../../../assets/icons/lernfair/lf-party.svg';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import { useTranslation } from 'react-i18next';

type Props = {};

const Details: React.FC<Props> = () => {
    const { show, hide } = useModal();
    const { space, sizes } = useTheme();
    const toast = useToast();
    const { matchRequest, setMessage, setCurrentIndex, isEdit } = useContext(RequestMatchContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

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
        show(
            { variant: 'dark' },
            <VStack paddingX={space['2']} paddingTop={space['2']} space={space['1']} alignItems="center">
                <PartyIcon />
                <Heading fontSize={'2xl'} color="lightText" textAlign="center">
                    {(!isEdit && t('matching.wizard.pupil.modalSuccess.heading.ver1')) || t('matching.wizard.pupil.modalSuccess.heading.ver2')}
                </Heading>
                <Text color="lightText" maxW="600px" textAlign="center">
                    {(!isEdit && t('matching.wizard.pupil.modalSuccess.text.ver1')) || t('matching.wizard.pupil.modalSuccess.text.ver2')}
                </Text>
                <Button
                    onPress={() => {
                        hide();
                        navigate('/group');
                    }}
                    w={buttonWidth}
                >
                    {t('matching.wizard.pupil.modalSuccess.groupCourses')}
                </Button>
                <Button
                    w={buttonWidth}
                    variant={'outlinelight'}
                    onPress={() => {
                        navigate('/matching', {
                            state: { tabID: 1 },
                        });
                        hide();
                    }}
                >
                    {t('done')}
                </Button>
            </VStack>
        );
    }, [buttonWidth, navigate, show, hide, space]);

    const requestMatch = useCallback(async () => {
        const resSubs = await update({ variables: { subjects: matchRequest.subjects } });

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
    }, [createMatchRequest, matchRequest.subjects, showModal, toast, update, isEdit]);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">{t('matching.wizard.pupil.details.heading')}</Heading>
            <Heading>{t('matching.wizard.pupil.details.subheading')}</Heading>

            <Text>{t('matching.wizard.pupil.details.text')}</Text>

            <Heading fontSize="md" mt={space['1']}>
                {t('matching.wizard.pupil.details.additionalInfo')}
            </Heading>
            <TextArea
                placeholder={t('matching.wizard.pupil.details.placeholder')}
                autoCompleteType={'off'}
                value={matchRequest.message}
                onChangeText={setMessage}
            />
            <NextPrevButtons isDisabledNext={_update.loading} onPressNext={requestMatch} onPressPrev={() => setCurrentIndex(4)} />
        </VStack>
    );
};
export default Details;
