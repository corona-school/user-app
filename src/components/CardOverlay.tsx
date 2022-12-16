import { CheckIcon, Circle } from 'native-base'
import { Box } from 'native-base'

const CardOverlay: React.FC<{
  children: JSX.Element
  selected?: boolean
}> = ({ children, selected }) => {
  return (
    <Box>
      {selected && (
        <Box
          zIndex="100"
          w="100%"
          h="100%"
          borderRadius={8}
          top="0"
          left="0"
          display={'flex'}
          position="absolute"
          pointerEvents="none"
          justifyContent={'center'}
          alignItems={'center'}>
          <Box
            position="absolute"
            background={'primary.900'}
            opacity={0.7}
            top="0"
            left="0"
            w="100%"
            h="100%"
            borderRadius={8}></Box>
          <Circle size={'lg'} background="lightText">
            <CheckIcon color="primary.900" size="64px" />
          </Circle>
        </Box>
      )}
      {children}
    </Box>
  )
}
export default CardOverlay
