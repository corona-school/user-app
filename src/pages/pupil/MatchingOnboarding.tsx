import { Text, VStack, Box, Button, useTheme } from 'native-base'
import { useTranslation } from 'react-i18next'
import CTACard from '../../widgets/CTACard'

type Props = {
  onRequestMatch: () => any
}

const MatchingOnboarding: React.FC<Props> = ({ onRequestMatch }) => {
  const { t } = useTranslation()

  const { space } = useTheme()
  return (
    <VStack space={space['1']} paddingX={space['1']}>
      <Box bgColor="gray.500" h="150px"></Box>
      <Text>{t('matching.blocker.firstContent')}</Text>
      <Text bold>{t('matching.blocker.headlineContent')}</Text>
      <Text>
        {t('matching.blocker.contentBox1')}{' '}
        <Text bold> {t('matching.blocker.contentBox2')}</Text>
        {t('matching.blocker.contentBox3')}
      </Text>
      <Button variant="outline" onPress={onRequestMatch}>
        {t('matching.blocker.button')}
      </Button>
      <CTACard
        title={t('matching.blocker.ctaCardHeader')}
        content={<Text>{t('matching.blocker.ctaCardContent')}</Text>}
        button={<Button>{t('matching.blocker.ctaCardButton')}</Button>}
      />
    </VStack>
  )
}
export default MatchingOnboarding
