import { Text, Box, useTheme } from 'native-base'
import Card from '../components/Card'

type Props = {
  title: string
}

const ServiceOfferCard: React.FC<Props> = ({ title }) => {
  const { space } = useTheme()
  return (
    <Card flexibleWidth>
      <Box h="120" padding={space['1']} justifyContent="flex-end">
        <Text fontSize="md" bold>
          {title}
        </Text>
      </Box>
    </Card>
  )
}
export default ServiceOfferCard
