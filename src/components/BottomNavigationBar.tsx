import { Row, CircleIcon, useTheme, Center, Text, Box, Pressable, Flex, Circle, useBreakpointValue } from 'native-base';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationItems } from '../types/navigation';
import CSSWrapper from './CSSWrapper';
import '../web/scss/components/BottomNavigationBar.scss';
import useLernfair from '../hooks/useLernfair';
import { gql } from './../gql';
import { useQuery } from '@apollo/client';
import { useUserType } from '../hooks/useApollo';

type Props = {
    show?: boolean;
    navItems: NavigationItems;
    unreadMessagesCount?: number;
};

const BottomNavigationBar: React.FC<Props> = ({ show = true, navItems, unreadMessagesCount }) => {
    const { space, colors } = useTheme();
    const navigate = useNavigate();
    const { rootPath, setRootPath } = useLernfair();
    const userType = useUserType();

    const { data, loading } = useQuery(
        gql(`
            query GetRoles {
                myRoles
            }
        `)
    );
    const disableGroup: boolean = useMemo(() => {
        if (!data) return true;
        if (userType === 'screener') return true;
        if (userType === 'pupil') return !data?.myRoles.includes('PARTICIPANT');
        return false;
    }, [userType, data]);

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
    }, [userType, data]);

    const badgeAlign = useBreakpointValue({
        base: 0,
        lg: 2,
    });

    if (loading) return <></>;

    return (
        (show && (
            <>
                <Row paddingTop="65px" />
                <Row
                    w="100%"
                    h={'54px'}
                    position="fixed"
                    left="0"
                    right="0"
                    bottom="0"
                    bgColor="lightText"
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    paddingX={space['1']}
                    paddingY={space['2']}
                    style={{
                        shadowColor: '#000000',
                        shadowOpacity: 0.12,
                        shadowRadius: 2,
                        shadowOffset: { width: -1, height: -3 },
                    }}
                >
                    {Object.entries(navItems).map(([key, { label, icon: Icon, disabled: _disabled }]) => {
                        const disabled =
                            _disabled || (key === 'matching' && disableMatching) || (key === 'group' && disableGroup) || (key === 'chat' && disableChat);

                        return (
                            <Pressable
                                onPress={() => {
                                    if (disabled) return;
                                    setRootPath && setRootPath(`${key}`);
                                    navigate(`/${key}`);
                                }}
                                key={key}
                            >
                                {key === 'chat' && !!unreadMessagesCount && (
                                    <Circle bgColor="danger.500" size="4" position="absolute" zIndex="1" mx="6">
                                        <Text fontSize="xs" color="white">
                                            {unreadMessagesCount}
                                        </Text>
                                    </Circle>
                                )}
                                <CSSWrapper className="navigation__item">
                                    <Center>
                                        <Box>
                                            <CircleIcon size="35px" color={key === rootPath ? 'primary.900' : 'transparent'} />
                                            <CSSWrapper className={`navigation__item__icon ${key === rootPath ? 'active' : ''}`}>
                                                <Flex>
                                                    <Icon
                                                        fill={
                                                            key === rootPath
                                                                ? colors['lightText']
                                                                : !disabled
                                                                ? colors['primary']['900']
                                                                : colors['gray']['300']
                                                        }
                                                    />
                                                </Flex>
                                            </CSSWrapper>
                                        </Box>
                                        <Text fontSize="xs" color={!disabled ? colors['primary']['900'] : colors['gray']['300']}>
                                            {label}
                                        </Text>
                                    </Center>
                                </CSSWrapper>
                            </Pressable>
                        );
                    })}
                </Row>
            </>
        )) || <></>
    );
};
export default BottomNavigationBar;
