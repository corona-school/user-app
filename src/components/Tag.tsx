import { View, Text } from 'native-base'

type Props = {
  text: string
}

const Tag: React.FC<Props> = ({ text }) => {
  return (
    <Text fontSize={'xs'} padding="1" bg={'gray.300'} borderRadius={4}>
      {text}
    </Text>
  )
}
export default Tag
