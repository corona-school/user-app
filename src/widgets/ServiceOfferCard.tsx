import { Text, Box, useTheme, Image } from 'native-base'
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
    <Card flexibleWidth={icon ? false : true}>
      <Image
        position="absolute"
        w="100%"
        h="100%"
        source={{
          uri: 'https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
        }}
      />
      <Box
        background="primary.darkTranslucent"
        h={icon ? 220 : 120}
        padding={space['1']}
        justifyContent={icon ? 'center' : 'flex-end'}>
        {icon && <Box mb={3}>{icon}</Box>}

        <Text color="lightText" fontSize="md" bold mb={1}>
          {title}
        </Text>

        {content && (
          <Text color="lightText" fontSize="sm">
            {content}
          </Text>
        )}
      </Box>
    </Card>
  )
}
export default ServiceOfferCard
