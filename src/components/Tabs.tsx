import { Text, Row, VStack, Box, Pressable, useTheme, Badge, Stack } from 'native-base';
import { Fragment, ReactNode, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRestoration, useRestoredNumberState } from '../hooks/useScrollRestoration';

export type Tab = {
    title: string;
    badge?: number;
    content: ReactNode | ReactNode[];
    hide?: boolean;
};
type Props = {
    tabs: Tab[];
    removeSpace?: boolean;
    onPressTab?: (tab: Tab, index: number) => any;
    tabInset?: number | string;
};

const Tabs: React.FC<Props> = ({ tabs, removeSpace = false, onPressTab, tabInset }) => {
    const [currentIndex, setCurrentIndex] = useRestoredNumberState(0, 'tab');
    const { space } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const tabIDState = location.state as { tabID: number };

    useEffect(() => {
        if (tabIDState?.tabID !== undefined) {
            setCurrentIndex(tabIDState.tabID);
        }
    }, [tabIDState]);

    const Tab = ({ tab, index, active }: { tab: Tab; index: number; active: boolean }) => (
        <Pressable
            onPress={() => {
                navigate('', { replace: true, state: { tabID: index } });
                setCurrentIndex(index);
                onPressTab && onPressTab(tab, index);
            }}
        >
            <Stack
                borderBottomWidth={(active && 3) || 1}
                borderBottomColor={active ? 'primary.400' : 'transparent'}
                paddingX={space['1']}
                paddingY={space['0.5']}
                direction={'row'}
                space={space['0.5']}
            >
                <Text fontSize="md" bold={active ? true : false} color={active ? 'primary.900' : 'primary.grey'}>
                    {tab?.title}
                </Text>
                {tab.badge && tab.badge !== 0 ? (
                    <Badge bg={'primary.500'} _text={{ color: 'white' }} rounded="sm">
                        {tab.badge}
                    </Badge>
                ) : null}
            </Stack>
        </Pressable>
    );

    const renderableTabs = useMemo(() => tabs.filter((tab: Tab) => !!tab && !tab.hide), [tabs]);

    return (
        <VStack>
            <Row overflowX="scroll" flexWrap="nowrap" width="100%" paddingX={tabInset} borderBottomColor="primary.grey" borderBottomWidth={1}>
                {renderableTabs.map((tab: Tab, i) => (
                    <Tab key={`tab-${i}`} tab={tab} index={i} active={i === currentIndex} />
                ))}
            </Row>
            <Box paddingX={removeSpace === false ? space['1'] : ''} paddingY={space['1.5']}>
                {renderableTabs.map((tab: Tab, i) => i === currentIndex && <Fragment key={`tabcontent-${i}`}>{tab.content}</Fragment>)}
            </Box>
        </VStack>
    );
};
export default Tabs;
