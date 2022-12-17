import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Text, VStack, Heading, Button, useTheme, useBreakpointValue, Row } from 'native-base';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import IconTagList from '../../widgets/IconTagList';
import TwoColGrid from '../../widgets/TwoColGrid';
import { getSubjectKey } from '../../types/lernfair/Subject';

type Props = {
    selectedSubjects: any;
    selectedClasses: any;
    setSelectedSubjects: any;
    setSelectedClasses: any;
    setFocusedSubject: any;
    setShowModal: any;
    setCurrentIndex: any;
    data: any;
};

const RequestMatchWizard: React.FC<Props> = ({
    selectedSubjects,
    selectedClasses,
    setSelectedSubjects,
    setSelectedClasses,
    setFocusedSubject,
    setShowModal,
    setCurrentIndex,
    data,
}) => {
    const { space, sizes } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const isValidInput = useMemo(() => {
        const entries = Object.entries(selectedSubjects);
        if (!entries.length) {
            return false;
        }

        entries
            .filter((s) => s[1] && s)
            .forEach(([sub, _]) => {
                if (!selectedClasses[sub] || !selectedClasses[sub].min || !selectedClasses[sub].max) {
                    return false;
                }
            });

        return true;
    }, [selectedSubjects, selectedClasses]);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const ButtonContainerDirection = useBreakpointValue({
        base: 'column',
        lg: 'row',
    });

    const { trackPageView, trackEvent } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Anfrage – Helfer Matching Formular ',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <VStack marginX="auto" maxWidth={ContainerWidth}>
            <Heading mb={space['0.5']}>{t('matching.student.title')}</Heading>
            <Text>{t('matching.student.text')}</Text>

            <Text my={space['0.5']} bold>
                {t('important')}
            </Text>
            <Text mb={space['1.5']}>{t('matching.student.hint')}</Text>

            <Heading fontSize={'lg'} mb={space['1']}>
                {t('matching.student.personalData.title')}
            </Heading>

            <Text bold paddingBottom="2px">
                {t('matching.student.personalData.subtitle')}
            </Text>
            <Text paddingBottom={space['1']}>{t('matching.student.personalData.hint')}</Text>

            <TwoColGrid>
                {data?.me?.student?.subjectsFormatted.map((sub: any) => {
                    return (
                        <IconTagList
                            iconPath={`subjects/icon_${getSubjectKey(sub?.name)}.svg`}
                            variant="selection"
                            text={sub.name}
                            initial={selectedSubjects[sub.name]}
                            onPress={() => {
                                if (selectedSubjects[sub.name]) {
                                    setSelectedSubjects((prev: any) => ({
                                        ...prev,
                                        [sub.name]: false,
                                    }));
                                    return;
                                }

                                setSelectedSubjects((prev: any) => ({
                                    ...prev,
                                    [sub.name]: !prev[sub.name],
                                }));
                                setSelectedClasses((prev: any) => ({
                                    ...prev,
                                    [sub.name]: { min: 1, max: 13 },
                                }));
                                setFocusedSubject(sub);
                                setShowModal(true);
                            }}
                        />
                    );
                })}
            </TwoColGrid>

            <Button
                variant={'link'}
                alignSelf="flex-start"
                _text={{ color: 'darkText', fontWeight: 'normal', fontSize: 'sm' }}
                onPress={() => navigate('/change-setting/subjects')}
            >
                Du möchtest noch ein weiteres Fach anbieten?
            </Button>

            <Row marginY={space['1.5']} space={space['1']} flexDirection={ButtonContainerDirection}>
                <Button marginBottom={space['0.5']} isDisabled={!isValidInput} onPress={() => setCurrentIndex(1)} width={ButtonContainer}>
                    Angaben prüfen
                </Button>
                <Button
                    marginBottom={space['0.5']}
                    variant="outline"
                    onPress={() => {
                        trackEvent({
                            category: 'matching',
                            action: 'click-event',
                            name: 'Helfer Matching Gruppen – Kurs erstellen',
                            documentTitle: 'Matching Gruppen Lernunterstützung Kurs erstellen',
                        });
                        navigate('/matching');
                    }}
                    width={ButtonContainer}
                >
                    Abbrechen
                </Button>
            </Row>
        </VStack>
    );
};
export default RequestMatchWizard;
