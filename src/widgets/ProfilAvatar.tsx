import { View, Text, Avatar } from 'native-base'

type Props = {
  image: string
  size: string
}

const ProfilAvatar: React.FC<Props> = ({ image, size }) => {
  return (
    <View>
      <Avatar
        borderWidth="2.5"
        borderColor="primary.500"
        size={size}
        source={{
          uri: image
        }}
      />
    </View>
  )
}
export default ProfilAvatar
