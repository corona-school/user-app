import { Box, useTheme } from 'native-base'

type Props = {
  isActive?: boolean
}

const Bullet: React.FC<Props> = ({ isActive = false }) => {
  return (
    <Box
      width={isActive ? '12px' : '8px'}
      height={isActive ? '12px' : '8px'}
      borderColor="primary.900"
      borderRadius="50%"
      borderWidth="1px"
      backgroundColor={isActive ? 'primary.900' : 'transparent'}
    />
  )
}
export default Bullet
