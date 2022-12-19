import { DateTime } from 'luxon'
import { Text, VStack, useTheme, Heading, Button } from 'native-base'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import Card from '../../components/Card'
import CollapsibleContent from '../../components/CollapsibleContent'
import WithNavigation from '../../components/WithNavigation'
import { LFCertificate } from '../../types/lernfair/Certificate'
import AppointmentCard from '../../widgets/AppointmentCard'

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

const CertificateList: React.FC = () => {
  const { space } = useTheme()

  const navigate = useNavigate()
  const location = useLocation() as {
    state: { certificate: LFCertificate; type: 'group' | 'matching' }
  }
  const certificate = location?.state?.certificate || {}
  const certificateType = location?.state?.type || 'group'

  const approvedPupils = useMemo(() => {
    return new Array(2).fill(0).map((_, i) => approvedPupil)
  }, [])
  const awaitingPupils = useMemo(() => {
    return new Array(4).fill(0).map((_, i) => awaitingPupil)
  }, [])

  const PupilStatus: React.FC<{
    pupil: CertificatePupil
    variant?: 'normal' | 'dark'
  }> = ({ pupil, variant }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const textColor = useMemo(
      () => (variant === 'dark' ? 'lightText' : 'darkText'),
      [variant]
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
          textColor={textColor}
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
        {variant !== 'dark' && (
          <Button
            variant="outline"
            mt={space['1']}
            _text={{ color: textColor }}>
            Erneut senden
          </Button>
        )}
      </Card>
    )
  }

  const updateCertificates = useCallback(() => {
    navigate('/request-certificate', {
      state: { edit: true, type: certificateType }
    })
  }, [certificateType, navigate])

  return (
    <WithNavigation headerLeft={<BackButton />}>
      {/* {!certificate.uuid && <Text>Fehler beim Laden des Zertifikates</Text>} */}

      {(certificate.uuid || true) && (
        <VStack space={space['1']} paddingX={space['1']}>
          <Heading>
            {certificateType === 'group'
              ? 'Gruppenkurse'
              : '1:1 Lernunterstützung'}
          </Heading>
          <Text>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </Text>

          <Button onPress={updateCertificates}>
            Bescheinigungen aktualisieren
          </Button>

          {certificateType === 'matching' && (
            <>
              {approvedPupils.length > 0 && (
                <VStack space={space['1']}>
                  <Heading>Bestätigt</Heading>
                  {approvedPupils.map((pupil, i) => (
                    <PupilStatus pupil={pupil} variant="dark" />
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
            </>
          )}

          {certificateType === 'group' && (
            <VStack space={space['1']}>
              <AppointmentCard
                isGrid
                isFullHeight
                variant="horizontal"
                description={'Lorem Ipsum'}
                date={DateTime.now().toISO()}
                title={'Kursname'}
                tags={[
                  { name: 'Mathe', id: 0 },
                  { name: 'Deutsch', id: 0 }
                ]}
              />
            </VStack>
          )}

          <Heading>Tätigkeiten</Heading>
          <Text>• Bearbeitung und Vermittlung von Arbeitsinhalten</Text>
          <Text>• Digitale Unterstützung beim Lernen</Text>
        </VStack>
      )}
    </WithNavigation>
  )
}
export default CertificateList
