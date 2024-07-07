// eslint-disable-next-line lernfair-app-linter/typed-gql
import { gql, useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Button, useTheme, VStack, Row, Column, useBreakpointValue, Heading, Stack } from 'native-base';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import WithNavigation from '../../components/WithNavigation';
import { useUserType } from '../../hooks/useApollo';
import { states } from '../../types/lernfair/State';
import AlertMessage from '../../widgets/AlertMessage';
import IconTagList from '../../widgets/IconTagList';
import ProfileSettingItem from '../../widgets/ProfileSettingItem';
import ProfileSettingRow from '../../widgets/ProfileSettingRow';
import LangNavigation from '../../components/LangNavigation';

const queryPupil = gql(`
    query GetPupilState {
        me {
            pupil {
                state
            }
        }
    }
`);
const queryStudent = gql(`
    query GetStudentState {
        me {
            student {
                state
            }
        }
    }
`);

const mutStudent = gql(`
    mutation updateStateStudent($state: StudentState!) {
        meUpdate(update: { student: { state: $state } })
    }
`);
const mutPupil = gql(`
    mutation updateStatePupil($state: State!) {
        meUpdate(update: { pupil: { state: $state } })
    }
`);

type Props = {};

const ChangeSettingState: React.FC<Props> = () => {
    const { space, sizes } = useTheme();

    const [userState, setUserState] = useState<string>('');
    const { t } = useTranslation();

    const [showError, setShowError] = useState<boolean>();

    const navigate = useNavigate();

    const userType = useUserType();
    const { data, loading } = useQuery(userType === 'student' ? queryStudent : queryPupil, {
        fetchPolicy: 'no-cache',
    });

    const [updateState, _updateState] = useMutation(userType === 'student' ? mutStudent : mutPupil);

    useEffect(() => {
        if (userType && data?.me[userType].state) {
            setUserState(data?.me[userType].state);
        }
    }, [data?.me, userType]);

    const state = useMemo(
        () =>
            states.find((state) => state.key === userState) || {
                key: '',
                label: '',
            },
        [userState]
    );

    useEffect(() => {
        if (_updateState.data && !_updateState.error) {
            // setUserSettingChanged(true)
            navigate('/profile', { state: { showSuccessfulChangeAlert: true } });
        }
    }, [_updateState.data, _updateState.error, navigate]);

    useEffect(() => {
        if (_updateState.error) {
            setShowError(true);
        }
    }, [_updateState.error]);

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
            documentTitle: 'Profil Einstellungen – Bundesland',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) <CenterLoadingSpinner />;

    return (
        <WithNavigation
            headerTitle={t('profile.State.single.header')}
            showBack
            headerLeft={
                <Stack alignItems="center" direction="row">
                    <LangNavigation />
                    <NotificationAlert />
                </Stack>
            }
        >
            <VStack paddingX={space['1.5']} space={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                <Heading>{t('profile.State.single.selectedStates')}</Heading>
                <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
                    <Row flexWrap="wrap" width="100%">
                        <Column marginRight={3} marginBottom={3} key={`selection-${userState}`}>
                            <IconTagList
                                isDisabled
                                textIcon={`${userState}`}
                                iconPath={`states/icon_${userState}.svg`}
                                text={t(`lernfair.states.${userState}` as unknown as TemplateStringsArray)}
                            />
                        </Column>
                    </Row>
                </ProfileSettingItem>
            </VStack>
            <VStack paddingX={space['1.5']} space={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                <ProfileSettingRow title={t('profile.State.single.otherStates')}>
                    <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
                        <VStack w="100%">
                            <Row flexWrap="wrap" width="100%">
                                {states.map((s, index) => (
                                    <Column marginRight={3} marginBottom={3} key={`offers-${index}`}>
                                        <IconTagList
                                            initial={userState === s.key}
                                            iconPath={`states/icon_${s.key}.svg`}
                                            text={t(`lernfair.states.${s.key}` as unknown as TemplateStringsArray)}
                                            onPress={() => setUserState(s.key)}
                                        />
                                    </Column>
                                ))}
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
                        updateState({ variables: { state: state.key } });
                    }}
                >
                    {t('saveSelection')}
                </Button>
            </VStack>
        </WithNavigation>
    );
};
export default ChangeSettingState;
