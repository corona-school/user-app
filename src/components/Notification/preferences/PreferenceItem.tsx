import {
  Box,
  HStack,
  VStack,
  Text,
  Pressable,
  Circle,
  Spacer,
  Switch,
  useBreakpointValue,
  Tooltip
} from 'native-base'
import { useState } from 'react'

type Props = {
  id: number
  title: string
  icon: JSX.Element
}

const PreferenceItem: React.FC<Props> = ({ id, title, icon }) => {
  const [checked, setChecked] = useState(true)

  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  const maxW = useBreakpointValue({
    base: 200,
    lg: '100%'
  })

  const width = useBreakpointValue({
    base: 300,
    lg: '100%'
  })
  // TODO check enabled preferences => setChecked
  const handleToggle = () => {
    setChecked(!checked)
  }

  return (
    <>
      <Box
        borderBottomWidth={1}
        borderBottomColor={'#F7F7F7'}
        py={3}
        width={width}>
        <HStack alignItems="center" space={1}>
          <VStack>{icon}</VStack>
          <VStack maxW={maxW}>
            <Text
              bold
              fontSize="md"
              mr="3"
              ellipsizeMode="tail"
              numberOfLines={2}>
              {title}
            </Text>
          </VStack>
          <VStack>
            {isMobile ? (
              <Pressable onPress={() => console.log('open info modal')}>
                <Circle rounded="full" bg="amber.700" size={4}>
                  <Box _text={{ color: 'white' }}>i</Box>
                </Circle>
              </Pressable>
            ) : (
              <Tooltip label="Testlabel">
                <Circle rounded="full" bg="amber.700" size={4}>
                  <Box _text={{ color: 'white' }}>i</Box>
                </Circle>
              </Tooltip>
            )}
          </VStack>
          <Spacer />
          <VStack>
            <Switch isChecked={checked} onToggle={handleToggle} />
          </VStack>
        </HStack>
      </Box>
    </>
  )
}

export default PreferenceItem
