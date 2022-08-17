import { View, Row, Column, Heading, Tooltip, InfoIcon, Box } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
  help?: string
}

const ProfileSettingRow: React.FC<Props> = ({ title, children, help }) => {
  return (
    <View paddingY={3}>
      <Row>
        <Column>
          <Heading fontSize="lg">{title}</Heading>
        </Column>
        {help && (
          <Tooltip label={help}>
            <Box marginLeft="10px" marginTop="3px" marginRight="10px">
              <InfoIcon color="warning.100" />
            </Box>
          </Tooltip>
        )}
      </Row>
      <Row paddingY={3} flexDirection="column">
        {children}
      </Row>
    </View>
  )
}
export default ProfileSettingRow
