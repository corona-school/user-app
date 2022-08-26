import { View, useBreakpointValue, useTheme } from 'native-base'
import HeaderCard from './HeaderCard'
import { NavigationItems } from '../types/navigation'
import BottomNavigationBar from './BottomNavigationBar'
import { ReactNode, useState } from 'react'

import LFHomeIcon from '../assets/icons/lernfair/lf-home.svg'
import LFAppointmentIcon from '../assets/icons/lernfair/lf-calendar.svg'
import LFExploreIcon from '../assets/icons/lernfair/lf-discover.svg'
import LFHelpIcon from '../assets/icons/lernfair/lf-question.svg'

const navItems: NavigationItems = {
  dashboard: LFHomeIcon,
  appointments: LFAppointmentIcon,
  explore: LFExploreIcon,
  hilfebereich: LFHelpIcon
}

type Props = {
  children?: ReactNode | ReactNode[]
  headerLeft?: ReactNode | ReactNode[]
  headerRight?: ReactNode | ReactNode[]
  headerContent?: ReactNode | ReactNode[]
  headerTitle?: string
}

const WithNavigation: React.FC<Props> = ({
  children,
  headerLeft,
  headerRight,
  headerContent,
  headerTitle
}) => {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })
  const [view, setView] = useState(null)
  const { sizes } = useTheme()
  const headerHeight = sizes['headerSizePx'] - sizes['headerPaddingYPx'] * 2
  return (
    <View flex="1">
      <View
        flex="1"
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        overflow="hidden"
        w="100vw"
        h="100%"
        // marginTop={'-72px'}
        // paddingTop={'72px'}
      >
        {/* <SideBarMenu show={!isMobile} navItems={navItems} paddingTop={'72px'} /> */}
        <HeaderCard
          leftContent={headerLeft}
          rightContent={headerRight}
          title={headerTitle}
          portal={setView}>
          {headerContent}
        </HeaderCard>
        <View flex="1" overflowY={'scroll'}>
          {view && (
            <>
              <View h={`${headerHeight}px`}></View>
              {view}
            </>
          )}
          {children}
        </View>
      </View>
      <BottomNavigationBar show={isMobile} navItems={navItems} />
    </View>
  )
}
export default WithNavigation
