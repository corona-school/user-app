import { Text, Row, VStack, Box, Pressable, useTheme } from 'native-base'
import { Fragment, ReactNode, useMemo, useState } from 'react'

export type Tab = {
  title: string
  content: ReactNode | ReactNode[]
  hide?: boolean
}
type Props = {
  tabs: Tab[]
  removeSpace?: boolean
  onPressTab?: (tab: Tab, index: number) => any
  tabInset?: number | string
}

const Tabs: React.FC<Props> = ({
  tabs,
  removeSpace = false,
  onPressTab,
  tabInset
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const { space } = useTheme()

  const Tab = ({
    tab,
    index,
    active
  }: {
    tab: Tab
    index: number
    active: boolean
  }) => (
    <Pressable
      onPress={() => {
        setCurrentIndex(index)
        onPressTab && onPressTab(tab, index)
      }}>
      <Box
        borderBottomWidth={(active && 3) || 1}
        borderBottomColor={active ? 'primary.400' : 'transparent'}
        paddingX={space['1']}
        paddingY={space['0.5']}>
        <Text
          fontSize="md"
          bold={active ? true : false}
          color={active ? 'primary.900' : 'primary.grey'}>
          {tab?.title}
        </Text>
      </Box>
    </Pressable>
  )

  const renderableTabs = useMemo(
    () => tabs.filter((tab: Tab) => !!tab && !tab.hide),
    [tabs]
  )

  return (
    <VStack>
      <Row
        overflowX="scroll"
        flexWrap="nowrap"
        width="100%"
        paddingX={tabInset}
        borderBottomColor="primary.grey"
        borderBottomWidth={1}>
        {renderableTabs.map((tab: Tab, i) => (
          <Tab
            key={`tab-${i}`}
            tab={tab}
            index={i}
            active={i === currentIndex}
          />
        ))}
      </Row>
      <Box
        paddingX={removeSpace === false ? space['1'] : ''}
        paddingY={space['1.5']}>
        {tabs.map(
          (tab: Tab, i) =>
            i === currentIndex && (
              <Fragment key={`tabcontent-${i}`}>{tab.content}</Fragment>
            )
        )}
      </Box>
    </VStack>
  )
}
export default Tabs
