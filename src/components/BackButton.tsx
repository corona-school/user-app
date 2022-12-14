import { ArrowBackIcon } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { useNavigate } from 'react-router-dom'

type Props = {}

const BackButton: React.FC<Props> = () => {
  const navigate = useNavigate()
  return (
    <TouchableOpacity onPress={() => navigate(-1)}>
      <ArrowBackIcon size="xl" color="lightText" />
    </TouchableOpacity>
  )
}
export default BackButton
