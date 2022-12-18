import {
    Box,
    Button,
    Column,
    Container,
    Flex,
    FormControl,
    Heading,
    Input,
    Modal,
    Row,
    Text,
    TextArea,
    useBreakpointValue,
    useTheme,
    useToast,
    VStack,
} from 'native-base';
import NotificationAlert from '../../components/NotificationAlert';
import WithNavigation from '../../components/WithNavigation';
import IconTagList from '../../widgets/IconTagList';
import ProfileSettingItem from '../../widgets/ProfileSettingItem';
import ProfileSettingRow from '../../widgets/ProfileSettingRow';

import UserProgress from '../../widgets/UserProgress';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gql } from '../../gql';
import { useMutation, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import AlertMessage from '../../widgets/AlertMessage';
import CSSWrapper from '../../components/CSSWrapper';
import useLernfair from '../../hooks/useLernfair';
import Card from '../../components/Card';

type Props = {};

const query = gql(`
    query StudentProfile {
        me {
            firstname
            lastname
            student {
                state
                aboutMe
                languages
                subjectsFormatted {
                    name
                }
                participationCertificates {
                    state
                    subjectsFormatted
                    startDate
                    endDate
                    hoursTotal
                    medium
                    categories
                }
            }
        }
    }
`);

const ProfileStudent: React.FC<Props> = () => {
    const { colors, space, sizes } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { rootPath } = useLernfair();
    const { trackPageView } = useMatomo();
    const toast = useToast();
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();

    const [nameModalVisible, setNameModalVisible] = useState<boolean>(false);
    const [aboutMeModalVisible, setAboutMeModalVisible] = useState<boolean>(false);

    const [aboutMe, setAboutMe] = useState<string>('');
    const [userSettingChanged, setUserSettings] = useState<boolean>(false);

    const [showSelectPDFLanguageModal, setShowSelectPDFLanguageModal] = useState<boolean>(false);
    const [focusedCertificateUuid, setFocusedCertificateUuid] = useState<string>('');
    const location = useLocation();
    const { showSuccessfulChangeAlert = false } = (location.state || {}) as {
        showSuccessfulChangeAlert: boolean;
    };

    const { data, loading } = useQuery(query, {
        fetchPolicy: 'no-cache',
    });
    const [requestCertificate, _requestCertificate] = useMutation(
        gql(`
            mutation GetCertificate($lang: String!, $uuid: String!) {
                participationCertificateAsPDF(language: $lang, uuid: $uuid)
            }
        `)
    );

    const [changeName, _changeName] = useMutation(
        gql(`
            mutation changeName($firstname: String!, $lastname: String!) {
                meUpdate(update: { firstname: $firstname, lastname: $lastname })
            }
        `),
        { refetchQueries: [query] }
    );

    const [changeAboutMe, _changeAboutMe] = useMutation(
        gql(`
        mutation changeAboutMe($aboutMe: String!) {
            meUpdate(update: { student: { aboutMe: $aboutMe } })
        }
    `)
    );

    useEffect(() => {
        if (_changeName.data || _changeAboutMe.data) {
            setUserSettings(true);
        }
    }, [_changeAboutMe.data, _changeName.data]);

    useEffect(() => {
        if (data?.me) {
            setFirstName(data.me.firstname);
            setLastName(data.me.lastname);
            setAboutMe(data.me.student!.aboutMe);
        }
    }, [data?.me]);

    const profileCompleteness = useMemo(() => {
        const max = 5.0;
        let complete = 0.0;

        data?.me.firstname && data?.me.lastname && (complete += 1);
        (data?.me.student!.aboutMe?.length ?? 0) > 0 && (complete += 1);
        data?.me?.student?.languages?.length && (complete += 1);
        data?.me?.student?.state && (complete += 1);
        (data?.me?.student?.subjectsFormatted?.length ?? 0) > 0 && (complete += 1);
        return Math.floor((complete / max) * 100);
    }, [data?.me?.firstname, data?.me?.lastname, data?.me?.student]);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const HeaderStyle = useBreakpointValue({
        base: {
            isMobile: true,
            bgColor: 'primary.700',
            paddingY: space['2'],
        },
        lg: {
            isMobile: false,
            bgColor: 'transparent',
            paddingY: 0,
        },
    });

    useEffect(() => {
        trackPageView({
            documentTitle: 'Helfer Matching',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (showSuccessfulChangeAlert || userSettingChanged) {
            window.scrollTo({ top: 0 });
        }
    }, [showSuccessfulChangeAlert, userSettingChanged]);

    const downloadCertificate = useCallback(
        async (lang: 'de' | 'en') => {
            setShowSelectPDFLanguageModal(false);

            const res = await requestCertificate({
                variables: {
                    lang,
                    uuid: `${focusedCertificateUuid}`,
                },
            });

            if (res?.data?.participationCertificateAsPDF) {
                toast.show({ description: 'Dein Zertifikat wird heruntergeladen' });
                window.open(`${process.env.REACT_APP_APOLLO_CLIENT_URI}${res?.data?.participationCertificateAsPDF}`, '_blank');
            } else {
                toast.show({ description: 'Beim Download ist ein Fehler aufgetreten' });
            }
        },
        [focusedCertificateUuid, requestCertificate, toast]
    );

    return (
        <>
            <WithNavigation
                showBack
                isLoading={loading}
                onBack={() => (!!rootPath && navigate(`/${rootPath}`)) || navigate(-1)}
                headerTitle={t('profile.title')}
                headerContent={
                    <Flex
                        maxWidth={ContainerWidth}
                        marginX="auto"
                        width="100%"
                        bg={HeaderStyle.bgColor}
                        alignItems={HeaderStyle.isMobile ? 'center' : 'flex-start'}
                        justifyContent="center"
                        paddingY={HeaderStyle.paddingY}
                        borderBottomRadius={16}
                    >
                        <Heading color={colors.white} bold fontSize="xl">
                            {data?.me?.firstname}
                        </Heading>
                    </Flex>
                }
                headerLeft={<NotificationAlert />}
            >
                {(showSuccessfulChangeAlert || userSettingChanged) && (
                    <Container maxWidth={ContainerWidth} paddingX={space['1']}>
                        <AlertMessage content={t('profile.successmessage')} />
                    </Container>
                )}

                <VStack space={space['1']} maxWidth={ContainerWidth} marginX="auto" width="100%">
                    {profileCompleteness !== 100 && (
                        <VStack paddingX={space['1.5']} space={space['1']}>
                            <ProfileSettingRow title={t('profile.ProfileCompletion.name')}>
                                <UserProgress percent={profileCompleteness} />
                            </ProfileSettingRow>
                        </VStack>
                    )}
                    <VStack paddingX={space['1.5']} space={space['1']}>
                        <ProfileSettingRow title={t('profile.PersonalData')}>
                            <ProfileSettingItem
                                title={t('profile.UserName.label.title')}
                                href={() => {
                                    setNameModalVisible(!nameModalVisible);
                                }}
                            >
                                <Text>
                                    {data?.me?.firstname} {data?.me?.lastname}
                                </Text>
                            </ProfileSettingItem>

                            <ProfileSettingItem
                                title={t('profile.AboutMe.label')}
                                href={() => {
                                    setAboutMeModalVisible(!aboutMeModalVisible);
                                }}
                            >
                                {(data?.me?.student?.aboutMe && <Text>{data?.me?.student?.aboutMe}</Text>) || <Text>{t('profile.AboutMe.empty')}</Text>}
                            </ProfileSettingItem>

                            <ProfileSettingItem title={t('profile.FluentLanguagenalData.label')} href={() => navigate('/change-setting/language')}>
                                {(data?.me?.student?.languages?.length && (
                                    <Row flexWrap="wrap" w="100%">
                                        {data?.me?.student?.languages.map((lang: string) => (
                                            <Column marginRight={3} mb={space['0.5']}>
                                                <CSSWrapper className="profil-tab-link">
                                                    <IconTagList
                                                        isDisabled
                                                        iconPath={`languages/icon_${lang.toLowerCase()}.svg`}
                                                        text={t(`lernfair.languages.${lang.toLowerCase()}`)}
                                                    />
                                                </CSSWrapper>
                                            </Column>
                                        ))}
                                    </Row>
                                )) || <Text>{t('profile.Notice.noLanguage')}</Text>}
                            </ProfileSettingItem>

                            <ProfileSettingItem
                                title={t('profile.State.label')}
                                href={() =>
                                    navigate('/change-setting/state', {
                                        state: { userType: 'student' },
                                    })
                                }
                            >
                                <Row>
                                    {(data?.me?.student!.state && (
                                        <Column marginRight={3}>
                                            {(data?.me?.student?.state && (
                                                <CSSWrapper className="profil-tab-link">
                                                    <IconTagList
                                                        isDisabled
                                                        iconPath={`states/icon_${data?.me?.student.state}.svg`}
                                                        text={t(`lernfair.states.${data?.me?.student.state}`)}
                                                    />
                                                </CSSWrapper>
                                            )) || <Text>Keine Angabe</Text>}
                                        </Column>
                                    )) || <Text>{t('profile.State.empty')}</Text>}
                                </Row>
                            </ProfileSettingItem>
                        </ProfileSettingRow>
                        {/* <ProfileSettingRow title={'Meine Bescheinigungen'}>
                            <VStack space={space['1']}>
                                <CertificateOverviewRow
                                    title="Gruppenkurse"
                                    isDisabled={_requestCertificate.loading}
                                    Icon={<CertificateGroupIcon />}
                                    certificate={{}}
                                    onPressDownload={() => {
                                        // setFocusedCertificateUuid(cert.uuid)
                                        setShowSelectPDFLanguageModal(true);
                                    }}
                                    onPressDetails={() =>
                                        navigate('/certificate-list', {
                                            state: { type: 'group' },
                                        })
                                    }
                                />
                                <CertificateOverviewRow
                                    title="1:1 Lernunterstützung"
                                    isDisabled={_requestCertificate.loading}
                                    Icon={<CertificateGroupIcon />}
                                    certificate={{}}
                                    onPressDownload={() => {
                                        // setFocusedCertificateUuid(cert.uuid)
                                        setShowSelectPDFLanguageModal(true);
                                    }}
                                    onPressDetails={() =>
                                        navigate('/certificate-list', {
                                            state: { type: 'matching' },
                                        })
                                    }
                                />
                            </VStack>
                        </ProfileSettingRow> */}
                    </VStack>
                </VStack>
            </WithNavigation>
            <Modal isOpen={nameModalVisible} onClose={() => setNameModalVisible(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>{t('profile.UserName.popup.header')}</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>{t('profile.UserName.label.firstname')}</FormControl.Label>
                            <Input
                                value={firstName}
                                onChangeText={(text) => {
                                    setFirstName(text);
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>{t('profile.UserName.label.lastname')}</FormControl.Label>
                            <Input
                                value={lastName}
                                onChangeText={(text) => {
                                    setLastName(text);
                                }}
                            />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="ghost"
                                colorScheme="blueGray"
                                onPress={() => {
                                    setNameModalVisible(false);
                                }}
                            >
                                {t('profile.UserName.popup.exit')}
                            </Button>
                            <Button
                                isDisabled={!firstName || !lastName}
                                onPress={() => {
                                    setNameModalVisible(false);
                                    changeName({
                                        variables: { firstname: firstName!, lastname: lastName! },
                                    });
                                }}
                            >
                                {t('profile.UserName.popup.save')}
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={aboutMeModalVisible} onClose={() => setAboutMeModalVisible(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>{t('profile.AboutMe.popup.header')}</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>{t('profile.AboutMe.popup.label')}</FormControl.Label>
                            <TextArea autoCompleteType={{}} value={aboutMe} onChangeText={setAboutMe} />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="ghost"
                                colorScheme="blueGray"
                                onPress={() => {
                                    setAboutMeModalVisible(false);
                                }}
                            >
                                {t('profile.AboutMe.popup.exit')}
                            </Button>
                            <Button
                                onPress={() => {
                                    changeAboutMe({ variables: { aboutMe } });
                                    setAboutMeModalVisible(false);
                                }}
                            >
                                {t('profile.AboutMe.popup.save')}
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal
                isOpen={showSelectPDFLanguageModal}
                onClose={() => {
                    setFocusedCertificateUuid('');
                    setShowSelectPDFLanguageModal(false);
                }}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Body>
                        <VStack space={space['0.5']}>
                            <Heading>Bescheinigung herunterladen</Heading>
                            <Text>
                                Bitte beachte, dass noch Bestätigungen ausstehen und deswegen noch nicht alle Stunden in der Bescheigung aufgeführt sind. Die
                                Bescheinigung wird automatisch aktualisert, sobald neue Bestätigungen vorliegen.
                            </Text>

                            <>
                                <Button onPress={() => downloadCertificate('de')}>Deutsche Version</Button>
                                <Button onPress={() => downloadCertificate('en')}>Englische Version</Button>
                            </>
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
};
export default ProfileStudent;

type CertificateProps = {
    title: string;
    Icon?: ReactNode;
    certificate: any;
    onPressDownload?: () => void;
    onPressDetails?: () => void;
    isDisabled?: boolean;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CertificateOverviewRow: React.FC<CertificateProps> = ({ title, Icon, certificate, onPressDownload, onPressDetails, isDisabled }) => {
    const { space } = useTheme();
    return (
        <Card flexibleWidth padding={space['1']}>
            <VStack>
                <Row justifyContent="flex-end" alignItems="center">
                    {Icon && <Box mr={space['0.5']}>{Icon}</Box>}
                    <Heading flex="1">{title}</Heading>
                </Row>
                <VStack py={space['1']}>
                    <Text>
                        <Text bold mr="0.5">
                            Beantragt am:
                        </Text>
                        {DateTime.now().toFormat('dd.MM.yyyy')}
                    </Text>
                    <Text>
                        <Text bold mr="0.5">
                            Status:{' '}
                        </Text>
                        <Text>0 von X bestätigt</Text>
                    </Text>
                </VStack>
                <Button isDisabled={isDisabled} variant="outline" onPress={onPressDownload}>
                    Herunterladen
                </Button>
                <Button isDisabled={isDisabled} variant="link" onPress={onPressDetails}>
                    Details ansehen
                </Button>
            </VStack>
        </Card>
    );
};
