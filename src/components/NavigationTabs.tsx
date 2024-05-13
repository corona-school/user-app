import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRestoredNumberState } from '../hooks/useScrollRestoration';
import Tabs, { type Tab as BaseTab, type TabsProps } from './Tabs';

export type Tab = BaseTab;

type NavigationTabsProps = TabsProps;

const NavigationTabs: React.FC<NavigationTabsProps> = ({ tabs, removeSpace = false, onPressTab, tabInset }) => {
    const [currentIndex, setCurrentIndex] = useRestoredNumberState(0, 'tab');
    const location = useLocation();
    const navigate = useNavigate();
    const tabIDState = location.state as { tabID: number };

    useEffect(() => {
        if (tabIDState?.tabID !== undefined) {
            setCurrentIndex(tabIDState.tabID);
        }
    }, [tabIDState]);

    const handleOnPressNavigationTab = (tab: Tab, pressedTabIndex: number) => {
        setCurrentIndex(pressedTabIndex);
        navigate('', { replace: true, state: { tabID: pressedTabIndex } });
        onPressTab && onPressTab(tab, pressedTabIndex);
    };

    return <Tabs tabs={tabs} onPressTab={handleOnPressNavigationTab} removeSpace={removeSpace} tabInset={tabInset} currentTabIndex={currentIndex} />;
};
export default NavigationTabs;
