import { Box, Button, Column, Container, Flex, FormControl, Heading, Modal, Row, Text, TextArea, useBreakpointValue, useTheme, VStack } from 'native-base';
import NotificationAlert from '../../components/notifications/NotificationAlert';
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
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import AlertMessage from '../../widgets/AlertMessage';
import CSSWrapper from '../../components/CSSWrapper';
import { MatchCertificateCard } from '../../widgets/certificates/MatchCertificateCard';

type Props = {};

const query = gql(`
    query StudentProfile {
        me {
            firstname
            lastname
            email
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
                    uuid
                    hoursPerWeek
                    ongoingLessons
                    pupil { firstname lastname }
                }
            }
        }
    }
`);

function StudentAboutMeModal({ aboutMe, onSave, onClose }: { aboutMe: string; onSave: () => void; onClose: () => void }) {
    const { t } = useTranslation();

    const [changedAboutMe, setAboutMe] = useState<string>();

    const [changeAboutMe, _changeAboutMe] = useMutation(
        gql(`
        mutation changeAboutMe($aboutMe: String!) {
            meUpdate(update: { student: { aboutMe: $aboutMe } })
        }
    `),
        { refetchQueries: [query] }
    );

    const onSaveAboutMe = useCallback(() => {
        if (changedAboutMe === undefined) return;
        changeAboutMe({ variables: { aboutMe: changedAboutMe } }).then(onSave);
        onClose();
    }, [changeAboutMe, changedAboutMe, onSave, onClose]);

    return (
        <Modal isOpen={true} onClose={onClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{t('profile.AboutMe.popup.header')}</Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <FormControl.Label>{t('profile.AboutMe.popup.label')}</FormControl.Label>
                        <TextArea autoCompleteType={{}} value={changedAboutMe ?? aboutMe} onChangeText={setAboutMe} />
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
                            {t('cancel')}
                        </Button>
                        <Button onPress={onSaveAboutMe}>{t('save')}</Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}

const ProfileStudent: React.FC<Props> = () => {
    const { colors, space, sizes } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { trackPageView } = useMatomo();

    const [aboutMeModalVisible, setAboutMeModalVisible] = useState<boolean>(false);

    const [userSettingChanged, setUserSettings] = useState<boolean>(false);
    const onSave = useCallback(() => setUserSettings(true), [setUserSettings]);

    const location = useLocation();
    const { showSuccessfulChangeAlert = false } = (location.state || {}) as {
        showSuccessfulChangeAlert: boolean;
    };

    const { data, loading } = useQuery(query, {
        fetchPolicy: 'no-cache',
    });

    const profileCompleteness = useMemo(() => {
        const max = 4.0;
        let complete = 0.0;

        data?.me.firstname && data?.me.lastname && (complete += 1);
        (data?.me.student!.aboutMe?.length ?? 0) > 0 && (complete += 1);
        data?.me?.student?.languages?.length && (complete += 1);
        data?.me?.student?.state && (complete += 1);
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

    return (
        <>
            <WithNavigation
                showBack
                isLoading={loading}
                onBack={() => navigate(-1)}
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
                            <ProfileSettingItem title={t('profile.UserName.label.title')} isIcon={false}>
                                <Text>
                                    {data?.me?.firstname} {data?.me?.lastname}
                                </Text>
                            </ProfileSettingItem>

                            <ProfileSettingItem title={t('profile.UserName.label.email')} isIcon={false}>
                                <Text>{data?.me?.email}</Text>
                            </ProfileSettingItem>

                            <ProfileSettingItem
                                title={t('profile.AboutMe.label')}
                                href={() => {
                                    setAboutMeModalVisible(true);
                                }}
                            >
                                <Text>{data?.me.student!.aboutMe ?? t('profile.AboutMe.empty')}</Text>
                            </ProfileSettingItem>
                            {data && aboutMeModalVisible && (
                                <StudentAboutMeModal aboutMe={data.me.student!.aboutMe} onSave={onSave} onClose={() => setAboutMeModalVisible(false)} />
                            )}

                            <ProfileSettingItem title={t('profile.FluentLanguagenalData.label')} href={() => navigate('/change-setting/language')}>
                                {(data?.me?.student?.languages?.length && (
                                    <Row flexWrap="wrap" w="100%">
                                        {data?.me?.student?.languages.map((lang: string) => (
                                            <Column marginRight={3} mb={space['0.5']}>
                                                <CSSWrapper className="profil-tab-link">
                                                    <IconTagList
                                                        isDisabled
                                                        iconPath={`languages/icon_${lang.toLowerCase()}.svg`}
                                                        text={t(`lernfair.languages.${lang.toLowerCase()}` as unknown as TemplateStringsArray)}
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
                                            )) || <Text>{t('profile.noInfo')}</Text>}
                                        </Column>
                                    )) || <Text>{t('profile.State.empty')}</Text>}
                                </Row>
                            </ProfileSettingItem>
                        </ProfileSettingRow>
                        <ProfileSettingRow title={t('profile.Helper.certificate.title')}>
                            <Button marginY={space['1']} onPress={() => navigate('/request-certificate')} maxWidth="300px">
                                {t('profile.Helper.certificate.button')}
                            </Button>
                            <VStack display="flex" flexDirection="row" flexWrap="wrap">
                                {data?.me.student?.participationCertificates.map((certificate) => (
                                    <MatchCertificateCard certificate={certificate} />
                                ))}
                            </VStack>
                        </ProfileSettingRow>
                    </VStack>
                </VStack>
            </WithNavigation>
        </>
    );
};
export default ProfileStudent;
