import { Text, Box, useTheme } from 'native-base'
import { ReactNode } from 'react'
import Card from '../components/Card'

type Props = {
  title: string
  content?: string
  icon?: ReactNode | ReactNode[]
}

const ServiceOfferCard: React.FC<Props> = ({ title, content, icon }) => {
  const { space } = useTheme()
  return (
    <Card flexibleWidth={ icon ? false : true }>
      <Box h={ icon ? 220 : 120 } padding={space['1']} justifyContent={ icon ? 'center' : 'flex-end' }>

        {icon && (
          <Box mb={3}>
            {icon}
          </Box> 
        )}

        <Text fontSize="md" bold mb={1}>
          {title}
        </Text>

        {content && (
          <Text fontSize="sm">
            {content}
          </Text> 
        )}

      </Box>
    </Card>
  )
}
export default ServiceOfferCard
