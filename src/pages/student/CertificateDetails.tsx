import { DateTime } from 'luxon'
import { Text, VStack, useTheme, Heading, Button } from 'native-base'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import Card from '../../components/Card'
import CollapsibleContent from '../../components/CollapsibleContent'
import WithNavigation from '../../components/WithNavigation'
import { LFCertificate } from '../../types/lernfair/Certificate'

type CertificatePupil = {
  name: string
  subjectsFormatted: string[]
  startDate: string
  endDate: string
  hoursPerWeek: number
  activity: string[]
  medium: string
  status: string
}

const approvedPupil: CertificatePupil = {
  name: 'Name nicht da',
  subjectsFormatted: ['Mathe'],
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  hoursPerWeek: 10,
  activity: ['Noch nicht im Backend'],
  medium: 'PC',
  status: 'approved'
}

const awaitingPupil: CertificatePupil = {
  name: 'Name nicht da',
  subjectsFormatted: ['Mathe'],
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  hoursPerWeek: 10,
  activity: ['Noch nicht im Backend'],
  medium: 'PC',
  status: 'awaiting-approval'
}

const CertificateDetails: React.FC = () => {
  const { space } = useTheme()

  const location = useLocation() as { state: { certificate: LFCertificate } }
  const certificate = location?.state?.certificate || {}

  const approvedPupils = useMemo(() => {
    return new Array(2).fill(0).map((_, i) => approvedPupil)
  }, [])
  const awaitingPupils = useMemo(() => {
    return new Array(4).fill(0).map((_, i) => awaitingPupil)
  }, [])

  const PupilStatus: React.FC<{ pupil: CertificatePupil }> = ({ pupil }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const variant = useMemo(() => (isOpen ? 'dark' : 'normal'), [isOpen])
    const textColor = useMemo(
      () => (isOpen ? 'lightText' : 'darkText'),
      [isOpen]
    )
    return (
      <Card flexibleWidth padding={space['1']} variant={variant}>
        <Heading color={textColor}>{pupil.name}</Heading>
        <Text color={textColor}>
          <Text bold mr="0.5">
            Status:{' '}
          </Text>{' '}
          {pupil.status}
        </Text>

        <CollapsibleContent
          isOpen={isOpen}
          onPressHeader={() => setIsOpen(prev => !prev)}>
          <VStack mt={space['0.5']} space={'1'}>
            <Text color={textColor}>
              Fach: {pupil.subjectsFormatted?.join(',')}
            </Text>
            <Text color={textColor}>
              Startdatum:{' '}
              {DateTime.fromISO(pupil.startDate).toFormat('dd.MM.yyyy')}
            </Text>
            <Text color={textColor}>
              Enddatum: {DateTime.fromISO(pupil.endDate).toFormat('dd.MM.yyyy')}
            </Text>
            <Text color={textColor}>
              Zeitl. Aufwand: {pupil.hoursPerWeek} Stunden
            </Text>
            <Text color={textColor}>Tätigkeit: {pupil.activity.join(',')}</Text>
            <Text color={textColor}>Medium: {pupil.medium}</Text>
          </VStack>
        </CollapsibleContent>
        <Button variant="outline" mt={space['1']} _text={{ color: textColor }}>
          Erneut senden
        </Button>
      </Card>
    )
  }

  if (!certificate.uuid)
    return (
      <>
        <Text>Fehler beim Laden des Zertifikates</Text>
      </>
    )

  return (
    <WithNavigation headerLeft={<BackButton />}>
      <VStack space={space['1']} paddingX={space['1']}>
        <Heading>Bescheinigung {certificate.categories}</Heading>
        <Text>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua.
        </Text>

        {approvedPupils.length > 0 && (
          <VStack space={space['1']}>
            <Heading>Bestätigt</Heading>
            {approvedPupils.map((pupil, i) => (
              <PupilStatus pupil={pupil} />
            ))}
          </VStack>
        )}
        {awaitingPupils.length > 0 && (
          <VStack space={space['1']}>
            <Heading>Ausstehend</Heading>
            {awaitingPupils.map((pupil, i) => (
              <PupilStatus pupil={pupil} />
            ))}
          </VStack>
        )}
      </VStack>
    </WithNavigation>
  )
}
export default CertificateDetails
