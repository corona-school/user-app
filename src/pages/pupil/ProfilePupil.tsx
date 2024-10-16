import { Box, Button, Column, Flex, FormControl, Heading, Input, Modal, Row, Stack, Text, TextArea, useBreakpointValue, useTheme, VStack } from 'native-base';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import WithNavigation from '../../components/WithNavigation';
import IconTagList from '../../widgets/IconTagList';
import ProfileSettingItem from '../../widgets/ProfileSettingItem';
import ProfileSettingRow from '../../widgets/ProfileSettingRow';

import UserProgress from '../../widgets/UserProgress';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import AlertMessage from '../../widgets/AlertMessage';
import CSSWrapper from '../../components/CSSWrapper';
import { gql } from '../../gql';
import SwitchLanguageButton from '../../components/SwitchLanguageButton';
import { GradeTag } from '../../components/GradeSelector';

type Props = {};

const query = gql(`
    query PupilProfile {
        me {
            firstname
            lastname
            email
            pupil {
                aboutMe
                state
                schooltype
                languages
                subjectsFormatted {
                    name
                }
                gradeAsInt
            }
        }
    }
`);

function PupilNameModal({ firstname, lastname, onSave, onClose }: { firstname: string; lastname: string; onSave: () => void; onClose: () => void }) {
    const { t } = useTranslation();

    const [changedFirstName, setFirstName] = useState<string>();
    const [changedLastName, setLastName] = useState<string>();

    const [changeName] = useMutation(
        gql(`
            mutation changePupilName($firstname: String, $lastname: String) {
                meUpdate(update: { firstname: $firstname, lastname: $lastname })
            }
        `),
        { refetchQueries: [query] }
    );

    const onSaveName = useCallback(() => {
        changeName({
            variables: { firstname: changedFirstName, lastname: changedLastName },
        }).then(onSave);
        onClose();
    }, [onClose, changeName, onSave, changedFirstName, changedLastName]);

    return (
        <Modal bg="modalbg" isOpen={true} onClose={onClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{t('profile.UserName.popup.header')}</Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <FormControl.Label>{t('profile.UserName.label.firstname')}</FormControl.Label>
                        <Input value={changedFirstName ?? firstname} onChangeText={setFirstName} />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>{t('profile.UserName.label.lastname')}</FormControl.Label>
                        <Input value={changedLastName ?? lastname} onChangeText={setLastName} />
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
                            {t('cancel')}
                        </Button>
                        <Button onPress={onSaveName}>{t('save')}</Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}

function PupilAboutMeModal({ aboutMe, onSave, onClose }: { aboutMe: string; onSave: () => void; onClose: () => void }) {
    const { t } = useTranslation();

    const [changedAboutMe, setAboutMe] = useState<string>();

    const [changeAboutMe] = useMutation(
        gql(`
            mutation changeAboutMePupil($aboutMe: String!) {
                meUpdate(update: { pupil: { aboutMe: $aboutMe } })
            }
        `),
        { refetchQueries: [query] }
    );

    return (
        <Modal bg="modalbg" isOpen={true} onClose={onClose}>
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
                        <Button
                            onPress={() => {
                                if (changedAboutMe === undefined) return;
                                changeAboutMe({ variables: { aboutMe: changedAboutMe } }).then(onSave);
                                onClose();
                            }}
                        >
                            {t('save')}
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}

const ProfilePupil: React.FC<Props> = () => {
    const { colors, space, sizes } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [aboutMeModalVisible, setAboutMeModalVisible] = useState<boolean>(false);
    const [nameModalVisible, setNameModalVisible] = useState<boolean>(false);

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
        const max = 6.0;
        let complete = 0.0;

        data?.me?.firstname && data?.me?.lastname && (complete += 1);
        data?.me?.pupil?.aboutMe && (complete += 1);
        data?.me?.pupil?.languages?.length && (complete += 1);
        data?.me?.pupil?.state && (complete += 1);
        data?.me?.pupil?.schooltype && (complete += 1);
        data?.me?.pupil?.gradeAsInt && (complete += 1);

        return Math.floor((complete / max) * 100);
    }, [
        data?.me?.firstname,
        data?.me?.lastname,
        data?.me?.pupil?.aboutMe,
        data?.me?.pupil?.gradeAsInt,
        data?.me?.pupil?.languages?.length,
        data?.me?.pupil?.schooltype,
        data?.me?.pupil?.state,
    ]);

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

    const isMobileSM = useBreakpointValue({
        base: true,
        sm: false,
    });

    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler Profil',
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
                isLoading={loading}
                showBack={isMobileSM}
                hideMenu={isMobileSM}
                previousFallbackRoute="/settings"
                headerTitle={t('profile.title')}
                headerLeft={
                    !isMobileSM && (
                        <Stack alignItems="center" direction="row">
                            <SwitchLanguageButton />
                            <NotificationAlert />
                        </Stack>
                    )
                }
            >
                {(showSuccessfulChangeAlert || userSettingChanged) && <AlertMessage content={t('profile.successmessage')} />}

                <VStack space={space['1']} width="100%" marginX="auto" maxWidth={ContainerWidth}>
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
                                    setNameModalVisible(true);
                                }}
                            >
                                <Text>
                                    {data?.me.firstname} {data?.me.lastname}
                                </Text>
                            </ProfileSettingItem>
                            {data && nameModalVisible && (
                                <PupilNameModal
                                    firstname={data!.me.firstname}
                                    lastname={data!.me.lastname}
                                    onSave={onSave}
                                    onClose={() => setNameModalVisible(false)}
                                />
                            )}

                            <ProfileSettingItem title={t('profile.UserName.label.email')} isIcon={false}>
                                <Text>{data?.me?.email}</Text>
                            </ProfileSettingItem>
                            <ProfileSettingItem
                                title={t('profile.AboutMe.label')}
                                href={() => {
                                    setAboutMeModalVisible(true);
                                }}
                            >
                                <Text>{data?.me.pupil!.aboutMe}</Text>
                            </ProfileSettingItem>
                            {data && aboutMeModalVisible && (
                                <PupilAboutMeModal aboutMe={data!.me.pupil!.aboutMe} onSave={onSave} onClose={() => setAboutMeModalVisible(false)} />
                            )}

                            <ProfileSettingItem title={t('profile.FluentLanguagenalData.label')} href={() => navigate('/change-setting/language')}>
                                {(data?.me?.pupil?.languages?.length && (
                                    <Row flexWrap="wrap" w="100%">
                                        {data?.me?.pupil?.languages.map((lang: string) => (
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

                            <ProfileSettingItem title={t('profile.State.label')} href={() => navigate('/change-setting/state')}>
                                <Row flexWrap="wrap" w="100%">
                                    {(data?.me?.pupil?.state && (
                                        <Column marginRight={3} mb={space['0.5']}>
                                            {(data?.me?.pupil?.state && (
                                                <CSSWrapper className="profil-tab-link">
                                                    <IconTagList
                                                        isDisabled
                                                        iconPath={`states/icon_${data?.me?.pupil?.state}.svg`}
                                                        text={t(`lernfair.states.${data?.me?.pupil?.state}`)}
                                                    />
                                                </CSSWrapper>
                                            )) || <Text>{t('profile.noInfo')}</Text>}
                                        </Column>
                                    )) || <Text>{t('profile.Notice.noState')}</Text>}
                                </Row>
                            </ProfileSettingItem>

                            <ProfileSettingItem title={t('profile.SchoolType.label')} href={() => navigate('/change-setting/school-type')}>
                                <Row flexWrap="wrap" w="100%">
                                    {(data?.me?.pupil?.schooltype && (
                                        <Column marginRight={3} mb={space['0.5']}>
                                            <CSSWrapper className="profil-tab-link">
                                                <IconTagList
                                                    isDisabled
                                                    iconPath={`schooltypes/icon_${data.me.pupil?.schooltype}.svg`}
                                                    text={t(`lernfair.schooltypes.${data?.me?.pupil?.schooltype}`)}
                                                />
                                            </CSSWrapper>
                                        </Column>
                                    )) || <Text>{t('profile.Notice.noSchoolType')}</Text>}
                                </Row>
                            </ProfileSettingItem>

                            <ProfileSettingItem title={t('profile.SchoolClass.label')} href={() => navigate('/change-setting/class')}>
                                <Row flexWrap="wrap" w="100%">
                                    {(data?.me?.pupil?.gradeAsInt && (
                                        <Column marginRight={3} mb={space['0.5']}>
                                            <CSSWrapper className="profil-tab-link">
                                                <GradeTag grade={data?.me?.pupil?.gradeAsInt} />
                                            </CSSWrapper>
                                        </Column>
                                    )) || <Text>{t('profile.Notice.noSchoolGrade')}</Text>}
                                </Row>
                            </ProfileSettingItem>
                        </ProfileSettingRow>
                    </VStack>
                </VStack>
            </WithNavigation>
        </>
    );
};
export default ProfilePupil;
