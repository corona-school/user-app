import {
  Box,
  HStack,
  VStack,
  Text,
  Pressable,
  Circle,
  Spacer,
  Switch
} from 'native-base'
import { useState } from 'react'

type Props = {
  id: number
  title: string
  icon: JSX.Element
}

const PreferenceItem: React.FC<Props> = ({ id, title, icon }) => {
  const [checked, setChecked] = useState(true)

  // TODO check enabled preferences => setChecked
  const handleToggle = () => {
    setChecked(!checked)
  }
  return (
    <>
      <Box borderBottomWidth={1} borderBottomColor={'#F7F7F7'} py={3}>
        <HStack alignItems="center" space={1}>
          <VStack>{icon}</VStack>
          <VStack>
            <HStack>
              <Text bold fontSize="md" mr="3">
                {title}
              </Text>
              <Pressable onPress={() => console.log('open info modal')}>
                <Circle rounded="full" bg="amber.700" size={4}>
                  <Box _text={{ color: 'white' }}>i</Box>
                </Circle>
              </Pressable>
            </HStack>
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
