import { Row, CircleIcon, useTheme, Center, Text, Box, Pressable } from 'native-base';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationItems } from '../types/navigation';
import CSSWrapper from './CSSWrapper';
import '../web/scss/components/BottomNavigationBar.scss';
import useLernfair from '../hooks/useLernfair';
import { gql, useQuery } from '@apollo/client';

type Props = {
    show?: boolean;
    navItems: NavigationItems;
};

const BottomNavigationBar: React.FC<Props> = ({ show = true, navItems }) => {
    const { space, colors } = useTheme();
    const navigate = useNavigate();
    const { rootPath, setRootPath } = useLernfair();

    const { data, loading } = useQuery(
        gql`
            query GetRoles {
                myRoles
            }
        `
    );

    const disableGroup: boolean = useMemo(() => {
        if (!data) return true;
        return !data?.myRoles.includes('INSTRUCTOR') && !data?.myRoles.includes('PARTICIPANT');
    }, [data]);

    const disableMatching: boolean = useMemo(() => {
        if (!data) return true;
        return !data?.myRoles.includes('TUTOR') && !data?.myRoles.includes('TUTEE');
    }, [data]);

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
                        const disabled = _disabled || (key === 'group' && disableGroup) || (key === 'matching' && disableMatching);

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
                                <CSSWrapper className="navigation__item">
                                    <Center>
                                        <Box>
                                            <CircleIcon size="35px" color={disabled ? 'transparent' : key === rootPath ? 'primary.900' : 'transparent'} />
                                            <CSSWrapper className={`navigation__item__icon ${!disabled && key === rootPath ? 'active' : ''}`}>
                                                <Icon
                                                    fill={disabled ? colors['gray']['300'] : key === rootPath ? colors['lightText'] : colors['primary']['900']}
                                                />
                                            </CSSWrapper>
                                        </Box>
                                        <Text fontSize="xs" color={disabled ? colors['gray']['300'] : colors['primary']['900']}>
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
