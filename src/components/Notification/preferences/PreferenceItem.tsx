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
  Tooltip,
  Modal,
  useTheme
} from 'native-base'
import { useState } from 'react'
import InformationModal from './InformationModal'
import { Preferences } from './PreferencesData'

const PreferenceItem: React.FC<Preferences> = ({ id, title, icon, modal }) => {
  const [checked, setChecked] = useState<boolean>(true)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { colors } = useTheme()

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
              <>
                {isMobile ? (
                  <Box>
                    <Pressable ml={1} onPress={() => setOpenModal(true)}>
                      <Circle rounded="full" bg="amber.700" size={4}>
                        <Text color={'white'}>i</Text>
                      </Circle>
                    </Pressable>
                    <Modal
                      bg="modalbg"
                      isOpen={openModal}
                      onClose={() => setOpenModal(false)}>
                      <InformationModal
                        onPressClose={() => setOpenModal(false)}
                        header={title}
                        body={modal.body}
                        icon={modal.icon}
                      />
                    </Modal>
                  </Box>
                ) : (
                  <Tooltip
                    maxWidth={270}
                    label={modal.body}
                    bg={colors['primary']['900']}
                    _text={{ textAlign: 'center' }}
                    hasArrow>
                    <Circle rounded="full" bg="amber.700" size={4} ml={1}>
                      <Text color={'white'}>i</Text>
                    </Circle>
                  </Tooltip>
                )}
              </>
            </Text>
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
