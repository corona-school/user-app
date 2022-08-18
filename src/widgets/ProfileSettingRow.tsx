import { View, Row, Column, Heading, Tooltip, InfoIcon, Box } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
  help?: string
  isSpace?: boolean
}

const ProfileSettingRow: React.FC<Props> = ({
  title,
  children,
  help,
  isSpace = true
}) => {
  return (
    <View paddingY={isSpace ? 3 : 0}>
      <Row>
        <Column mb={2}>
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
