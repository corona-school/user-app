import { gql } from './../gql';
import { useQuery } from '@apollo/client';
import { View, Text, VStack, Center, CircleIcon, Row, useTheme, Pressable, Badge, Spacer, Button } from 'native-base';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLernfair from '../hooks/useLernfair';
import { NavigationItems } from '../types/navigation';
import CSSWrapper from './CSSWrapper';
import { useUserType } from '../hooks/useApollo';
import HalfStarIcon from '../assets/icons/icon_half_star_filled.svg';
import { useTranslation } from 'react-i18next';
import AppFeedbackModal from '../modals/AppFeedbackModal';

type Props = {
    show?: boolean;
    navItems: NavigationItems;
    paddingTop?: string | number;
    unreadMessagesCount?: number;
};

const SideBarMenu: React.FC<Props> = ({ show, navItems, paddingTop, unreadMessagesCount }) => {
    const { t } = useTranslation();
    const { space, colors } = useTheme();
    const { rootPath, setRootPath } = useLernfair();
    const navigate = useNavigate();
    const userType = useUserType();
    const [isOpen, setIsOpen] = useState(false);

    const { data, loading } = useQuery(
        gql(`
            query GetRolesSidebar {
                myRoles
            }
        `)
    );

    const disableGroup: boolean = useMemo(() => {
        if (!data) return true;
        if (userType === 'screener') return !data?.myRoles.includes('COURSE_SCREENER');
        if (userType === 'pupil') return !data?.myRoles.includes('PARTICIPANT');
        return false;
    }, [data, userType]);

    const disableChat: boolean = useMemo(() => {
        if (!data) return true;
        if (userType === 'screener') return true;
        return false;
    }, [userType, data]);

    const disableMatching: boolean = useMemo(() => {
        if (!data) return true;
        if (userType === 'screener') return true;
        if (userType === 'pupil') return !data?.myRoles.includes('TUTEE');
        return false;
    }, [data, userType]);

    const hideForStudents = useMemo(() => {
        if (!data) return true;
        if (['screener', 'pupil'].includes(userType)) return true;
        return false;
    }, [data, userType]);

    const hideForPupils = useMemo(() => {
        if (!data) return true;
        if (['screener', 'student'].includes(userType)) return true;
        return false;
    }, [data, userType]);

    if (loading) return <></>;

    return (
        (show && (
            <View w="240" h="100dvh">
                <VStack
                    paddingTop={paddingTop}
                    paddingBottom="6"
                    position="fixed"
                    bgColor={'lightText'}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    style={{
                        shadowColor: '#000000',
                        shadowOpacity: 0.1,
                        shadowRadius: 30,
                        shadowOffset: { width: 2, height: 2 },
                    }}
                    w="240"
                    top="0"
                    left="0"
                    bottom="0"
                >
                    <VStack>
                        {Object.entries(navItems).map(([key, { label, icon: Icon, disabled: _disabled }]) => {
                            const disabled =
                                _disabled || (key === 'matching' && disableMatching) || (key === 'group' && disableGroup) || (key === 'chat' && disableChat);
                            const isHidden = (key === 'knowledge-helper' && hideForStudents) || (key === 'knowledge-pupil' && hideForPupils);
                            if (isHidden) return <></>;

                            return (
                                <Pressable
                                    onPress={
                                        disabled
                                            ? undefined
                                            : () => {
                                                  setRootPath && setRootPath(`${key}`);
                                                  navigate(`/${key}`);
                                              }
                                    }
                                    key={key}
                                >
                                    <Row alignItems={'center'} paddingX={space['1']} paddingY="15px">
                                        <Center>
                                            <CSSWrapper className="navigation__item">
                                                <CircleIcon size="35px" color={disabled ? 'transparent' : key === rootPath ? 'primary.900' : 'transparent'} />
                                                <CSSWrapper className="navigation__item__icon">
                                                    <Icon
                                                        fill={
                                                            disabled ? colors['gray']['300'] : key === rootPath ? colors['lightText'] : colors['primary']['900']
                                                        }
                                                        isActive={key === rootPath}
                                                    />
                                                </CSSWrapper>
                                            </CSSWrapper>
                                        </Center>
                                        <Text fontSize="lg" fontWeight="500" color={disabled ? colors['gray']['300'] : undefined} marginLeft={space['0.5']}>
                                            {label}
                                        </Text>

                                        {key === 'chat' && !!unreadMessagesCount && (
                                            <>
                                                <Spacer />
                                                <Badge bgColor="danger.500" _text={{ color: 'white' }} rounded="full">
                                                    {unreadMessagesCount}
                                                </Badge>
                                            </>
                                        )}
                                    </Row>
                                </Pressable>
                            );
                        })}
                    </VStack>
                    <Button
                        variant="outline"
                        width="80%"
                        alignSelf="center"
                        leftIcon={<HalfStarIcon color={colors.primary[900]} />}
                        onPress={() => setIsOpen(true)}
                    >
                        {t('appFeedback.giveFeedbackButton')}
                    </Button>
                </VStack>
                <AppFeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </View>
        )) || <></>
    );
};
export default SideBarMenu;
