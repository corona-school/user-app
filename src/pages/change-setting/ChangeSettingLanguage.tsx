import { gql, useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Button, Text, Heading, useTheme, VStack, Row, Column, useBreakpointValue } from 'native-base';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { useNavigate } from 'react-router-dom';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import WithNavigation from '../../components/WithNavigation';
import { useUserType } from '../../hooks/useApollo';
import { languages } from '../../types/lernfair/Language';
import AlertMessage from '../../widgets/AlertMessage';
import IconTagList from '../../widgets/IconTagList';
import ProfileSettingItem from '../../widgets/ProfileSettingItem';
import ProfileSettingRow from '../../widgets/ProfileSettingRow';

const queryStudent = gql`
    query GetStudentLanguages {
        me {
            student {
                languages
            }
        }
    }
`;
const queryPupil = gql`
    query GetPupilLanguages {
        me {
            pupil {
                languages
            }
        }
    }
`;
const mutStudent = gql`
    mutation updateLanguageStudent($languages: [StudentLanguage!]) {
        meUpdate(update: { student: { languages: $languages } })
    }
`;
const mutPupil = gql`
    mutation updateLanguagePupil($languages: [Language!]) {
        meUpdate(update: { pupil: { languages: $languages } })
    }
`;

type Props = {};

const ChangeSettingLanguage: React.FC<Props> = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();

    const [selections, setSelections] = useState<string[]>([]);

    const [showError, setShowError] = useState<boolean>();
    const userType = useUserType();

    const navigate = useNavigate();

    const { data, loading } = useQuery(userType === 'student' ? queryStudent : queryPupil, {
        fetchPolicy: 'no-cache',
    });

    const [updateLanguage, _updateLanguage] = useMutation(userType === 'student' ? mutStudent : mutPupil);

    useEffect(() => {
        if (data?.me[userType || 'pupil'] && data?.me[userType || 'pupil'].languages) {
            setSelections(data?.me[userType || 'pupil'].languages);
        }
    }, [data?.me, userType]);

    useEffect(() => {
        if (_updateLanguage.data && !_updateLanguage.error) {
            // setUserSettingChanged(true)
            navigate('/profile', { state: { showSuccessfulChangeAlert: true } });
        }
    }, [_updateLanguage.data, _updateLanguage.error, navigate]);

    useEffect(() => {
        if (_updateLanguage.error) {
            setShowError(true);
        }
    }, [_updateLanguage.error]);

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
            documentTitle: 'Profil Einstellungen – Sprache',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <WithNavigation headerTitle={t('profile.Languages.single.header')} showBack isLoading={loading} headerLeft={<NotificationAlert />}>
            <VStack paddingX={space['1.5']} space={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                <Heading>{t('profile.Languages.single.title')}</Heading>
                <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
                    <Row flexWrap="wrap" width="100%">
                        {selections.map((language, index) => (
                            <Column marginRight={3} marginBottom={3} key={`selection-${index}`}>
                                <TouchableOpacity
                                    onPress={() =>
                                        setSelections((prev) => {
                                            const res = [...prev];
                                            res.splice(index, 1);
                                            return res;
                                        })
                                    }
                                >
                                    <Row alignItems="center" justifyContent="center">
                                        <IconTagList
                                            isDisabled
                                            icon={language.toLowerCase()}
                                            text={t(`lernfair.languages.${language.toLowerCase()}` as unknown as TemplateStringsArray)}
                                        />
                                        <Text color={'danger.500'} fontSize="xl" ml="1" bold>
                                            x
                                        </Text>
                                    </Row>
                                </TouchableOpacity>
                            </Column>
                        ))}
                    </Row>
                </ProfileSettingItem>
            </VStack>
            <VStack paddingX={space['1.5']} space={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                <ProfileSettingRow title={t('profile.Languages.single.others')}>
                    <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
                        <VStack w="100%">
                            <Row flexWrap="wrap" width="100%">
                                {languages.map(
                                    (language, index) =>
                                        !selections.find((sel) => sel === language.key) && (
                                            <Column marginRight={3} marginBottom={3} key={`offers-${index}`}>
                                                <IconTagList
                                                    initial={false}
                                                    icon={language.key.toLowerCase()}
                                                    text={t(`lernfair.languages.${language.key.toLowerCase()}` as unknown as TemplateStringsArray)}
                                                    onPress={() => {
                                                        setSelections((prev) => [...prev, language.key]); // 'Französisch' (display name) -> 'franz_sisch' (key)
                                                    }}
                                                />
                                            </Column>
                                        )
                                )}
                            </Row>
                        </VStack>
                    </ProfileSettingItem>
                </ProfileSettingRow>
            </VStack>
            <VStack paddingX={space['1.5']} paddingBottom={space['1.5']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                {showError && <AlertMessage content={t('profile.errormessage')} />}
                <Button
                    width={ButtonContainer}
                    onPress={() => {
                        //language keys are lowercase in frontend; on backend the first letter is capitalized
                        updateLanguage({ variables: { languages: selections } });
                    }}
                >
                    {t('saveSelection')}
                </Button>
            </VStack>
        </WithNavigation>
    );
};
export default ChangeSettingLanguage;
