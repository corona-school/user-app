import { Box, Heading, useTheme, VStack, Row, Column, Text, useBreakpointValue } from 'native-base';
import NotificationAlert from '../components/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import IconTagList from '../widgets/IconTagList';
import ProfileSettingItem from '../widgets/ProfileSettingItem';
import ProfileSettingRow from '../widgets/ProfileSettingRow';

import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import BackButton from '../components/BackButton';

type Props = {};

const UserProfile: React.FC<Props> = () => {
    const { colors, space, sizes } = useTheme();
    const location = useLocation();
    const { userType = '', id = 0 } = location.state as {
        userType: string;
        id: number | string;
    };

    const { t } = useTranslation();

    const { data, error, loading } = useQuery(gql`
    query{
      ${userType}s (where: {id: {equals: ${id}}}){
        firstname
        lastname
        aboutMe
        state
        languages
        
      }
    }
  `);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'User Profil',
        });
    }, []);

    const userData = useMemo(() => data && data[`${userType}s`], [data, userType]);

    if (loading) return <></>;
    if (error) return <></>;
    return (
        <>
            <WithNavigation
                showBack
                headerTitle={t('profile.title')}
                headerContent={
                    <Box maxWidth={ContainerWidth} bg={'primary.700'} alignItems="center" paddingY={space['2']} borderBottomRadius={16}>
                        <Box position="relative">
                            {/* <ProfilAvatar
                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                size="xl"
              /> */}
                            {/* <Box position="absolute" right="-14px" bottom="8px">
                <Link href="#">
                  <EditIcon
                    fill={colors['lightText']}
                    stroke={colors['lightText']}
                  />
                </Link>
              </Box> */}
                        </Box>
                        <Heading paddingTop={3} paddingBottom={9} color={colors.white} bold fontSize="xl">
                            {userData?.firstname}
                        </Heading>

                        {/* <Row width="80%" justifyContent="space-around">
              <Column
                textAlign="center"
                justifyContent="center"
                alignItems="center">
                <UserAchievements points={30} icon={<LFIcon Icon={Star} />} />
              </Column>
              <Column textAlign="center">
                <UserAchievements points={4} icon={<LFIcon Icon={Star} />} />
              </Column>
              <Column textAlign="center">
                <UserAchievements points={90} icon={<LFIcon Icon={Star} />} />
              </Column>
            </Row> */}
                    </Box>
                }
                headerLeft={
                    <Row space={space['1']}>
                        <NotificationAlert />
                    </Row>
                }
            >
                <VStack space={space['1']} width={ContainerWidth}>
                    <VStack paddingX={space['1.5']} space={space['1']}>
                        <ProfileSettingRow title={t('profile.PersonalData')}>
                            <ProfileSettingItem title={t('profile.UserName.label.title')}>
                                <Text>
                                    {userData?.firstname} {userData?.lastname}
                                </Text>
                            </ProfileSettingItem>

                            <ProfileSettingItem title={t('profile.AboutMe.label')}>
                                <Text>{userData?.aboutMe}</Text>
                            </ProfileSettingItem>

                            <ProfileSettingItem title={t('profile.FluentLanguagenalData.label')}>
                                {(userData?.languages?.length && (
                                    <Row flexWrap="wrap" w="100%">
                                        {userData?.languages.map((lang: string) => (
                                            <Column marginRight={3} mb={space['0.5']}>
                                                <IconTagList
                                                    isDisabled
                                                    iconPath={`languages/icon_${lang.toLowerCase()}.svg`}
                                                    text={t(`lernfair.languages.${lang.toLowerCase()}`)}
                                                />
                                            </Column>
                                        ))}
                                    </Row>
                                )) || <Text>{t('profile.Notice.noLanguage')}</Text>}
                            </ProfileSettingItem>

                            <ProfileSettingItem title={t('profile.State.label')}>
                                <Row flexWrap="wrap" w="100%">
                                    {(userData?.state && (
                                        <Column marginRight={3} mb={space['0.5']}>
                                            <IconTagList
                                                isDisabled
                                                iconPath={`states/icon_${userData?.state}.svg`}
                                                text={t(`lernfair.states.${userData?.state}`)}
                                            />
                                        </Column>
                                    )) || <Text>{t('profile.Notice.noState')}</Text>}
                                </Row>
                            </ProfileSettingItem>

                            <ProfileSettingItem title={t('profile.SchoolType.label')}>
                                <Row flexWrap="wrap" w="100%">
                                    {(userData?.schooltype && (
                                        <Column marginRight={3} mb={space['0.5']}>
                                            <IconTagList
                                                isDisabled
                                                iconPath={`schooltypes/icon_${data.me.schooltype}.svg`}
                                                text={t(`lernfair.schooltypes.${userData?.schooltype}`)}
                                            />
                                        </Column>
                                    )) || <Text>{t('profile.Notice.noSchoolType')}</Text>}
                                </Row>
                            </ProfileSettingItem>

                            <ProfileSettingItem title={t('profile.SchoolClass.label')}>
                                <Row flexWrap="wrap" w="100%">
                                    {(userData?.gradeAsInt && (
                                        <Column marginRight={3} mb={space['0.5']}>
                                            <IconTagList
                                                isDisabled
                                                textIcon={userData?.gradeAsInt}
                                                text={t('lernfair.schoolclass', {
                                                    class: userData?.gradeAsInt,
                                                })}
                                            />
                                        </Column>
                                    )) || <Text>{t('profile.Notice.noSchoolGrade')}</Text>}
                                </Row>
                            </ProfileSettingItem>

                            <ProfileSettingItem border={false} title={t('profile.NeedHelpIn.label')}>
                                <Row flexWrap="wrap" w="100%">
                                    {(userData?.subjectsFormatted?.length &&
                                        userData?.subjectsFormatted?.map((sub: { name: string; __typename: string }) => (
                                            <Column marginRight={3} mb={space['0.5']}>
                                                <IconTagList isDisabled iconPath={'subjects/icon_mathe.svg'} text={sub.name} />
                                            </Column>
                                        ))) || <Text>{t('profile.Notice.noSchoolSubject')}</Text>}
                                </Row>
                            </ProfileSettingItem>
                        </ProfileSettingRow>
                    </VStack>
                </VStack>
            </WithNavigation>
        </>
    );
};
export default UserProfile;
