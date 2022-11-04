import { gql, useQuery } from '@apollo/client'
import {
  View,
  Text,
  Heading,
  Row,
  useTheme,
  Button,
  Box,
  useBreakpointValue,
  Column
} from 'native-base'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '../components/Card'
import InstructionProgress from './InstructionProgress'

type Props = {
  index?: number
}

const HelperWizard: React.FC<Props> = ({ index }) => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const { data, loading, called } = useQuery(gql`
    query {
      me {
        student {
          firstMatchRequest
          openMatchRequestCount
          certificateOfConduct {
            id
          }
          canRequestMatch {
            allowed
            reason
          }
          canCreateCourse {
            allowed
            reason
          }
        }
      }
    }
  `)
  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const ButtonDirection = useBreakpointValue({
    base: 'column',
    lg: 'row'
  })

  const ButtonSpace = useBreakpointValue({
    base: 0,
    lg: 0
  })

  const ContentsDirection = useBreakpointValue({
    base: 'flex-start',
    lg: 'center'
  })

  const ContentsSpace = useBreakpointValue({
    base: space['1'],
    lg: 0
  })

  const ZeugnisContentSectionWidth = useBreakpointValue({
    base: '100%',
    lg: '70%'
  })

  const ButtonWidthContainer = useBreakpointValue({
    base: '100%',
    lg: 'auto'
  })

  const onboardingIndex: number = useMemo(() => {
    if (data?.me?.student?.canCreateCourse.reason === 'not-screened') return 0
    if (data?.me?.student?.canRequestMatch?.reason === 'not-screened') return 1
    if (!data?.me?.student?.firstMatchRequest) return 2
    if (!data?.me?.student?.certificateOfConduct?.id) return 3
    return 0
  }, [
    data?.me?.student?.canCreateCourse.reason,
    data?.me?.student?.canRequestMatch.reason,
    data?.me?.student?.certificateOfConduct?.id,
    data?.me?.student?.firstMatchRequest
  ])

  return (
    <View>
      <Card variant="dark" flexibleWidth>
        <Row padding="30px" flexDirection="column">
          <Heading fontSize="lg" color="lightText" marginBottom="17px">
            {t('helperwizard.nextStep')}
          </Heading>

          <InstructionProgress
            currentIndex={onboardingIndex}
            isDark={true}
            instructions={[
              {
                label: t('helperwizard.kennenlernen.label'),
                title: '',
                content: [
                  {
                    title: t('helperwizard.kennenlernen.title'),
                    text: (
                      <Box
                        flexDir={ButtonDirection}
                        alignItems={ContentsDirection}
                        width="100%"
                        justifyContent="space-between">
                        <Text
                          width={ZeugnisContentSectionWidth}
                          display="block"
                          marginBottom={ContentsSpace}>
                          {t('helperwizard.kennenlernen.content')}
                        </Text>
                        <Button
                          width={ButtonContainer}
                          marginRight={ButtonSpace}>
                          {t('helperwizard.kennenlernen.button')}
                        </Button>
                      </Box>
                    )
                  }
                ]
              },
              {
                label: t('helperwizard.zeugnis.label'),
                title: '',
                content: [
                  {
                    title: t('helperwizard.zeugnis.title'),
                    text: (
                      <Box width="100%">
                        <Box
                          flexDirection="row"
                          marginBottom={space['0.5']}
                          display="block"
                          maxWidth="500px">
                          <Text marginRight="5px">
                            {t('helperwizard.zeugnis.einreichen')}
                          </Text>
                          <Text bold color="primary.400">
                            tt.mm.jjjj
                          </Text>
                        </Box>
                        <Box
                          flexDir={ButtonDirection}
                          alignItems={ContentsDirection}
                          width="100%"
                          justifyContent="space-between">
                          <Column width={ZeugnisContentSectionWidth}>
                            <Text marginBottom={ContentsSpace}>
                              {t('helperwizard.zeugnis.content')}
                            </Text>
                          </Column>
                          <Column width={ButtonWidthContainer}>
                            <Button
                              overflow="visible"
                              width={ButtonContainer}
                              marginRight={ButtonSpace}>
                              {t('helperwizard.zeugnis.button')}
                            </Button>
                          </Column>
                        </Box>
                      </Box>
                    )
                  }
                ]
              },
              {
                label: t('helperwizard.angebot.label'),
                title: '',
                content: [
                  {
                    title: t('helperwizard.angebot.title'),
                    text: (
                      <Box width="100%">
                        <Box
                          flexDir={ButtonDirection}
                          alignItems={ContentsDirection}
                          width="100%"
                          justifyContent="space-between">
                          <Column width={ZeugnisContentSectionWidth}>
                            <Text marginBottom={ContentsSpace}>
                              {t('helperwizard.angebot.content')}
                            </Text>
                          </Column>
                          <Column width={ButtonWidthContainer}>
                            <Button
                              width={ButtonContainer}
                              marginRight={ButtonSpace}>
                              {t('helperwizard.angebot.button')}
                            </Button>
                          </Column>
                        </Box>
                      </Box>
                    )
                  }
                ]
              },
              {
                label: t('helperwizard.zeugnisHochladen.label'),
                title: '',
                content: [
                  {
                    title: t('helperwizard.zeugnisHochladen.title'),
                    text: (
                      <Box width="100%">
                        <Box
                          flexDir={ButtonDirection}
                          alignItems={ContentsDirection}
                          width="100%"
                          justifyContent="space-between">
                          <Column width={ZeugnisContentSectionWidth}>
                            <Text marginBottom={ContentsSpace}>
                              {t('helperwizard.zeugnisHochladen.content')}
                            </Text>
                          </Column>
                          <Column width={ButtonWidthContainer}>
                            <Button
                              width={ButtonContainer}
                              marginRight={ButtonSpace}>
                              {t('helperwizard.zeugnisHochladen.button')}
                            </Button>
                          </Column>
                        </Box>
                      </Box>
                    )
                  }
                ]
              }
            ]}
          />
        </Row>
      </Card>
    </View>
  )
}
export default HelperWizard
