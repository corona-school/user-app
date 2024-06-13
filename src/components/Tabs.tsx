import { Text, Row, VStack, Box, Pressable, useTheme, Badge, Stack } from 'native-base';
import { Fragment, ReactNode, useEffect, useMemo, useState } from 'react';

export type Tab = {
    id?: string;
    title: string;
    badge?: number;
    content: ReactNode | ReactNode[];
    hide?: boolean;
};

type TabItemProps = {
    tab: Tab;
    active: boolean;
    onPress: () => void;
};

export type TabsProps = {
    tabs: Tab[];
    removeSpace?: boolean;
    onPressTab?: (tab: Tab, index: number) => any;
    tabInset?: number | string;
    currentTabIndex?: number;
};

const TabItem = ({ tab, active, onPress }: TabItemProps) => {
    const { space } = useTheme();
    return (
        <Pressable onPress={onPress}>
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
};

const Tabs: React.FC<TabsProps> = ({ tabs, removeSpace = false, onPressTab, tabInset, currentTabIndex: controlledTabIndex }) => {
    const [currentIndex, setCurrentIndex] = useState(controlledTabIndex ?? 0);
    const { space } = useTheme();

    useEffect(() => {
        if (controlledTabIndex !== undefined) {
            setCurrentIndex(controlledTabIndex);
        }
    }, [controlledTabIndex]);

    const renderableTabs = useMemo(() => tabs.filter((tab: Tab) => !!tab && !tab.hide), [tabs]);

    const handleOnPressTab = (pressedTabIndex: number) => {
        // If the component is being controlled we don't need to update the state ourselves, the parent component
        // should take care of it
        const isControlled = controlledTabIndex !== undefined && onPressTab !== undefined;
        if (!isControlled) {
            setCurrentIndex(pressedTabIndex);
        }

        onPressTab && onPressTab(renderableTabs[pressedTabIndex], pressedTabIndex);
    };

    return (
        <VStack flex={1}>
            <Row overflowX="scroll" flexWrap="nowrap" width="100%" paddingX={tabInset} borderBottomColor="primary.grey" borderBottomWidth={1}>
                {renderableTabs.map((tab: Tab, i) => (
                    <TabItem key={`tab-${i}`} tab={tab} onPress={() => handleOnPressTab(i)} active={i === currentIndex} />
                ))}
            </Row>
            <Box paddingX={removeSpace === false ? space['1'] : ''} paddingY={space['1.5']} flex={1}>
                {renderableTabs.map((tab: Tab, i) => i === currentIndex && <Fragment key={`tabcontent-${i}`}>{tab.content}</Fragment>)}
            </Box>
        </VStack>
    );
};
export default Tabs;
