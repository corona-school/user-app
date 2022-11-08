import { Flex, Spinner } from 'native-base'

type Props = {}

const CenterLoadingSpinner: React.FC<Props> = () => {
  return (
    <Flex flex="1" h="100%" justifyContent="center" alignItems="center">
      <Spinner />
    </Flex>
  )
}
export default CenterLoadingSpinner
