import {
  Text,
  Box,
  Row,
  InfoIcon,
  CloseIcon,
  Pressable,
  useTheme,
  Container,
  Tooltip,
  Column,
  Button
} from 'native-base'
import Card from '../components/Card'

import { Fragment } from 'react'
import ProfilAvatar from './ProfilAvatar'

type Props = {
  name: string
  subject?: string
  status?: string
  createDate?: string
  avatar?: string
  download?: () => any
}

const HelperCardCertificates: React.FC<Props> = ({
  name,
  subject,
  status,
  createDate,
  avatar,
  download
}) => {
  const { space } = useTheme()

  return (
    <Card flexibleWidth>
      <Container
        padding={space['1']}
        width="100%"
        maxWidth="100%"
        alignItems="stretch">
        <Row space={space['1']} marginBottom={space['1']} alignItems="center">
          <Column>
            <ProfilAvatar size="md" image={avatar} />
          </Column>
          <Column>
            {name && (
              <>
                <Text bold>Schüler:in</Text>
                <Text>{name}</Text>
              </>
            )}
          </Column>
        </Row>
        <Row
          flexDirection="column"
          alignItems="stretch"
          space={space['0.5']}
          marginBottom={space['1']}>
          {subject && (
            <Column flexDirection="row">
              <Text bold marginRight="5px">
                Fach:
              </Text>
              <Text>{subject}</Text>
            </Column>
          )}

          {status && (
            <Column flexDirection="row">
              <Text bold marginRight="5px">
                Status:
              </Text>
              <Text>{status}</Text>
            </Column>
          )}

          {createDate && (
            <Column flexDirection="row">
              <Text bold marginRight="5px">
                Erstellt am:
              </Text>
              <Text>{createDate}</Text>
            </Column>
          )}
        </Row>

        {download && (
          <Button onPress={download} variant="outline">
            Herunterladen
          </Button>
        )}
      </Container>
    </Card>
  )
}
export default HelperCardCertificates
