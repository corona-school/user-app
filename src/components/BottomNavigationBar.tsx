import { Row, CircleIcon, useTheme, Center, Text, Box, Pressable, Flex, Circle, useBreakpointValue } from 'native-base';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationItems } from '../types/navigation';
import CSSWrapper from './CSSWrapper';
import '../web/scss/components/BottomNavigationBar.scss';
import useLernfair from '../hooks/useLernfair';
import { gql } from './../gql';
import { useQuery } from '@apollo/client';
import { useRoles, useUser, useUserType } from '../hooks/useApollo';

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
    const userRoles = useRoles();

    const disableGroup: boolean = useMemo(() => {
        if (userType === 'screener') return !userRoles.includes('COURSE_SCREENER');
        if (userType === 'pupil') return !userRoles.includes('PARTICIPANT');
        return false;
    }, [userType, userRoles]);

    const disableChat: boolean = useMemo(() => {
        if (userType === 'screener') return true;
        return false;
    }, [userType]);

    const disableMatching: boolean = useMemo(() => {
        if (userType === 'screener') return true;
        if (userType === 'pupil') return userRoles.includes('TUTEE');
        return false;
    }, [userType, userRoles]);

    const badgeAlign = useBreakpointValue({
        base: 0,
        lg: 2,
    });

    return (
        (show && (
            <Box pb="env(safe-area-inset-bottom)">
                <Row
                    w="100%"
                    h={'54px'}
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

                        const isHidden = ['knowledge-helper', 'knowledge-pupil'].includes(key);
                        if (isHidden) return <></>;

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
            </Box>
        )) || <></>
    );
};
export default BottomNavigationBar;
