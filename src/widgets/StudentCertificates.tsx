import { gql, useQuery } from '@apollo/client'
import { DateTime } from 'luxon'
import {
  Text,
  Row,
  useTheme,
  Container,
  Column,
  Button,
  VStack,
  Heading
} from 'native-base'
import { useMemo } from 'react'
import Card from '../components/Card'
import { LFCertificate } from '../types/lernfair/Certificate'

type Props = {
  filter?: string
}

const StudentCertificates: React.FC<Props> = ({ filter }) => {
  const { space } = useTheme()
  const { data } = useQuery(gql`
    query {
      me {
        student {
          participationCertificates {
            categories
            certificateDate
            startDate
            endDate
            hoursPerWeek
            hoursTotal
            medium
            ongoingLessons
            state
            signatureDate
            signatureLocation
            subjectsFormatted
          }
        }
      }
    }
  `)

  const filteredCertificates: LFCertificate[] = useMemo(() => {
    if (!data?.me?.student?.participationCertificates) {
      return []
    }
    if (!filter) {
      return data?.me?.student?.participationCertificates
    }
    return data?.me?.student?.participationCertificates.filter(
      (cert: LFCertificate) => cert.state === filter
    )
  }, [data?.me?.student?.participationCertificates, filter])

  return (
    <VStack space={space['1']}>
      {filteredCertificates.map((cert: LFCertificate) => (
        <CertificateRow certificate={cert} />
      ))}
    </VStack>
  )
}

export default StudentCertificates

type CertificateProps = {
  certificate: LFCertificate
}

const CertificateRow: React.FC<CertificateProps> = ({ certificate }) => {
  const { space } = useTheme()
  return (
    <Card flexibleWidth>
      <Container
        padding={space['1']}
        width="100%"
        maxWidth="100%"
        alignItems="stretch">
        <Row space={space['1']} marginBottom={space['1']} alignItems="center">
          <Column>{/* <ProfilAvatar size="md" image={avatar} /> */}</Column>
          <Column></Column>
        </Row>
        <Row
          flexDirection="column"
          alignItems="stretch"
          space={space['0.5']}
          marginBottom={space['1']}>
          {certificate.subjectsFormatted && (
            <Row>
              <Text bold marginRight="5px">
                Fach:
              </Text>
              {certificate.subjectsFormatted.map((sub: string) => (
                <Text marginRight="5px">{sub}</Text>
              ))}
            </Row>
          )}

          {certificate.state && (
            <Column flexDirection="row">
              <Text bold marginRight="5px">
                Status:
              </Text>
              <Text>{certificate.state}</Text>
            </Column>
          )}

          {certificate.startDate && (
            <Column flexDirection="row">
              <Text bold marginRight="5px">
                Erstellt am:
              </Text>
              <Text>
                {DateTime.fromISO(certificate.startDate).toFormat('dd.MM.yyyy')}
              </Text>
            </Column>
          )}
        </Row>
      </Container>
    </Card>
  )
}
