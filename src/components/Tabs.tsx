import { View, Text, Row, VStack, Box, Pressable, useTheme } from 'native-base'
import { ReactNode, useState } from 'react'

type Tab = {
  title: string
  content: ReactNode | ReactNode[]
}
type Props = {
  tabs: Tab[]
  onPressTab?: (tab: Tab) => any
}

const Tabs: React.FC<Props> = ({ tabs, onPressTab }) => {
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
        onPressTab && onPressTab(tab)
      }}>
      <Box
        borderBottomWidth={(active && 3) || 1}
        paddingX={space['1']}
        paddingY={space['0.5']}>
        <Text>{tab.title}</Text>
      </Box>
    </Pressable>
  )

  return (
    <VStack>
      <Row overflowX={'scroll'} flexWrap="nowrap">
        {tabs.map(
          (tab, i) => (
            <Tab
              key={`tab-${i}`}
              tab={tab}
              index={i}
              active={i === currentIndex}
            />
          ),
          []
        )}
      </Row>
      <Box>{tabs.map((tab, i) => i === currentIndex && tab.content)}</Box>
    </VStack>
  )
}
export default Tabs
