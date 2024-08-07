import { gql, useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Button, Heading, useTheme, VStack, Row, Column, useBreakpointValue } from 'native-base';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NotificationAlert from '../../components/notifications/NotificationAlert';

import WithNavigation from '../../components/WithNavigation';
import AlertMessage from '../../widgets/AlertMessage';
import ProfileSettingItem from '../../widgets/ProfileSettingItem';
import ProfileSettingRow from '../../widgets/ProfileSettingRow';
import { GradeSelector, GradeTag } from '../../components/GradeSelector';

type Props = {};

const ChangeSettingSchoolClass: React.FC<Props> = () => {
    const { space, sizes } = useTheme();

    const { t } = useTranslation();

    const [showError, setShowError] = useState<boolean>();

    const navigate = useNavigate();

    const { data, loading } = useQuery(
        gql`
            query GetPupilSchool {
                me {
                    pupil {
                        schooltype
                        gradeAsInt
                    }
                }
            }
        `,
        {
            fetchPolicy: 'no-cache',
        }
    );

    const [updateSchoolGrade, _updateSchoolGrade] = useMutation(gql`
        mutation updateSchoolGradePupil($grade: Int!) {
            meUpdate(update: { pupil: { gradeAsInt: $grade } })
        }
    `);

    const [selectedGrade, setSelectedGrade] = useState<number>(1);

    useEffect(() => {
        if (data?.me?.pupil?.gradeAsInt) {
            setSelectedGrade(data?.me?.pupil?.gradeAsInt);
        }
    }, [data?.me?.pupil?.gradeAsInt]);

    useEffect(() => {
        if (_updateSchoolGrade.data && !_updateSchoolGrade.error) {
            // setUserSettingChanged(true)
            navigate('/profile', { state: { showSuccessfulChangeAlert: true } });
        }
    }, [_updateSchoolGrade.data, _updateSchoolGrade.error, navigate]);

    useEffect(() => {
        if (_updateSchoolGrade.error) {
            setShowError(true);
        }
    }, [_updateSchoolGrade.error]);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Profil Einstellungen – Klasse',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <CenterLoadingSpinner />;

    return (
        <WithNavigation headerTitle={t('profile.SchoolClass.single.header')} showBack headerLeft={<NotificationAlert />}>
            <VStack paddingX={space['1.5']} space={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                <Heading>{t('profile.SchoolClass.single.title')}</Heading>
                <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
                    <Row flexWrap="wrap" width="100%">
                        <Column marginRight={3} marginBottom={3} key={`selection-${selectedGrade}`}>
                            <GradeTag grade={selectedGrade} />
                        </Column>
                    </Row>
                </ProfileSettingItem>
            </VStack>
            <VStack paddingX={space['1.5']} space={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                <ProfileSettingRow title={t('profile.SchoolClass.single.others')}>
                    <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
                        <VStack w="100%">
                            <Row flexWrap="wrap" width="100%">
                                <GradeSelector onGradeChange={setSelectedGrade} omitGrades={[selectedGrade]} />
                            </Row>
                            {/* {selections.includes('Andere') && (
                <Row>
                  <FormControl>
                    <Stack>
                      <FormControl.Label>
                        <Text bold>
                          {t('profile.SchoolClass.single.optional.label')}
                        </Text>
                      </FormControl.Label>
                      <Input
                        type="text"
                        multiline
                        numberOfLines={3}
                        h={70}
                        placeholder={t(
                          'profile.SchoolClass.single.optional.placeholder'
                        )}
                      />
                    </Stack>
                  </FormControl>
                </Row>
              )} */}
                        </VStack>
                    </ProfileSettingItem>
                </ProfileSettingRow>
            </VStack>
            <VStack paddingX={space['1.5']} paddingBottom={space['1.5']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                {/* {userSettingChanged && (
          <Alert marginY={3} colorScheme="success" status="success">
            <VStack space={2} flexShrink={1} w="100%">
              <HStack
                flexShrink={1}
                space={2}
                alignItems="center"
                justifyContent="space-between">
                <HStack space={2} flexShrink={1} alignItems="center">
                  <Alert.Icon />
                  <Text>{t('profile.successmessage')}</Text>
                </HStack>
              </HStack>
            </VStack>
          </Alert>
        )} */}
                {showError && <AlertMessage content={t('profile.errormessage')} />}
                <Button width={ButtonContainer} onPress={() => updateSchoolGrade({ variables: { grade: selectedGrade } })}>
                    {t('saveSelection')}
                </Button>
            </VStack>
        </WithNavigation>
    );
};
export default ChangeSettingSchoolClass;
