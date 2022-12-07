import { ArrowBackIcon } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { useNavigate } from 'react-router-dom'

type Props = {
  onPress?: () => any
}

const BackButton: React.FC<Props> = ({ onPress }) => {
  const navigate = useNavigate()
  return (
    <TouchableOpacity onPress={onPress || (() => navigate(-1))}>
      <ArrowBackIcon size="xl" color="lightText" />
    </TouchableOpacity>
  )
}
export default BackButton
