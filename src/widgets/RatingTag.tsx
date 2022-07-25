import { View, Text, FavouriteIcon } from 'native-base'
import Tag from '../components/Tag'

type Props = {
  rating: string
}

const RatingTag: React.FC<Props> = ({ rating }) => {
  return <Tag text={rating} variant="rating" afterElement={<FavouriteIcon />} />
}
export default RatingTag
