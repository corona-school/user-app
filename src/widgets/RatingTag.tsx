import { View, Text, FavouriteIcon } from 'native-base'
import Tag from '../components/Tag'

type Props = {
  rating: string
}

const RatingTag: React.FC<Props> = ({ rating }) => {
  return (
    <Tag
      borderRadius={15}
      paddingX={3}
      isReview
      text={rating}
      variant="rating"
      afterElement={<FavouriteIcon color="yellow.500" />}
    />
  )
}
export default RatingTag
